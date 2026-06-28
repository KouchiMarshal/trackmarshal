import { NextRequest } from "next/server";
import { geminiStream, hasGeminiKey, MARSHAL_KNOWLEDGE, NO_OFFICIAL_PARTNERSHIP, type GeminiContent } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

type ChatMessage = { role: "user" | "assistant"; content: string };

const SYSTEM = `Tu es l'assistant pédagogique de TrackMarshal, dédié aux commissaires de piste en sport automobile et motocycliste en France.

Ton rôle : aider les débutants et les commissaires confirmés à comprendre le métier — drapeaux, procédures, sécurité, rôles, licences, équipement, déroulé d'une épreuve.

Règles :
- Réponds toujours en français, de façon claire, concise et bienveillante.
- Appuie-toi sur la base de connaissances ci-dessous. Si une question sort du cadre du commissariat sportif, recentre poliment.
- Pour les points réglementaires précis (licences, exigences fédérales), rappelle qu'il faut vérifier auprès de la FFSA, de la FFM ou de l'ASA locale, car les règles évoluent.
- N'invente jamais de chiffres, d'articles de règlement ou de procédures. En cas de doute, dis-le.
- ${NO_OFFICIAL_PARTNERSHIP}
- Réponses courtes par défaut (quelques phrases), listes à puces quand c'est utile. Pas de jargon inutile.

BASE DE CONNAISSANCES
${MARSHAL_KNOWLEDGE}`;

export async function POST(req: NextRequest) {
  if (!hasGeminiKey()) {
    return Response.json({ error: "Assistant indisponible (configuration manquante)." }, { status: 503 });
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }

  const history = Array.isArray(body.messages) ? body.messages : [];
  const cleaned = history
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-12);

  if (cleaned.length === 0 || cleaned[cleaned.length - 1].role !== "user") {
    return Response.json({ error: "Aucun message à traiter." }, { status: 400 });
  }

  // Gemini utilise les rôles "user" et "model".
  const contents: GeminiContent[] = cleaned.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content.slice(0, 4000) }],
  }));

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const upstream = await geminiStream({ system: SYSTEM, contents, maxOutputTokens: 1024 });
        if (!upstream.ok || !upstream.body) {
          const detail = await upstream.text().catch(() => "");
          console.error("Gemini assistant upstream error:", upstream.status, detail.slice(0, 800));
          controller.enqueue(encoder.encode("⚠️ L'assistant est momentanément indisponible."));
          controller.close();
          return;
        }

        const reader = upstream.body.getReader();
        let buffer = "";
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // Flux SSE : des lignes "data: { ... }" séparées par des sauts de ligne.
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const payload = trimmed.slice(5).trim();
            if (!payload || payload === "[DONE]") continue;
            try {
              const json = JSON.parse(payload);
              const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) controller.enqueue(encoder.encode(text));
            } catch {
              // fragment incomplet : ignoré, sera complété au prochain chunk
            }
          }
        }
      } catch (err) {
        console.error("Assistant stream error:", err);
        controller.enqueue(encoder.encode("\n\n⚠️ Une erreur est survenue. Réessaie dans un instant."));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}

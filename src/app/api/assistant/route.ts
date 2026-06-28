import { NextRequest } from "next/server";
import { getAnthropic, AI_MODEL, MARSHAL_KNOWLEDGE, NO_OFFICIAL_PARTNERSHIP } from "@/lib/anthropic";

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
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "Assistant indisponible (configuration manquante)." }, { status: 503 });
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }

  const history = Array.isArray(body.messages) ? body.messages : [];
  // On borne l'historique et on nettoie les entrées.
  const messages = history
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));

  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return Response.json({ error: "Aucun message à traiter." }, { status: 400 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const llmStream = getAnthropic().messages.stream({
          model: AI_MODEL,
          max_tokens: 1024,
          system: SYSTEM,
          messages,
        });

        for await (const event of llmStream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
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

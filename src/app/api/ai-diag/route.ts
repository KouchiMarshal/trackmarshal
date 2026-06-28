import { GEMINI_MODEL, hasGeminiKey } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

// Modèles candidats à tester pour trouver lequel a du quota gratuit sur ce compte.
const CANDIDATES = [
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
];

async function probe(model: string, key: string) {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: "Dis: OK" }] }],
          generationConfig: { maxOutputTokens: 5 },
        }),
      },
    );
    const text = await res.text();
    let parsed: any = null;
    try { parsed = JSON.parse(text); } catch {}
    return {
      model,
      status: res.status,
      works: res.ok,
      error: res.ok ? null : (parsed?.error?.status || parsed?.error?.message || text.slice(0, 120)),
    };
  } catch (e: any) {
    return { model, status: 0, works: false, error: e?.message || String(e) };
  }
}

export async function GET() {
  if (!hasGeminiKey()) {
    return Response.json({
      ok: false,
      keyPresent: false,
      hint: "GEMINI_API_KEY absente de ce déploiement (ou pas redéployé après l'ajout).",
    });
  }

  const key = process.env.GEMINI_API_KEY!;
  const results = [];
  for (const m of CANDIDATES) {
    results.push(await probe(m, key));
  }

  const working = results.filter((r) => r.works).map((r) => r.model);

  return Response.json({
    keyPresent: true,
    currentModel: GEMINI_MODEL,
    working,
    recommendation: working[0] ?? null,
    hint: working.length
      ? `Modèle(s) gratuit(s) disponible(s) : ${working.join(", ")}. Le site utilise automatiquement « ${working[0]} » si tu définis GEMINI_MODEL dessus.`
      : "Aucun modèle Gemini gratuit disponible sur ce compte — il faudra soit activer la facturation Google (très peu cher), soit passer à Groq/Mistral (gratuits).",
    results,
  });
}

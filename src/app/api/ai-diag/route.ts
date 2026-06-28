import { GEMINI_MODEL, hasGeminiKey } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Petit diagnostic : ouvre /api/ai-diag dans le navigateur pour voir
// exactement ce que répond l'API Google (sans jamais exposer la clé).
export async function GET() {
  if (!hasGeminiKey()) {
    return Response.json({
      ok: false,
      keyPresent: false,
      hint: "La variable d'environnement GEMINI_API_KEY n'est pas définie sur ce déploiement (ou pas redéployé après l'ajout).",
    });
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY! },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: "Réponds juste: OK" }] }],
          generationConfig: { maxOutputTokens: 10 },
        }),
      },
    );

    const bodyText = await res.text();
    let parsed: any = null;
    try { parsed = JSON.parse(bodyText); } catch {}

    return Response.json({
      ok: res.ok,
      keyPresent: true,
      model: GEMINI_MODEL,
      status: res.status,
      // Message d'erreur Google (le cas échéant), tronqué.
      googleError: parsed?.error?.message ?? (res.ok ? null : bodyText.slice(0, 500)),
      sample: res.ok ? parsed?.candidates?.[0]?.content?.parts?.[0]?.text ?? null : null,
    });
  } catch (err: any) {
    return Response.json({
      ok: false,
      keyPresent: true,
      error: "Échec réseau vers l'API Google : " + (err?.message || String(err)),
    });
  }
}

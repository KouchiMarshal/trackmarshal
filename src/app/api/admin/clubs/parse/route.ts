import { NextRequest } from "next/server";
import { geminiJSON, hasGeminiKey } from "@/lib/ai";
import { getAdminUser } from "@/lib/server-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  if (!hasGeminiKey()) {
    return Response.json({ error: "Analyse indisponible (configuration manquante)." }, { status: 503 });
  }
  const admin = await getAdminUser(req);
  if (!admin) {
    return Response.json({ error: "Accès réservé aux administrateurs." }, { status: 403 });
  }

  let body: { text?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }
  const text = (body.text || "").slice(0, 20000).trim();
  if (!text) {
    return Response.json({ error: "Colle d'abord la liste des clubs." }, { status: 400 });
  }

  const SYSTEM =
    "Tu extrais des clubs de sport automobile (ASA) ou moto (clubs FFM) depuis un texte brut. Tu renvoies uniquement du JSON, sans jamais inventer de coordonnées.";

  const prompt = `Analyse cette liste de clubs / ASA et renvoie UNIQUEMENT un objet JSON :
{
  "clubs": [
    {
      "name": "nom du club ou de l'ASA",
      "type": "ASA | Club FFM | Ligue | Écurie | null",
      "region": "région française si déductible, sinon null",
      "department": "département si présent, sinon null",
      "city": "ville si présente, sinon null",
      "website": "URL du site si présente, sinon null",
      "email": "email si présent, sinon null",
      "phone": "téléphone si présent, sinon null"
    }
  ]
}

Règles STRICTES :
- N'invente JAMAIS d'email, de téléphone, d'URL ou de ville. Mets null si absent du texte.
- Garde uniquement les vrais clubs/ASA (ignore les entêtes, titres de section).

TEXTE :
${text}`;

  try {
    const data = await geminiJSON({ system: SYSTEM, prompt, maxOutputTokens: 8000 });
    const raw: any[] = Array.isArray(data?.clubs) ? data.clubs : [];
    const clubs = raw
      .filter((c) => c && typeof c.name === "string" && c.name.trim())
      .map((c) => ({
        name: String(c.name).slice(0, 160),
        type: typeof c.type === "string" ? c.type.slice(0, 40) : null,
        region: typeof c.region === "string" ? c.region.slice(0, 60) : null,
        department: typeof c.department === "string" ? c.department.slice(0, 60) : null,
        city: typeof c.city === "string" ? c.city.slice(0, 80) : null,
        website: typeof c.website === "string" && /^https?:\/\//.test(c.website) ? c.website : null,
        email: typeof c.email === "string" && /@/.test(c.email) ? c.email.slice(0, 120) : null,
        phone: typeof c.phone === "string" ? c.phone.slice(0, 40) : null,
      }));

    if (clubs.length === 0) {
      return Response.json({ error: "Aucun club détecté dans ce texte." }, { status: 422 });
    }
    return Response.json({ clubs });
  } catch (err: any) {
    console.error("Clubs parse error:", err);
    return Response.json({ error: "Analyse impossible : " + (err?.message || "erreur inconnue") }, { status: 500 });
  }
}

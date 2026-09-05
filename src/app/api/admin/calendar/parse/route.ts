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

  let body: { text?: string; year?: number };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }

  const text = (body.text || "").slice(0, 20000).trim();
  if (!text) {
    return Response.json({ error: "Colle d'abord le contenu du calendrier." }, { status: 400 });
  }
  const year = Number(body.year) || new Date().getFullYear();

  const SYSTEM =
    "Tu extrais des épreuves de sport automobile ou moto depuis un texte de calendrier (souvent brut, copié-collé). Tu renvoies uniquement du JSON structuré, sans rien inventer.";

  const prompt = `Analyse ce calendrier d'épreuves motorsport et renvoie UNIQUEMENT un objet JSON de la forme :
{
  "events": [
    {
      "title": "nom de l'épreuve",
      "discipline": "Rallye | Circuit | Karting | Course de côte | Rallycross | Endurance | Motocross | ... (au mieux)",
      "location": "ville ou circuit",
      "region": "région française si déductible, sinon null",
      "start_date": "AAAA-MM-JJ",
      "end_date": "AAAA-MM-JJ ou null si un seul jour",
      "official_url": "URL du site officiel si présente dans le texte, sinon null"
    }
  ]
}

Règles :
- Année de référence si non précisée : ${year}.
- Dates au format ISO AAAA-MM-JJ. Si une épreuve dure plusieurs jours, remplis end_date.
- N'invente jamais d'URL ni de date. Mets null si l'information est absente.
- Ignore les lignes qui ne sont pas des épreuves (titres de section, entêtes).

TEXTE DU CALENDRIER :
${text}`;

  try {
    const data = await geminiJSON({ system: SYSTEM, prompt, maxOutputTokens: 8000 });
    const raw: any[] = Array.isArray(data?.events) ? data.events : [];

    const events = raw
      .filter((e) => e && typeof e.title === "string" && typeof e.start_date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(e.start_date))
      .map((e) => ({
        title: String(e.title).slice(0, 200),
        discipline: typeof e.discipline === "string" ? e.discipline.slice(0, 60) : null,
        location: typeof e.location === "string" ? e.location.slice(0, 120) : null,
        region: typeof e.region === "string" ? e.region.slice(0, 60) : null,
        start_date: e.start_date,
        end_date: typeof e.end_date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(e.end_date) ? e.end_date : null,
        official_url: typeof e.official_url === "string" && /^https?:\/\//.test(e.official_url) ? e.official_url : null,
      }));

    if (events.length === 0) {
      return Response.json({ error: "Aucune épreuve détectée dans ce texte." }, { status: 422 });
    }

    return Response.json({ events });
  } catch (err: any) {
    console.error("Calendar parse error:", err);
    return Response.json({ error: "Analyse impossible : " + (err?.message || "erreur inconnue") }, { status: 500 });
  }
}

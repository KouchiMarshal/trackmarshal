import { NextRequest } from "next/server";
import { geminiText, hasGeminiKey, MARSHAL_KNOWLEDGE, NO_OFFICIAL_PARTNERSHIP } from "@/lib/ai";
import { getAuthUser } from "@/lib/server-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const SYSTEM = `Tu rédiges des briefings clairs et structurés pour les commissaires de piste d'un événement de sport automobile ou motocycliste, en France.

Règles :
- Français, ton professionnel et concret, prêt à être lu par les commissaires.
- Structure en sections courtes avec des intertitres et des listes à puces : accueil & horaires, consignes de sécurité, signalisation/drapeaux, organisation des postes, communication (radio/PC course), en cas d'incident, divers.
- Adapte au contexte fourni (discipline, lieu, dates). N'invente pas d'informations pratiques précises (heures, noms, numéros) : laisse des champs à compléter entre crochets, ex. [Heure d'accueil], [Nom du chef de poste].
- Reste fidèle aux conventions ci-dessous. ${NO_OFFICIAL_PARTNERSHIP}
- 250 à 400 mots maximum.

BASE DE CONNAISSANCES
${MARSHAL_KNOWLEDGE}`;

export async function POST(req: NextRequest) {
  if (!hasGeminiKey()) {
    return Response.json({ error: "Génération indisponible (configuration manquante)." }, { status: 503 });
  }

  const user = await getAuthUser(req);
  if (!user) {
    return Response.json({ error: "Connexion requise." }, { status: 401 });
  }

  let body: {
    title?: string;
    discipline?: string;
    location?: string;
    country?: string;
    eventDate?: string;
    marshalsNeeded?: string | number;
    schedule?: string;
  };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }

  const ctx = [
    body.title && `Événement : ${body.title}`,
    body.discipline && `Discipline : ${body.discipline}`,
    [body.location, body.country].filter(Boolean).length && `Lieu : ${[body.location, body.country].filter(Boolean).join(", ")}`,
    body.eventDate && `Date : ${body.eventDate}`,
    body.marshalsNeeded && `Commissaires attendus : ${body.marshalsNeeded}`,
    body.schedule && `Éléments de planning fournis : ${String(body.schedule).slice(0, 600)}`,
  ].filter(Boolean).join("\n");

  const prompt = `Rédige le briefing commissaires pour cet événement.\n\n${ctx || "Aucun détail fourni : produis un briefing générique adaptable."}`;

  try {
    const briefing = await geminiText({ system: SYSTEM, prompt, maxOutputTokens: 1400 });
    return Response.json({ briefing });
  } catch (err: any) {
    console.error("Briefing generation error:", err);
    return Response.json({ error: "Génération impossible : " + (err?.message || "erreur inconnue") }, { status: 500 });
  }
}

import { NextRequest } from "next/server";
import { geminiText, hasGeminiKey, NO_OFFICIAL_PARTNERSHIP } from "@/lib/ai";
import { getAdminUser } from "@/lib/server-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  if (!hasGeminiKey()) {
    return Response.json({ error: "Génération indisponible (configuration manquante)." }, { status: 503 });
  }

  // Réservé aux administrateurs.
  const admin = await getAdminUser(req);
  if (!admin) {
    return Response.json({ error: "Accès réservé aux administrateurs." }, { status: 403 });
  }

  let body: { marshalId?: string; lang?: "fr" | "en" };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }

  const marshalId = body.marshalId;
  const lang = body.lang === "en" ? "en" : "fr";
  if (!marshalId) {
    return Response.json({ error: "Commissaire manquant." }, { status: 400 });
  }

  // Données du commissaire (clé service : contourne le RLS).
  const [{ data: profile }, { data: licenses }, { data: apps }, { data: reviews }] = await Promise.all([
    supabaseAdmin.from("profiles").select("*").eq("id", marshalId).single(),
    supabaseAdmin.from("licenses").select("type, category, verified").eq("user_id", marshalId),
    supabaseAdmin
      .from("applications")
      .select("events(title, discipline, event_date, location)")
      .eq("marshal_id", marshalId)
      .eq("status", "accepted"),
    supabaseAdmin.from("reviews").select("rating, comment").eq("marshal_id", marshalId),
  ]);

  if (!profile) {
    return Response.json({ error: "Commissaire introuvable." }, { status: 404 });
  }

  const events = (apps || []).map((a: any) => a.events).filter(Boolean);
  const disciplines = Array.from(
    new Set([
      ...(profile.disciplines ? String(profile.disciplines).split(",").map((d: string) => d.trim()) : []),
      ...events.map((e: any) => e.discipline).filter(Boolean),
    ]),
  );
  const ratings = (reviews || []).map((r: any) => r.rating).filter((n: any) => typeof n === "number");
  const avg = ratings.length ? (ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length).toFixed(1) : null;

  const facts = [
    `Nom : ${profile.full_name || "—"}`,
    profile.city && `Ville : ${profile.city}`,
    profile.region && `Région : ${profile.region}`,
    profile.years_experience && `Années d'expérience : ${profile.years_experience}`,
    disciplines.length && `Disciplines : ${disciplines.join(", ")}`,
    `Événements officiés (plateforme) : ${events.length}`,
    (licenses || []).length && `Licences : ${(licenses || []).map((l: any) => `${l.type || "licence"}${l.verified ? " (vérifiée)" : ""}`).join(", ")}`,
    avg && `Note moyenne reçue : ${avg}/5 sur ${ratings.length} évaluation(s)`,
    profile.bio && `Bio actuelle (à améliorer) : ${profile.bio}`,
  ].filter(Boolean).join("\n");

  const SYSTEM =
    lang === "en"
      ? `You write concise, professional third-person biographies for motorsport marshals, for a CV. Factual, valued but never exaggerated. 2 to 4 sentences. ${NO_OFFICIAL_PARTNERSHIP} Use only the provided facts; never invent.`
      : `Tu rédiges des biographies professionnelles, concises et à la troisième personne, pour des commissaires de piste, destinées à un CV. Factuel, valorisant sans exagérer. 2 à 4 phrases. ${NO_OFFICIAL_PARTNERSHIP} Utilise uniquement les informations fournies ; n'invente jamais.`;

  const prompt =
    (lang === "en"
      ? "Write the marshal biography from these facts:\n\n"
      : "Rédige la biographie du commissaire à partir de ces informations :\n\n") + facts;

  try {
    const bio = await geminiText({ system: SYSTEM, prompt, maxOutputTokens: 400, temperature: 0.6 });
    return Response.json({ bio });
  } catch (err: any) {
    console.error("Bio generation error:", err);
    return Response.json({ error: "Génération impossible : " + (err?.message || "erreur inconnue") }, { status: 500 });
  }
}

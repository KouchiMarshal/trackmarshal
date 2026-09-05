import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Route publique : un visiteur propose un club / un contact. Stocké pour
// modération admin (aucune lecture publique). Garde-fous basiques anti-spam.
export async function POST(req: NextRequest) {
  let body: { kind?: string; name?: string; category?: string; region?: string; city?: string; contact?: string; message?: string; website?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }

  const name = (body.name || "").trim();
  if (name.length < 2) {
    return Response.json({ error: "Indique au moins le nom du club ou de l'épreuve." }, { status: 400 });
  }
  // Honeypot anti-bot : si "website" est rempli, on ignore silencieusement.
  if (body.website && body.website.trim()) {
    return Response.json({ ok: true });
  }

  const row = {
    kind: ["annuaire", "calendrier"].includes(body.kind || "") ? body.kind : "annuaire",
    name: name.slice(0, 160),
    category: ["club", "circuit", "evenement"].includes(body.category || "") ? body.category : null,
    region: (body.region || "").slice(0, 80) || null,
    city: (body.city || "").slice(0, 80) || null,
    contact: (body.contact || "").slice(0, 300) || null,
    message: (body.message || "").slice(0, 2000) || null,
  };

  const { error } = await supabaseAdmin.from("club_suggestions").insert(row);
  if (error) {
    return Response.json({ error: "Enregistrement impossible pour le moment." }, { status: 500 });
  }
  return Response.json({ ok: true });
}

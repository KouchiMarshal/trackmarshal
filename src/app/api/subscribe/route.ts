import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Validation d'email simple mais robuste (pas de regex exhaustive inutile).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Route publique : un visiteur laisse son email pour recevoir les nouveautes.
// Stockage discret, aucune lecture publique. Garde-fous anti-spam basiques.
export async function POST(req: NextRequest) {
  let body: { email?: string; source?: string; website?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }

  // Honeypot anti-bot : si "website" est rempli, on ignore silencieusement.
  if (body.website && body.website.trim()) {
    return Response.json({ ok: true });
  }

  const email = (body.email || "").trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 200) {
    return Response.json({ error: "Adresse email invalide." }, { status: 400 });
  }

  const row = {
    email,
    source: (body.source || "site").slice(0, 60),
  };

  // upsert pour ignorer proprement les doublons (email unique).
  const { error } = await supabaseAdmin
    .from("subscribers")
    .upsert(row, { onConflict: "email", ignoreDuplicates: true });

  if (error) {
    return Response.json({ error: "Enregistrement impossible pour le moment." }, { status: 500 });
  }
  return Response.json({ ok: true });
}

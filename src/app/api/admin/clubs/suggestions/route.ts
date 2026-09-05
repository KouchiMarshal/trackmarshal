import { NextRequest } from "next/server";
import { getAdminUser } from "@/lib/server-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET : liste des suggestions (admin). POST { id } : supprime une suggestion.
export async function GET(req: NextRequest) {
  const admin = await getAdminUser(req);
  if (!admin) return Response.json({ error: "Accès réservé aux administrateurs." }, { status: 403 });

  const { data, error } = await supabaseAdmin
    .from("club_suggestions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ suggestions: data || [] });
}

export async function POST(req: NextRequest) {
  const admin = await getAdminUser(req);
  if (!admin) return Response.json({ error: "Accès réservé aux administrateurs." }, { status: 403 });

  let body: { id?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }
  if (!body.id) return Response.json({ error: "Suggestion manquante." }, { status: 400 });

  const { error } = await supabaseAdmin.from("club_suggestions").delete().eq("id", body.id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}

import { NextRequest } from "next/server";
import { getAdminUser } from "@/lib/server-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const admin = await getAdminUser(req);
  if (!admin) {
    return Response.json({ error: "Accès réservé aux administrateurs." }, { status: 403 });
  }

  let body: { marshalId?: string; bio?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }

  if (!body.marshalId || typeof body.bio !== "string") {
    return Response.json({ error: "Paramètres manquants." }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ bio: body.bio.slice(0, 2000) })
    .eq("id", body.marshalId);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json({ ok: true });
}

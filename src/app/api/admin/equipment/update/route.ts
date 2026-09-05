import { NextRequest } from "next/server";
import { getAdminUser } from "@/lib/server-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const admin = await getAdminUser(req);
  if (!admin) return Response.json({ error: "Accès réservé aux administrateurs." }, { status: 403 });

  let body: { id?: string; fields?: Record<string, any> };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }
  if (!body.id || !body.fields) return Response.json({ error: "Paramètres manquants." }, { status: 400 });

  const allowed = ["title", "tip", "url", "position"];
  const update: Record<string, any> = {};
  for (const k of allowed) {
    if (k in body.fields) {
      let v = body.fields[k];
      if (k === "url") v = v && /^https?:\/\//.test(v) ? v : null;
      if (k === "position") v = Number(v) || 0;
      if (k !== "position" && v === "") v = null;
      update[k] = v;
    }
  }
  if (Object.keys(update).length === 0) return Response.json({ error: "Rien à mettre à jour." }, { status: 400 });

  const { error } = await supabaseAdmin.from("equipment").update(update).eq("id", body.id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}

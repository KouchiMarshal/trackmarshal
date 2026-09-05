import { NextRequest } from "next/server";
import { getAdminUser } from "@/lib/server-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const admin = await getAdminUser(req);
  if (!admin) return Response.json({ error: "Accès réservé aux administrateurs." }, { status: 403 });

  let body: { title?: string; tip?: string; url?: string; position?: number };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }

  const title = (body.title || "").trim();
  if (title.length < 2) return Response.json({ error: "Indique un nom de produit." }, { status: 400 });

  const row = {
    title: title.slice(0, 160),
    tip: (body.tip || "").slice(0, 500) || null,
    url: body.url && /^https?:\/\//.test(body.url) ? body.url : null,
    position: Number.isFinite(body.position) ? Number(body.position) : 999,
  };

  const { error } = await supabaseAdmin.from("equipment").insert(row);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}

import { NextRequest } from "next/server";
import { getAdminUser } from "@/lib/server-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { DEFAULT_EQUIPMENT } from "@/lib/equipment";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Importe la liste par defaut (les produits deja en dur) dans la base,
// uniquement si la table est vide, pour ne pas creer de doublons.
export async function POST(req: NextRequest) {
  const admin = await getAdminUser(req);
  if (!admin) return Response.json({ error: "Accès réservé aux administrateurs." }, { status: 403 });

  const { count } = await supabaseAdmin.from("equipment").select("id", { count: "exact", head: true });
  if ((count ?? 0) > 0) {
    return Response.json({ error: "La liste contient déjà des produits — import ignoré pour éviter les doublons." }, { status: 409 });
  }

  const rows = DEFAULT_EQUIPMENT.map((e, i) => ({
    title: e.title,
    tip: e.tip,
    url: e.url,
    position: (i + 1) * 10,
  }));

  const { error } = await supabaseAdmin.from("equipment").insert(rows);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ inserted: rows.length });
}

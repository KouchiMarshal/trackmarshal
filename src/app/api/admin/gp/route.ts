import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getAdminUser } from "@/lib/server-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Liste des Grands Prix / grands événements (admin uniquement, le temps que
// la page /grands-prix-f1 soit masquée au public).
export async function GET(req: NextRequest) {
  const admin = await getAdminUser(req);
  if (!admin) return Response.json({ error: "Non autorisé." }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("clubs")
    .select("*")
    .or("type.ilike.%grand prix%,type.ilike.%formule 1%")
    .order("name");

  if (error) return Response.json({ error: "Lecture impossible." }, { status: 500 });
  return Response.json({ gps: data ?? [] });
}

import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getAdminUser } from "@/lib/server-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Liste des abonnes (admin uniquement).
export async function GET(req: NextRequest) {
  const admin = await getAdminUser(req);
  if (!admin) return Response.json({ error: "Non autorisé." }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("subscribers")
    .select("id, email, source, created_at")
    .order("created_at", { ascending: false });

  if (error) return Response.json({ error: "Lecture impossible." }, { status: 500 });
  return Response.json({ subscribers: data ?? [] });
}

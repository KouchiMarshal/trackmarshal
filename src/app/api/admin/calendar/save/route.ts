import { NextRequest } from "next/server";
import { getAdminUser } from "@/lib/server-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ev = {
  title?: string;
  discipline?: string | null;
  location?: string | null;
  region?: string | null;
  start_date?: string;
  end_date?: string | null;
  official_url?: string | null;
};

export async function POST(req: NextRequest) {
  const admin = await getAdminUser(req);
  if (!admin) {
    return Response.json({ error: "Accès réservé aux administrateurs." }, { status: 403 });
  }

  let body: { events?: Ev[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }

  const rows = (body.events || [])
    .filter((e) => e && typeof e.title === "string" && typeof e.start_date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(e.start_date))
    .map((e) => ({
      title: e.title!.slice(0, 200),
      discipline: e.discipline ? String(e.discipline).slice(0, 60) : null,
      location: e.location ? String(e.location).slice(0, 120) : null,
      region: e.region ? String(e.region).slice(0, 60) : null,
      start_date: e.start_date!,
      end_date: e.end_date && /^\d{4}-\d{2}-\d{2}$/.test(e.end_date) ? e.end_date : null,
      official_url: e.official_url && /^https?:\/\//.test(e.official_url) ? e.official_url : null,
    }));

  if (rows.length === 0) {
    return Response.json({ error: "Aucune épreuve valide à enregistrer." }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("calendar_events").insert(rows);
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json({ inserted: rows.length });
}

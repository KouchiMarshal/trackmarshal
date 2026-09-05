import { NextRequest } from "next/server";
import { getAdminUser } from "@/lib/server-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Club = {
  name?: string;
  type?: string | null;
  region?: string | null;
  department?: string | null;
  city?: string | null;
  description?: string | null;
  registration_steps?: string | null;
  website?: string | null;
  email?: string | null;
  phone?: string | null;
};

export async function POST(req: NextRequest) {
  const admin = await getAdminUser(req);
  if (!admin) {
    return Response.json({ error: "Accès réservé aux administrateurs." }, { status: 403 });
  }

  let body: { clubs?: Club[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }

  const rows = (body.clubs || [])
    .filter((c) => c && typeof c.name === "string" && c.name.trim())
    .map((c) => ({
      name: c.name!.slice(0, 160),
      type: c.type ? String(c.type).slice(0, 40) : null,
      region: c.region ? String(c.region).slice(0, 60) : null,
      department: c.department ? String(c.department).slice(0, 60) : null,
      city: c.city ? String(c.city).slice(0, 80) : null,
      description: c.description ? String(c.description).slice(0, 600) : null,
      registration_steps: c.registration_steps ? String(c.registration_steps).slice(0, 3000) : null,
      website: c.website && /^https?:\/\//.test(c.website) ? c.website : null,
      email: c.email && /@/.test(c.email) ? c.email.slice(0, 120) : null,
      phone: c.phone ? String(c.phone).slice(0, 40) : null,
    }));

  if (rows.length === 0) {
    return Response.json({ error: "Aucun club valide à enregistrer." }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("clubs").insert(rows);
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json({ inserted: rows.length });
}

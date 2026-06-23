import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const ADMIN_EMAILS = [
  "foussardk@gmail.com",
  ...(process.env.NEXT_PUBLIC_ADMIN_EMAIL ? [process.env.NEXT_PUBLIC_ADMIN_EMAIL] : []),
];

async function getAdminUser(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) return null;
  const isAdmin = ADMIN_EMAILS.includes(user.email || "") || user.user_metadata?.role === "admin";
  if (!isAdmin) return null;
  return user;
}

export async function GET(req: NextRequest) {
  const admin = await getAdminUser(req);
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId manquant" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("career_events")
    .select("*")
    .eq("user_id", userId)
    .order("event_date", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ events: data });
}

export async function POST(req: NextRequest) {
  const admin = await getAdminUser(req);
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const { userId, event_name, event_date, event_end_date, location, role, discipline, organizer_name, notes } = body;
  if (!userId || !event_name || !event_date || !role) {
    return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("career_events")
    .insert({ user_id: userId, event_name, event_date, event_end_date: event_end_date || null, location, role, discipline, organizer_name, notes, source: "manual" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ event: data });
}

export async function PATCH(req: NextRequest) {
  const admin = await getAdminUser(req);
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const { id, event_name, event_date, event_end_date, location, role, discipline, organizer_name, notes } = body;
  if (!id) return NextResponse.json({ error: "id manquant" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("career_events")
    .update({ event_name, event_date, event_end_date: event_end_date || null, location, role, discipline, organizer_name, notes })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ event: data });
}

export async function DELETE(req: NextRequest) {
  const admin = await getAdminUser(req);
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const { id } = body;
  if (!id) return NextResponse.json({ error: "id manquant" }, { status: 400 });

  const { error } = await supabaseAdmin.from("career_events").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

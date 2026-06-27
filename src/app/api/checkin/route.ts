import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Connexion requise" }, { status: 401 });
  }

  const token = authHeader.slice(7);
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: "Connexion requise" }, { status: 401 });
  }

  const { eventId, date } = await req.json();
  if (!eventId || !date) {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
  }

  // Validate date: accept today or yesterday (grace period)
  const checkinDate = new Date(date);
  const now = new Date();
  const today = new Date(now.toISOString().slice(0, 10));
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (checkinDate < yesterday || checkinDate > today) {
    return NextResponse.json({ error: "Ce QR code n'est plus valide pour aujourd'hui." }, { status: 400 });
  }

  // Verify the user has an accepted application for this event
  const { data: application } = await supabaseAdmin
    .from("applications")
    .select("id, attended, attended_note")
    .eq("event_id", eventId)
    .eq("marshal_id", user.id)
    .eq("status", "accepted")
    .maybeSingle();

  if (!application) {
    return NextResponse.json({ error: "Aucune candidature acceptée pour cet événement." }, { status: 403 });
  }

  // Check if already checked in for this date
  const existingNote = application.attended_note || "";
  if (existingNote.includes(`QR: ${date}`)) {
    return NextResponse.json({ success: true, alreadyDone: true });
  }

  const newNote = existingNote ? `${existingNote}\nQR: ${date}` : `QR: ${date}`;

  await supabaseAdmin
    .from("applications")
    .update({ attended: true, attended_note: newNote })
    .eq("id", application.id);

  return NextResponse.json({ success: true });
}

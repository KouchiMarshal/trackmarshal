import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.slice(7);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { eventId, organisation, securite, ambiance, comment } = await req.json();
  if (!eventId || !organisation || !securite || !ambiance)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  // Verify accepted application for this event
  const { data: app } = await supabaseAdmin
    .from("applications")
    .select("id")
    .eq("event_id", eventId)
    .eq("marshal_id", user.id)
    .eq("status", "accepted")
    .maybeSingle();

  if (!app) return NextResponse.json({ error: "Not an accepted marshal for this event" }, { status: 403 });

  const { error } = await supabaseAdmin
    .from("event_surveys")
    .upsert({ event_id: eventId, marshal_id: user.id, organisation, securite, ambiance, comment: comment || null },
             { onConflict: "event_id,marshal_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Notify organizer
  const { data: event } = await supabaseAdmin
    .from("events")
    .select("title, organizer_id")
    .eq("id", eventId)
    .maybeSingle();

  if (event?.organizer_id) {
    await supabaseAdmin.from("notifications").insert({
      user_id: event.organizer_id,
      title: "Nouveau sondage post-événement",
      message: `Un commissaire a répondu au sondage pour "${event.title}".`,
      type: "info",
      link: `/organizer/events/${eventId}`,
      read: false,
    });
  }

  return NextResponse.json({ ok: true });
}

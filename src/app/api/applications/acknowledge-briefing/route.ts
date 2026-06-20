import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.slice(7);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { applicationId } = await req.json();
  if (!applicationId) return NextResponse.json({ error: "Missing applicationId" }, { status: 400 });

  const { data: app } = await supabaseAdmin
    .from("applications")
    .select("id, marshal_id, event_id, status")
    .eq("id", applicationId)
    .eq("marshal_id", user.id)
    .eq("status", "accepted")
    .maybeSingle();

  if (!app) return NextResponse.json({ error: "Application not found or not accepted" }, { status: 404 });

  const { error } = await supabaseAdmin
    .from("applications")
    .update({ briefing_acknowledged: true, briefing_acknowledged_at: new Date().toISOString() })
    .eq("id", applicationId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Notify organizer
  const { data: event } = await supabaseAdmin
    .from("events")
    .select("title, organizer_id")
    .eq("id", app.event_id)
    .maybeSingle();

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (event?.organizer_id) {
    await supabaseAdmin.from("notifications").insert({
      user_id: event.organizer_id,
      title: `Briefing confirmé`,
      message: `${profile?.full_name || "Un commissaire"} a confirmé la réception du briefing pour "${event.title}".`,
      type: "briefing_acknowledged",
      link: `/organizer/events/${app.event_id}`,
      read: false,
    });
  }

  return NextResponse.json({ ok: true });
}

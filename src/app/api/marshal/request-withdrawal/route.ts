import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.slice(7);
  if (!token) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  let body: { applicationId: string; reason: string };
  try { body = await req.json(); } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { applicationId, reason } = body;
  if (!applicationId || !reason?.trim())
    return NextResponse.json({ ok: false, error: "Champs manquants" }, { status: 400 });

  // Verify the application belongs to this user and is accepted
  const { data: app, error: appError } = await supabaseAdmin
    .from("applications")
    .select("id, marshal_id, event_id, status, events(title, slug, organizer_id)")
    .eq("id", applicationId)
    .eq("marshal_id", user.id)
    .single();

  if (appError || !app)
    return NextResponse.json({ ok: false, error: "Candidature introuvable" }, { status: 404 });

  if (app.status !== "accepted")
    return NextResponse.json({ ok: false, error: "Seules les candidatures acceptées peuvent faire l'objet d'une demande d'annulation" }, { status: 400 });

  // Store the reason in the application
  const { error: updateError } = await supabaseAdmin
    .from("applications")
    .update({
      withdrawal_reason: reason.trim(),
      withdrawal_requested_at: new Date().toISOString(),
    })
    .eq("id", applicationId);

  if (updateError)
    return NextResponse.json({ ok: false, error: updateError.message }, { status: 500 });

  // Fetch marshal name for the notification
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const event = (app as any).events;
  const organizerId = event?.organizer_id;
  const marshalName = profile?.full_name || "Un commissaire";

  // Send notification to organizer (bypasses RLS via supabaseAdmin)
  if (organizerId) {
    await supabaseAdmin.from("notifications").insert({
      user_id: organizerId,
      title: `Demande d'annulation — ${event?.title || "événement"}`,
      message: `${marshalName} : "${reason.trim()}"`,
      type: "withdrawal_request",
      link: `/organizer/events/${app.event_id}`,
      read: false,
    });
  }

  return NextResponse.json({ ok: true });
}

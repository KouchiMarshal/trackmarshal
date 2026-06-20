import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.slice(7);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { eventId, rating, comment } = await req.json();
  if (!eventId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  // Verify the user was an accepted commissioner for this event
  const { data: app } = await supabaseAdmin
    .from("applications")
    .select("id")
    .eq("event_id", eventId)
    .eq("marshal_id", user.id)
    .eq("status", "accepted")
    .maybeSingle();

  if (!app) return NextResponse.json({ error: "Not an accepted commissioner for this event" }, { status: 403 });

  const { error } = await supabaseAdmin
    .from("marshal_reviews")
    .upsert(
      { marshal_id: user.id, event_id: eventId, rating, comment: comment || null },
      { onConflict: "marshal_id,event_id" }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Notify organizer
  const { data: event } = await supabaseAdmin
    .from("events")
    .select("title, organizer_id")
    .eq("id", eventId)
    .maybeSingle();

  if (event?.organizer_id) {
    const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
    await supabaseAdmin.from("notifications").insert({
      user_id: event.organizer_id,
      title: `Avis organisateur reçu ${stars}`,
      message: `Un commissaire a évalué votre événement "${event.title}" : ${rating}/5.`,
      type: "review_received",
      link: `/organizer/events/${eventId}/reviews`,
      read: false,
    });
  }

  return NextResponse.json({ ok: true });
}

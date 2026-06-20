import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.slice(7);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { eventId } = await req.json();
  if (!eventId) return NextResponse.json({ error: "Missing eventId" }, { status: 400 });

  const { data: event } = await supabaseAdmin
    .from("events")
    .select("id, title, organizer_id")
    .eq("id", eventId)
    .eq("organizer_id", user.id)
    .maybeSingle();

  if (!event) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Get or create the group conversation for this event
  let conversationId: string | null = null;

  const { data: existing } = await supabaseAdmin
    .from("conversations")
    .select("id")
    .eq("event_id", eventId)
    .eq("is_group", true)
    .maybeSingle();

  if (existing) {
    conversationId = existing.id;
  } else {
    const { data: conv } = await supabaseAdmin
      .from("conversations")
      .insert({ title: `Équipe — ${event.title}`, event_id: eventId, is_group: true })
      .select()
      .single();
    conversationId = conv?.id || null;
  }

  if (!conversationId) return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 });

  // Get all accepted marshals for this event
  const { data: applications } = await supabaseAdmin
    .from("applications")
    .select("marshal_id")
    .eq("event_id", eventId)
    .eq("status", "accepted");

  const marshalIds = (applications || []).map((a: any) => a.marshal_id);
  const allMemberIds = [user.id, ...marshalIds];

  // Get existing members to avoid duplicates
  const { data: existingMembers } = await supabaseAdmin
    .from("conversation_members")
    .select("user_id")
    .eq("conversation_id", conversationId);

  const existingIds = new Set((existingMembers || []).map((m: any) => m.user_id));
  const newMembers = allMemberIds
    .filter((id) => !existingIds.has(id))
    .map((userId) => ({ conversation_id: conversationId, user_id: userId }));

  if (newMembers.length > 0) {
    await supabaseAdmin.from("conversation_members").insert(newMembers);
  }

  // Notify newly added marshals
  for (const id of newMembers.map((m) => m.user_id).filter((id) => id !== user.id)) {
    await supabaseAdmin.from("notifications").insert({
      user_id: id,
      title: `Canal d'équipe — ${event.title}`,
      message: `Vous avez été ajouté au canal d'équipe de l'événement "${event.title}".`,
      type: "new_message",
      link: "/dashboard/messages",
      read: false,
    });
  }

  return NextResponse.json({ ok: true, conversationId });
}

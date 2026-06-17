import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.slice(7);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { eventId, message } = await req.json();
  if (!eventId || !message?.trim()) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const { data: event } = await supabaseAdmin
    .from("events")
    .select("id, title, organizer_id")
    .eq("id", eventId)
    .eq("organizer_id", user.id)
    .single();
  if (!event) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data: applications } = await supabaseAdmin
    .from("applications")
    .select("marshal_id")
    .eq("event_id", eventId)
    .eq("status", "accepted");

  if (!applications || applications.length === 0) {
    return NextResponse.json({ ok: true, sent: 0 });
  }

  const marshalIds = applications.map((a: any) => a.marshal_id);
  const { data: profiles } = await supabaseAdmin
    .from("profiles")
    .select("id, full_name")
    .in("id", marshalIds);
  const profilesMap: Record<string, any> = {};
  (profiles || []).forEach((p: any) => { profilesMap[p.id] = p; });

  let sent = 0;

  for (const app of applications) {
    const { data: myMemberships } = await supabaseAdmin
      .from("conversation_members")
      .select("conversation_id")
      .eq("user_id", user.id);

    const myConvIds = (myMemberships || []).map((m: any) => m.conversation_id);
    let conversationId: string | null = null;

    if (myConvIds.length > 0) {
      const { data: shared } = await supabaseAdmin
        .from("conversation_members")
        .select("conversation_id")
        .eq("user_id", app.marshal_id)
        .in("conversation_id", myConvIds);
      if (shared && shared.length > 0) {
        conversationId = shared[0].conversation_id;
      }
    }

    if (!conversationId) {
      const marshalName = profilesMap[app.marshal_id]?.full_name || "Commissaire";
      const { data: conv } = await supabaseAdmin
        .from("conversations")
        .insert({ title: `${event.title} — ${marshalName}` })
        .select()
        .single();

      if (conv) {
        await supabaseAdmin.from("conversation_members").insert([
          { conversation_id: conv.id, user_id: user.id },
          { conversation_id: conv.id, user_id: app.marshal_id },
        ]);
        conversationId = conv.id;
      }
    }

    if (conversationId) {
      await supabaseAdmin.from("messages").insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: message.trim(),
      });

      await supabaseAdmin.from("notifications").insert({
        user_id: app.marshal_id,
        title: `Message groupé — ${event.title}`,
        type: "new_message",
        link: "/dashboard/messages",
      });

      sent++;
    }
  }

  return NextResponse.json({ ok: true, sent });
}

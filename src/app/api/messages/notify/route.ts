import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase-admin";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.slice(7);
  if (!token) {
    console.error("[messages/notify] No token");
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  // Verify token using anon key client (same pattern as send-email route)
  const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);
  if (authError || !user) {
    console.error("[messages/notify] Auth failed:", authError?.message);
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!RESEND_API_KEY) {
    console.error("[messages/notify] RESEND_API_KEY not set");
    return NextResponse.json({ ok: false, error: "RESEND_API_KEY not set" }, { status: 500 });
  }

  let body: { conversationId: string; senderName: string; preview: string };
  try {
    body = await req.json();
  } catch {
    console.error("[messages/notify] Invalid JSON body");
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { conversationId, senderName, preview } = body;
  if (!conversationId) {
    console.error("[messages/notify] Missing conversationId");
    return NextResponse.json({ ok: false, error: "Missing conversationId" }, { status: 400 });
  }

  console.log(`[messages/notify] sender=${user.id} conv=${conversationId}`);

  // Use admin client to bypass RLS and get all other members
  const { data: otherMembers, error: membersError } = await supabaseAdmin
    .from("conversation_members")
    .select("user_id")
    .eq("conversation_id", conversationId)
    .neq("user_id", user.id);

  if (membersError) {
    console.error("[messages/notify] Members query error:", membersError.message);
    return NextResponse.json({ ok: false, error: membersError.message }, { status: 500 });
  }

  console.log(`[messages/notify] Other members found: ${otherMembers?.length ?? 0}`);

  if (!otherMembers || otherMembers.length === 0) {
    return NextResponse.json({ ok: true, sent: 0 });
  }

  const recipientIds = otherMembers.map((m: any) => m.user_id);

  const { data: recipients, error: profilesError } = await supabaseAdmin
    .from("profiles")
    .select("email, role, notifications_enabled")
    .in("id", recipientIds);

  if (profilesError) {
    console.error("[messages/notify] Profiles query error:", profilesError.message);
    return NextResponse.json({ ok: false, error: profilesError.message }, { status: 500 });
  }

  console.log(`[messages/notify] Recipients with profiles: ${recipients?.length ?? 0}`);

  let sent = 0;
  for (const recipient of recipients || []) {
    if (!recipient.email) { console.log("[messages/notify] Skipping — no email"); continue; }
    if (recipient.notifications_enabled === false) { console.log("[messages/notify] Skipping — notifications disabled"); continue; }

    const replyUrl = recipient.role === "organizer"
      ? "https://trackmarshal.app/organizer/messages"
      : "https://trackmarshal.app/dashboard/messages";

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;border-radius:16px;overflow:hidden;">
        <div style="background:#FF5A1F;padding:24px 32px;">
          <h1 style="margin:0;font-size:22px;font-weight:900;">🏁 TrackMarshal</h1>
        </div>
        <div style="padding:32px;">
          <h2 style="margin-top:0">Vous avez un nouveau message</h2>
          <p><strong>${senderName}</strong> vous a envoyé un message sur TrackMarshal.</p>
          <blockquote style="border-left:3px solid #FF5A1F;padding-left:16px;color:#aaa;margin:16px 0;">${preview}</blockquote>
          <a href="${replyUrl}" style="display:inline-block;background:#FF5A1F;color:#fff;padding:14px 28px;border-radius:12px;font-weight:bold;text-decoration:none;margin-top:16px;">
            Répondre
          </a>
        </div>
        <div style="padding:16px 32px;border-top:1px solid #222;font-size:12px;color:#555;">
          TrackMarshal — La plateforme des commissaires motorsport
        </div>
      </div>
    `;

    console.log(`[messages/notify] Sending to ${recipient.email}`);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: recipient.email,
        subject: `💬 Nouveau message de ${senderName} — TrackMarshal`,
        html,
      }),
    });

    const result = await res.json();
    if (res.ok) {
      console.log(`[messages/notify] Sent OK, id=${result.id}`);
      sent++;
    } else {
      console.error(`[messages/notify] Resend error:`, JSON.stringify(result));
    }
  }

  return NextResponse.json({ ok: true, sent });
}

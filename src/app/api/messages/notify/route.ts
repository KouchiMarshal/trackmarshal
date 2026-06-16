import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.slice(7);
  if (!token) return NextResponse.json({ ok: false }, { status: 401 });

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ ok: false }, { status: 401 });

  const { conversationId, senderName, preview } = await req.json();
  if (!conversationId) return NextResponse.json({ ok: false }, { status: 400 });

  if (!RESEND_API_KEY) return NextResponse.json({ ok: false, error: "RESEND_API_KEY not set" }, { status: 500 });

  // Use admin client to bypass RLS and get all other members
  const { data: otherMembers } = await supabaseAdmin
    .from("conversation_members")
    .select("user_id")
    .eq("conversation_id", conversationId)
    .neq("user_id", user.id);

  if (!otherMembers || otherMembers.length === 0) {
    return NextResponse.json({ ok: true, sent: 0 });
  }

  const recipientIds = otherMembers.map((m: any) => m.user_id);

  const { data: recipients } = await supabaseAdmin
    .from("profiles")
    .select("email, role, email_preferences")
    .in("id", recipientIds);

  let sent = 0;
  for (const recipient of recipients || []) {
    const prefs = recipient.email_preferences as Record<string, boolean> | null;
    if (!recipient.email || prefs?.email_on_new_message === false) continue;

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

    if (res.ok) sent++;
    else {
      const err = await res.json();
      console.error("[messages/notify] Resend error:", err);
    }
  }

  return NextResponse.json({ ok: true, sent });
}

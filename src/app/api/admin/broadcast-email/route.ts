import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.slice(7);
  if (!token) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "foussardk@gmail.com";
  if (user.email !== adminEmail)
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });

  if (!RESEND_API_KEY)
    return NextResponse.json({ ok: false, error: "RESEND_API_KEY not set" }, { status: 500 });

  let body: { role: string; subject: string; body: string };
  try { body = await req.json(); } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { role, subject, body: messageBody } = body;
  if (!role || !subject || !messageBody)
    return NextResponse.json({ ok: false, error: "Champs manquants" }, { status: 400 });

  const { data: profiles } = await supabaseAdmin
    .from("profiles")
    .select("email, full_name")
    .eq("role", role)
    .not("email", "is", null);

  const recipients = (profiles || []).filter((p: any) => p.email?.includes("@"));

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;border-radius:16px;overflow:hidden;">
      <div style="background:#FF5A1F;padding:24px 32px;">
        <h1 style="margin:0;font-size:22px;font-weight:900;">🏁 TrackMarshal</h1>
      </div>
      <div style="padding:32px;line-height:1.7;">
        ${messageBody.replace(/\n/g, "<br>")}
      </div>
      <div style="padding:16px 32px;border-top:1px solid #222;font-size:12px;color:#555;">
        TrackMarshal — La plateforme des commissaires motorsport
      </div>
    </div>
  `;

  // Use Resend batch API to send all emails in a single request (avoids rate limiting)
  const BATCH_SIZE = 100;
  let sent = 0;

  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const batch = recipients.slice(i, i + BATCH_SIZE);
    const batchPayload = batch.map((recipient: any) => ({
      from: FROM_EMAIL,
      to: recipient.email,
      subject,
      html,
    }));

    const res = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(batchPayload),
    });

    if (res.ok) {
      const result = await res.json().catch(() => ({ data: [] }));
      sent += result.data?.length ?? batch.length;
    } else {
      const err = await res.json().catch(() => ({}));
      console.error(`[broadcast] Erreur batch ${i}-${i + batch.length}:`, err);
      // Fallback: send individually with delay if batch fails
      for (const recipient of batch) {
        const r = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ from: FROM_EMAIL, to: recipient.email, subject, html }),
        });
        if (r.ok) sent++;
        else {
          const e = await r.json().catch(() => ({}));
          console.error(`[broadcast] Erreur pour ${recipient.email}:`, e);
        }
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
    }
  }

  console.log(`[broadcast] ${sent}/${recipients.length} emails envoyés (role: ${role})`);
  return NextResponse.json({ ok: true, sent, total: recipients.length });
}

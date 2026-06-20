import { NextRequest, NextResponse } from "next/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const TO_EMAIL = "foussardk@gmail.com";

export async function POST(req: NextRequest) {
  if (!RESEND_API_KEY) {
    return NextResponse.json({ ok: false, error: "Email service unavailable" }, { status: 503 });
  }

  let body: { name?: string; email?: string; subject?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, subject, message } = body;
  if (!name || !email || !subject || !message) {
    return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
  }

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;border-radius:16px;overflow:hidden;">
      <div style="background:#FF5A1F;padding:24px 32px;">
        <h1 style="margin:0;font-size:22px;font-weight:900;">🏁 TrackMarshal — Message de contact</h1>
      </div>
      <div style="padding:32px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="color:#aaa;padding:8px 0;width:100px;">De</td><td style="color:#fff;font-weight:bold;">${name}</td></tr>
          <tr><td style="color:#aaa;padding:8px 0;">Email</td><td><a href="mailto:${email}" style="color:#FF5A1F;">${email}</a></td></tr>
          <tr><td style="color:#aaa;padding:8px 0;">Sujet</td><td style="color:#fff;">${subject}</td></tr>
        </table>
        <div style="margin-top:24px;background:#111;border-radius:12px;padding:20px;">
          <p style="margin:0;white-space:pre-wrap;color:#ddd;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
        </div>
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
      to: TO_EMAIL,
      reply_to: email,
      subject: `[Contact TrackMarshal] ${subject}`,
      html,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

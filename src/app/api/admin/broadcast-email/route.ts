import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.slice(7);
  if (!token) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const { data: adminProfile } = await supabaseAdmin
    .from("profiles").select("role").eq("id", user.id).single();
  if (adminProfile?.role !== "admin")
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

  let sent = 0;
  for (const recipient of recipients) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM_EMAIL, to: recipient.email, subject, html }),
    });
    if (res.ok) sent++;
    else {
      const err = await res.json().catch(() => ({}));
      console.error(`[broadcast] Erreur pour ${recipient.email}:`, err);
    }
  }

  console.log(`[broadcast] ${sent}/${recipients.length} emails envoyés (role: ${role})`);
  return NextResponse.json({ ok: true, sent, total: recipients.length });
}

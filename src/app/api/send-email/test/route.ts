import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ ok: false, error: "Token manquant — appelez cette route avec Authorization: Bearer <token>" }, { status: 401 });
  }

  const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ ok: false, error: "Auth échouée", detail: authError?.message }, { status: 403 });
  }

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "foussardk@gmail.com";
  if (user.email !== adminEmail) {
    return NextResponse.json({ ok: false, error: "Réservé à l'admin" }, { status: 403 });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return NextResponse.json({ ok: false, error: "RESEND_API_KEY manquant dans les variables Vercel" });
  }

  const FROM = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  const TO = user.email;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: TO,
      subject: "🏁 Test email TrackMarshal",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;border-radius:16px;overflow:hidden;">
          <div style="background:#FF5A1F;padding:24px 32px;">
            <h1 style="margin:0;font-size:22px;font-weight:900;">🏁 TrackMarshal</h1>
          </div>
          <div style="padding:32px;">
            <h2 style="color:#FF5A1F;margin-top:0">Email de test ✔</h2>
            <p>Le système d'emails TrackMarshal fonctionne correctement.</p>
            <p style="color:#aaa;font-size:12px;">From : ${FROM}<br/>To : ${TO}</p>
          </div>
        </div>
      `,
    }),
  });

  const result = await res.json();
  return NextResponse.json({ ok: res.ok, status: res.status, from: FROM, to: TO, resend_response: result });
}

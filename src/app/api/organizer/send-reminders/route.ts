import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.slice(7);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { eventId } = await req.json();
  if (!eventId) return NextResponse.json({ error: "Missing eventId" }, { status: 400 });

  const { data: event } = await supabaseAdmin
    .from("events")
    .select("id, title, event_date, event_end_date, location, slug")
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
    .select("id, email, full_name")
    .in("id", marshalIds);

  if (!RESEND_API_KEY) {
    return NextResponse.json({ ok: false, error: "RESEND_API_KEY not set" }, { status: 500 });
  }

  const startDate = new Date(event.event_date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const eventDate = event.event_end_date
    ? (() => {
        const s = new Date(event.event_date);
        const e = new Date(event.event_end_date);
        if (s.toDateString() === e.toDateString()) return startDate;
        if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear())
          return `${s.getDate()} – ${e.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`;
        if (s.getFullYear() === e.getFullYear())
          return `${s.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} – ${e.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`;
        return `${startDate} – ${e.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`;
      })()
    : startDate;

  const base = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;border-radius:16px;overflow:hidden;"><div style="background:#FF5A1F;padding:24px 32px;"><h1 style="margin:0;font-size:22px;font-weight:900;">🏁 TrackMarshal</h1></div><div style="padding:32px;">BODY</div><div style="padding:16px 32px;border-top:1px solid #222;font-size:12px;color:#555;">TrackMarshal — La plateforme des commissaires motorsport</div></div>`;

  let sent = 0;
  for (const profile of (profiles || [])) {
    if (!profile.email) continue;

    const html = base.replace("BODY", `
      <h2 style="color:#FF5A1F;margin-top:0">Rappel — ${event.title}</h2>
      <p>Bonjour <strong>${profile.full_name || "Commissaire"}</strong>,</p>
      <p>Ceci est un rappel concernant votre participation en tant que commissaire à l'événement suivant :</p>
      <div style="background:#111;border-radius:12px;padding:20px;margin:20px 0;">
        <p style="margin:0 0 8px;font-size:18px;font-weight:900;">${event.title}</p>
        <p style="margin:0 0 6px;color:#aaa;">📅 ${eventDate}</p>
        <p style="margin:0;color:#aaa;">📍 ${event.location}</p>
      </div>
      <p style="color:#aaa;">Pensez à consulter les informations de l'événement et à vous préparer.</p>
      <a href="https://trackmarshal.app/dashboard/applications" style="display:inline-block;background:#FF5A1F;color:#fff;padding:14px 28px;border-radius:12px;font-weight:bold;text-decoration:none;margin-top:16px;">
        Voir mes candidatures
      </a>
    `);

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: profile.email,
        subject: `🏁 Rappel — ${event.title} — ${eventDate}`,
        html,
      }),
    });

    sent++;
  }

  return NextResponse.json({ ok: true, sent });
}

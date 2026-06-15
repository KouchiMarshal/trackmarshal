import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (CRON_SECRET && auth !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const in1day = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
  const in7days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Get events happening in ~1 day or ~7 days (±3h window)
  const targets = [
    { days: 1, label: "demain", date: in1day },
    { days: 7, label: "dans 7 jours", date: in7days },
  ];

  let sent = 0;

  for (const target of targets) {
    const windowStart = new Date(target.date.getTime() - 3 * 60 * 60 * 1000).toISOString();
    const windowEnd = new Date(target.date.getTime() + 3 * 60 * 60 * 1000).toISOString();

    const { data: events } = await supabase
      .from("events")
      .select("id, title, slug, event_date, location, country")
      .gte("event_date", windowStart)
      .lte("event_date", windowEnd);

    if (!events || events.length === 0) continue;

    for (const event of events) {
      // Get accepted applications for this event
      const { data: applications } = await supabase
        .from("applications")
        .select("marshal_id")
        .eq("event_id", event.id)
        .eq("status", "accepted");

      if (!applications || applications.length === 0) continue;

      const marshalIds = applications.map((a) => a.marshal_id);

      // Get marshal profiles (email + preferences)
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, email, full_name, notifications_enabled, email_preferences")
        .in("id", marshalIds);

      if (!profiles) continue;

      for (const profile of profiles) {
        if (!profile.email) continue;
        if (profile.notifications_enabled === false) continue;

        if (!RESEND_API_KEY) continue;

        const eventDate = new Date(event.event_date).toLocaleDateString("fr-FR", {
          weekday: "long", day: "numeric", month: "long", year: "numeric",
        });

        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: FROM_EMAIL,
            to: profile.email,
            subject: `⏰ Rappel : ${event.title} — ${target.label}`,
            html: `
              <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;border-radius:16px;overflow:hidden;">
                <div style="background:#FF5A1F;padding:24px 32px;">
                  <h1 style="margin:0;font-size:22px;font-weight:900;">🏁 TrackMarshal</h1>
                </div>
                <div style="padding:32px;">
                  <h2 style="color:#FF5A1F;margin-top:0">Rappel — Événement ${target.label}</h2>
                  <p>Bonjour ${profile.full_name || ""},</p>
                  <p>Vous avez une mission de commissaire <strong>${target.label}</strong> :</p>
                  <div style="background:#1a1a1a;border-radius:12px;padding:20px;margin:20px 0;">
                    <p style="margin:0;font-size:20px;font-weight:900;">${event.title}</p>
                    <p style="margin:8px 0 0;color:#aaa;">📅 ${eventDate}</p>
                    <p style="margin:4px 0 0;color:#aaa;">📍 ${event.location}${event.country ? ", " + event.country : ""}</p>
                  </div>
                  <a href="https://www.trackmarshal.app/events/${event.slug}" style="display:inline-block;background:#FF5A1F;color:#fff;padding:14px 28px;border-radius:12px;font-weight:bold;text-decoration:none;margin-top:8px;">
                    Voir l'événement
                  </a>
                </div>
                <div style="padding:16px 32px;border-top:1px solid #222;font-size:12px;color:#555;">
                  TrackMarshal — La plateforme des commissaires motorsport
                </div>
              </div>
            `,
          }),
        });

        sent++;
      }
    }
  }

  return NextResponse.json({ ok: true, sent });
}

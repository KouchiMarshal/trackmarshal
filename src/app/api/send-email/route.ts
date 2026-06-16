import { NextRequest, NextResponse } from "next/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
// Use RESEND_FROM_EMAIL env var, or fall back to Resend's test address (sends only to your own account email)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

type EmailType =
  | "application_received"
  | "application_accepted"
  | "application_rejected"
  | "license_validated"
  | "license_rejected"
  | "new_message";

interface EmailPayload {
  to: string;
  type: EmailType;
  data: Record<string, any>;
}

function buildEmail(type: EmailType, data: Record<string, any>): { subject: string; html: string } {
  const base = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;border-radius:16px;overflow:hidden;">
      <div style="background:#FF5A1F;padding:24px 32px;">
        <h1 style="margin:0;font-size:22px;font-weight:900;">🏁 TrackMarshal</h1>
      </div>
      <div style="padding:32px;">
        BODY
      </div>
      <div style="padding:16px 32px;border-top:1px solid #222;font-size:12px;color:#555;">
        TrackMarshal — La plateforme des commissaires motorsport
      </div>
    </div>
  `;

  const wrap = (body: string) => base.replace("BODY", body);

  switch (type) {
    case "application_received":
      return {
        subject: `Nouvelle candidature — ${data.eventTitle}`,
        html: wrap(`
          <h2 style="color:#FF5A1F;margin-top:0">Nouvelle candidature reçue</h2>
          <p><strong>${data.marshalName}</strong> a postulé à votre événement <strong>${data.eventTitle}</strong>.</p>
          <a href="https://trackmarshal.app/organizer/events/${data.eventId}" style="display:inline-block;background:#FF5A1F;color:#fff;padding:14px 28px;border-radius:12px;font-weight:bold;text-decoration:none;margin-top:16px;">
            Voir la candidature
          </a>
        `),
      };

    case "application_accepted":
      return {
        subject: `🎉 Candidature acceptée — ${data.eventTitle}`,
        html: wrap(`
          <h2 style="color:#22c55e;margin-top:0">Votre candidature a été acceptée !</h2>
          <p>Félicitations ! Vous avez été sélectionné comme commissaire pour l'événement <strong>${data.eventTitle}</strong>.</p>
          <p style="color:#aaa">Date : ${data.eventDate}<br/>Lieu : ${data.eventLocation}</p>
          <a href="https://trackmarshal.app/dashboard/applications" style="display:inline-block;background:#FF5A1F;color:#fff;padding:14px 28px;border-radius:12px;font-weight:bold;text-decoration:none;margin-top:16px;">
            Voir mes candidatures
          </a>
        `),
      };

    case "application_rejected":
      return {
        subject: `Candidature — ${data.eventTitle}`,
        html: wrap(`
          <h2 style="margin-top:0">Résultat de votre candidature</h2>
          <p>Votre candidature pour l'événement <strong>${data.eventTitle}</strong> n'a malheureusement pas été retenue cette fois.</p>
          <p style="color:#aaa">Continuez à postuler — d'autres événements correspondent à votre profil.</p>
          <a href="https://trackmarshal.app/events" style="display:inline-block;background:#FF5A1F;color:#fff;padding:14px 28px;border-radius:12px;font-weight:bold;text-decoration:none;margin-top:16px;">
            Voir les événements
          </a>
        `),
      };

    case "license_validated":
      return {
        subject: "✅ Votre licence a été validée — TrackMarshal",
        html: wrap(`
          <h2 style="color:#22c55e;margin-top:0">Licence validée !</h2>
          <p>Votre licence <strong>${data.licenseType}</strong> a été vérifiée et validée par notre équipe.</p>
          <p style="color:#aaa">Votre profil affiche désormais le badge "Licence vérifiée".</p>
          <a href="https://trackmarshal.app/dashboard/profile" style="display:inline-block;background:#FF5A1F;color:#fff;padding:14px 28px;border-radius:12px;font-weight:bold;text-decoration:none;margin-top:16px;">
            Voir mon profil
          </a>
        `),
      };

    case "license_rejected":
      return {
        subject: "Vérification de licence — TrackMarshal",
        html: wrap(`
          <h2 style="margin-top:0">Licence non validée</h2>
          <p>Votre licence n'a pas pu être validée. Cela peut être dû à un document illisible ou incorrect.</p>
          <p style="color:#aaa">Mettez à jour votre licence sur votre profil et soumettez-la à nouveau.</p>
          <a href="https://trackmarshal.app/dashboard/profile" style="display:inline-block;background:#FF5A1F;color:#fff;padding:14px 28px;border-radius:12px;font-weight:bold;text-decoration:none;margin-top:16px;">
            Mettre à jour ma licence
          </a>
        `),
      };

    case "new_message":
      return {
        subject: `💬 Nouveau message de ${data.senderName} — TrackMarshal`,
        html: wrap(`
          <h2 style="margin-top:0">Vous avez un nouveau message</h2>
          <p><strong>${data.senderName}</strong> vous a envoyé un message sur TrackMarshal.</p>
          <blockquote style="border-left:3px solid #FF5A1F;padding-left:16px;color:#aaa;margin:16px 0;">${data.preview}</blockquote>
          <a href="https://trackmarshal.app/dashboard/messages" style="display:inline-block;background:#FF5A1F;color:#fff;padding:14px 28px;border-radius:12px;font-weight:bold;text-decoration:none;margin-top:16px;">
            Répondre
          </a>
        `),
      };

    default:
      return { subject: "TrackMarshal", html: wrap("<p>Notification</p>") };
  }
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) {
    console.error("[send-email] Pas de token Authorization");
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { createClient } = await import("@supabase/supabase-js");
  const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);
  if (authError || !user) {
    console.error("[send-email] Auth échouée:", authError?.message);
    return NextResponse.json({ ok: false, error: "Unauthorized", detail: authError?.message }, { status: 401 });
  }

  if (!RESEND_API_KEY) {
    console.error("[send-email] RESEND_API_KEY manquant dans les variables d'environnement Vercel");
    return NextResponse.json({ ok: false, error: "RESEND_API_KEY not set" }, { status: 500 });
  }

  let body: EmailPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { to, type, data } = body;
  if (!to || !type) {
    console.error("[send-email] Champs manquants: to ou type");
    return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
  }

  console.log(`[send-email] Envoi "${type}" à ${to} depuis ${FROM_EMAIL}`);

  const { subject, html } = buildEmail(type, data);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  });

  const result = await res.json();

  if (!res.ok) {
    console.error("[send-email] Erreur Resend:", JSON.stringify(result));
  } else {
    console.log("[send-email] Email envoyé avec succès, id:", result.id);
  }

  return NextResponse.json({ ok: res.ok, result });
}

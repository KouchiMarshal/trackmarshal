"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  XCircle,
  CalendarPlus,
  Hourglass,
  Star,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";
import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import NotificationBell from "@/components/notifications/notification-bell";
import { formatDateRange } from "@/lib/formatDate";
import { SkeletonApplicationCard } from "@/components/ui/skeleton";

export default function ApplicationsPage() {

  const router = useRouter();

  const [applications, setApplications] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [cancelling, setCancelling] =
    useState<string | null>(null);

  const [userId, setUserId] =
    useState("");

  const [withdrawModal, setWithdrawModal] = useState<{ appId: string; eventTitle: string; eventId: string; organizerId: string } | null>(null);
  const [withdrawReason, setWithdrawReason] = useState("");
  const [withdrawSending, setWithdrawSending] = useState(false);

  const [acknowledging, setAcknowledging] = useState<string | null>(null);
  const [briefingOpened, setBriefingOpened] = useState<Record<string, boolean>>({});
  const [ratings, setRatings] = useState<Record<string, { rating: number; comment: string; saved: boolean }>>({});
  const [ratingSubmitting, setRatingSubmitting] = useState<string | null>(null);
  const [surveys, setSurveys] = useState<Record<string, { organisation: number; securite: number; ambiance: number; comment: string; saved: boolean }>>({});
  const [surveySubmitting, setSurveySubmitting] = useState<string | null>(null);
  const [docs, setDocs] = useState<Record<string, any[]>>({});

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel("marshal-applications-" + userId)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "applications", filter: `marshal_id=eq.${userId}` },
        (payload: any) => {
          setApplications((prev) =>
            prev.map((a) => a.id === payload.new.id ? { ...a, ...payload.new } : a)
          );
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  async function loadApplications() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {

      router.push("/login");

      return;
    }

    setUserId(user.id);

    const { data: appsData, error: dbError } =
      await supabase
        .from("applications")
        .select("*")
        .eq("marshal_id", user.id)
        .order("created_at", { ascending: false });

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
      return;
    }

    if (!appsData || appsData.length === 0) {
      setApplications([]);
      setLoading(false);
      return;
    }

    const eventIds = [...new Set(appsData.map((a: any) => a.event_id))];

    const { data: eventsData } =
      await supabase
        .from("events")
        .select("id, title, slug, location, image_url, event_date, event_end_date, discipline, briefing, schedule, hotel, hotel_detail, repas, repas_type, defraiement, defraiement_amount, pass_accompagnant, pass_accompagnant_count, organizer_contact, organizer_id")
        .in("id", eventIds);

    const eventsMap: Record<string, any> = {};
    (eventsData || []).forEach((e: any) => { eventsMap[e.id] = e; });

    const merged = appsData.map((a: any) => ({
      ...a,
      events: eventsMap[a.event_id] || null,
    }));

    setApplications(merged);

    // Load existing marshal reviews for past accepted events
    const pastAcceptedEventIds = merged
      .filter((a: any) => a.status === "accepted" && a.events && new Date(a.events.event_end_date || a.events.event_date) < new Date())
      .map((a: any) => a.event_id);

    if (pastAcceptedEventIds.length > 0) {
      const { data: existingReviews } = await supabase
        .from("marshal_reviews")
        .select("event_id, rating, comment")
        .eq("marshal_id", user.id)
        .in("event_id", pastAcceptedEventIds);

      const initial: Record<string, { rating: number; comment: string; saved: boolean }> = {};
      (existingReviews || []).forEach((r: any) => {
        initial[r.event_id] = { rating: r.rating, comment: r.comment || "", saved: true };
      });
      setRatings(initial);

      // Load existing surveys
      const { data: existingSurveys } = await supabase
        .from("event_surveys")
        .select("event_id, organisation, securite, ambiance, comment")
        .eq("marshal_id", user.id)
        .in("event_id", pastAcceptedEventIds);

      const surveyInit: Record<string, { organisation: number; securite: number; ambiance: number; comment: string; saved: boolean }> = {};
      (existingSurveys || []).forEach((s: any) => {
        surveyInit[s.event_id] = { organisation: s.organisation, securite: s.securite, ambiance: s.ambiance, comment: s.comment || "", saved: true };
      });
      setSurveys(surveyInit);
    }

    // Load documents for accepted events
    const acceptedEventIds = merged.filter((a: any) => a.status === "accepted").map((a: any) => a.event_id);
    if (acceptedEventIds.length > 0) {
      const { data: { session } } = await supabase.auth.getSession();
      const docsMap: Record<string, any[]> = {};
      await Promise.all(acceptedEventIds.map(async (eid: string) => {
        const res = await fetch(`/api/organizer/documents?eventId=${eid}`, {
          headers: { Authorization: `Bearer ${session?.access_token}` },
        });
        const data = await res.json();
        if (data.docs?.length > 0) docsMap[eid] = data.docs;
      }));
      setDocs(docsMap);
    }

    setLoading(false);
  }

  async function acknowledgeBriefing(appId: string) {
    setAcknowledging(appId);
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch("/api/applications/acknowledge-briefing", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ applicationId: appId }),
    });
    const data = await res.json();
    if (data.ok) {
      setApplications((prev) =>
        prev.map((a) => a.id === appId ? { ...a, briefing_acknowledged: true, briefing_acknowledged_at: new Date().toISOString() } : a)
      );
    }
    setAcknowledging(null);
  }

  async function submitSurvey(eventId: string) {
    const s = surveys[eventId];
    if (!s || !s.organisation || !s.securite || !s.ambiance) return;
    setSurveySubmitting(eventId);
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch("/api/surveys/event", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ eventId, organisation: s.organisation, securite: s.securite, ambiance: s.ambiance, comment: s.comment }),
    });
    const data = await res.json();
    if (data.ok) setSurveys((prev) => ({ ...prev, [eventId]: { ...prev[eventId], saved: true } }));
    setSurveySubmitting(null);
  }

  async function submitMarshalRating(eventId: string) {
    const r = ratings[eventId];
    if (!r || r.rating === 0) return;
    setRatingSubmitting(eventId);
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch("/api/reviews/marshal", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ eventId, rating: r.rating, comment: r.comment }),
    });
    const data = await res.json();
    if (data.ok) {
      setRatings((prev) => ({ ...prev, [eventId]: { ...prev[eventId], saved: true } }));
    }
    setRatingSubmitting(null);
  }

  function downloadICS(ev: any) {
    if (!ev) return;
    const start = new Date(ev.event_date);
    const isMultiDay = !!ev.event_end_date;
    // For multi-day: use all-day format (DTEND is exclusive, so add 1 day)
    const end = isMultiDay
      ? new Date(new Date(ev.event_end_date).getTime() + 24 * 60 * 60 * 1000)
      : new Date(start.getTime() + 9 * 60 * 60 * 1000);
    const fmtDate = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, "");
    const fmtDateTime = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//TrackMarshal//FR",
      "BEGIN:VEVENT",
      isMultiDay ? `DTSTART;VALUE=DATE:${fmtDate(start)}` : `DTSTART:${fmtDateTime(start)}`,
      isMultiDay ? `DTEND;VALUE=DATE:${fmtDate(end)}` : `DTEND:${fmtDateTime(end)}`,
      `SUMMARY:${ev.title} — Commissaire TrackMarshal`,
      `LOCATION:${ev.location}${ev.country ? ", " + ev.country : ""}`,
      `URL:https://www.trackmarshal.app/events/${ev.slug}`,
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `trackmarshal-${ev.slug}.ics`; a.click();
    URL.revokeObjectURL(url);
  }

  function googleCalUrl(ev: any) {
    const start = new Date(ev.event_date);
    const isMultiDay = !!ev.event_end_date;
    const end = isMultiDay
      ? new Date(new Date(ev.event_end_date).getTime() + 24 * 60 * 60 * 1000)
      : new Date(start.getTime() + 9 * 60 * 60 * 1000);
    const fmtDate = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, "");
    const fmtDateTime = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const dateStr = isMultiDay
      ? `${fmtDate(start)}/${fmtDate(end)}`
      : `${fmtDateTime(start)}/${fmtDateTime(end)}`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(ev.title + " — Commissaire")}&dates=${dateStr}&location=${encodeURIComponent(ev.location)}&details=${encodeURIComponent("TrackMarshal\nhttps://www.trackmarshal.app/events/" + ev.slug)}`;
  }

  function escapeHtml(str: string | null | undefined): string {
    if (!str) return "—";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function printBriefing(app: any) {
    const ev = app.events;
    if (!ev) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html lang="fr"><head>
      <meta charset="UTF-8" /><title>Briefing — ${escapeHtml(ev.title)}</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 700px; margin: 40px auto; color: #111; }
        h1 { color: #FF5A1F; border-bottom: 2px solid #FF5A1F; padding-bottom: 10px; }
        .label { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #888; margin-top: 18px; }
        .value { font-size: 15px; margin-top: 4px; }
        .badge { display: inline-block; background: #FF5A1F; color: white; padding: 4px 14px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-top: 8px; }
        .section { margin-top: 28px; border: 1px solid #eee; border-radius: 8px; padding: 18px; }
        @media print { body { margin: 20px; } button { display: none; } }
      </style>
    </head><body>
      <h1>🏁 Briefing Commissaire — ${escapeHtml(ev.title)}</h1>
      <div class="badge">CANDIDATURE ACCEPTÉE</div>
      <div class="section">
        <div class="label">Date${ev.event_end_date ? "s" : ""} de l'événement</div>
        <div class="value">${ev.event_end_date
          ? `${new Date(ev.event_date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} → ${new Date(ev.event_end_date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`
          : new Date(ev.event_date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
        }</div>
        <div class="label">Lieu</div>
        <div class="value">${escapeHtml(ev.location)}${ev.country ? ", " + escapeHtml(ev.country) : ""}</div>
        ${ev.discipline ? `<div class="label">Discipline</div><div class="value">${escapeHtml(ev.discipline)}</div>` : ""}
      </div>
      ${ev.briefing ? `<div class="section"><div class="label">Description</div><div class="value">${escapeHtml(ev.briefing)}</div></div>` : ""}
      <div class="section"><div class="label">Hébergement</div><div class="value">${ev.hotel ? "✅ " + escapeHtml(ev.hotel_detail || "Inclus") : "❌ Non inclus"}</div></div>
      <div class="section"><div class="label">Repas</div><div class="value">${ev.repas ? "✅ " + escapeHtml(ev.repas_type || "Inclus") : "❌ Non inclus"}</div></div>
      <div class="section"><div class="label">Défraiement</div><div class="value">${ev.defraiement ? "✅ " + escapeHtml(ev.defraiement_amount || "Inclus") : "❌ Non prévu"}</div></div>
      ${ev.pass_accompagnant ? `<div class="section"><div class="label">Pass accompagnant</div><div class="value">✅ ${ev.pass_accompagnant_count ? ev.pass_accompagnant_count + " pass" : "Inclus"}</div></div>` : ""}
      ${ev.organizer_contact ? `<div class="section"><div class="label">Contact organisateur</div><div class="value">${escapeHtml(ev.organizer_contact)}</div></div>` : ""}
      ${ev.schedule ? `<div class="section"><div class="label">Planning</div><div class="value" style="white-space:pre-line">${escapeHtml(ev.schedule)}</div></div>` : ""}
      <div class="section" style="background:#fff8f5;border-color:#FF5A1F22">
        <div class="label">Document généré le</div>
        <div class="value">${new Date().toLocaleDateString("fr-FR")} — TrackMarshal.app</div>
      </div>
      <script>window.onload = () => window.print();</script>
    </body></html>`);
    w.document.close();
  }

  async function cancelApplication(app: any) {
    if (app.status === "accepted") {
      setWithdrawReason("");
      setWithdrawModal({
        appId: app.id,
        eventTitle: app.events?.title || "cet événement",
        eventId: app.event_id,
        organizerId: app.events?.organizer_id || "",
      });
      return;
    }

    setCancelling(app.id);

    const { error } = await supabase
      .from("applications")
      .delete()
      .eq("id", app.id)
      .eq("marshal_id", userId);

    if (error) {
      alert(`Erreur : ${error.message}`);
      setCancelling(null);
      return;
    }

    setApplications((prev) => prev.filter((a) => a.id !== app.id));
    setCancelling(null);
  }

  async function sendWithdrawRequest() {
    if (!withdrawModal || !withdrawReason.trim()) return;
    setWithdrawSending(true);

    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch("/api/marshal/request-withdrawal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ applicationId: withdrawModal.appId, reason: withdrawReason.trim() }),
    });

    const result = await res.json();
    setWithdrawSending(false);

    if (result.ok) {
      // Mark withdrawal pending in local state
      setApplications((prev) =>
        prev.map((a) =>
          a.id === withdrawModal.appId
            ? { ...a, withdrawal_reason: withdrawReason.trim(), withdrawal_requested_at: new Date().toISOString() }
            : a
        )
      );
    }

    setWithdrawModal(null);
    setWithdrawReason("");
  }

  function getStatus(status: string) {

    switch (status) {

      case "accepted":
        return {
          color:
            "bg-green-100 text-green-700",
          text:
            "Accepté",
          icon:
            CheckCircle2,
        };

      case "rejected":
        return {
          color:
            "bg-red-100 text-red-700",
          text:
            "Refusé",
          icon:
            XCircle,
        };

      case "waitlisted":
        return { color: "bg-blue-100 text-blue-700", text: "Liste d'attente", icon: Hourglass };

      default:
        return { color: "bg-yellow-100 text-yellow-700", text: "En attente", icon: Clock3 };
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">

      <div className="flex min-h-screen">

        <DashboardSidebar />

        <div className="flex-1">

          <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white">

            <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-10">

              <div>

                <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">

                  Dashboard Commissaire

                </p>

                <h1 className="mt-2 text-2xl font-black text-zinc-900 lg:text-4xl">

                  Mes candidatures

                </h1>

              </div>

              <NotificationBell />

            </div>

          </header>

          <div className="relative overflow-hidden">

            <div className="relative z-10 mx-auto max-w-[1600px] p-4 pb-24 sm:p-6 lg:p-10 lg:pb-10">

              {loading && (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => <SkeletonApplicationCard key={i} />)}
                </div>
              )}

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                  Erreur Supabase : {error}
                </div>
              )}

              {!loading &&
               !error &&
               applications.length === 0 && (

                <div className="rounded-[32px] border border-zinc-200 bg-white p-10 text-center shadow-sm">

                  <h2 className="text-4xl font-black text-zinc-900">

                    Aucune candidature

                  </h2>

                  <p className="mt-5 text-zinc-500">

                    Vous n'avez pas encore postulé
                    à un événement.

                  </p>

                </div>

              )}

              <div className="space-y-6">

                {applications.map((app) => {

                  const status =
                    getStatus(app.status);

                  return (

                    <div
                      key={app.id}
                      className="overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-sm"
                    >

                      <div className="grid lg:grid-cols-[320px_1fr]">

                        <div className="relative h-[240px] lg:h-full">

                          <img
                            src={
                              app.events
                                ?.image_url ||
                              "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop"
                            }
                            className="h-full w-full object-cover"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                        </div>

                        <div className="p-6 lg:p-8">

                          <div
                            className={`w-fit rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.15em] ${status.color}`}
                          >

                            {status.text}

                          </div>

                          <h2 className="mt-6 text-3xl font-black text-zinc-900 lg:text-5xl">

                            {
                              app.events?.title
                            }

                          </h2>

                          <div className="mt-8 space-y-4 text-zinc-600">

                            <div className="flex items-center gap-3">

                              <CalendarDays
                                size={18}
                              />

                              <p>{formatDateRange(app.events?.event_date, app.events?.event_end_date)}</p>

                            </div>

                            <div className="flex items-center gap-3">

                              <MapPin
                                size={18}
                              />

                              <p>

                                {
                                  app.events?.location
                                }

                              </p>

                            </div>

                            {app.status === "accepted" && app.post && (
                              <div className="flex items-center gap-3">
                                <span className="text-lg">📍</span>
                                <p>
                                  <span className="text-zinc-500">Poste assigné : </span>
                                  <span className="font-bold text-zinc-900">{app.post}</span>
                                </p>
                              </div>
                            )}

                            {app.desired_role && (
                              <p className="text-xs text-zinc-500">Rôle postulé : <span className="font-semibold text-zinc-700">{app.desired_role}</span></p>
                            )}

                          </div>

                          <div className="mt-8 flex flex-col gap-4 sm:flex-row">

                            <Link
                              href={`/events/${app.events?.slug}`}
                              className="flex h-14 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 px-8 font-bold text-zinc-700 transition hover:border-[#FF5A1F]/40"
                            >
                              Voir l'événement
                            </Link>

                            {app.status === "accepted" && (
                              <>
                                <Link
                                  href={`/events/${app.events?.slug}`}
                                  className="flex h-14 items-center justify-center rounded-2xl bg-[#FF5A1F] px-8 font-bold text-white transition hover:scale-[1.01]"
                                >
                                  Voir briefing
                                </Link>
                                <button
                                  onClick={() => printBriefing(app)}
                                  className="flex h-14 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 px-5 font-bold text-zinc-700 transition hover:border-[#FF5A1F]/40"
                                  title="Télécharger le briefing PDF"
                                >
                                  📄 PDF
                                </button>
                                <button
                                  onClick={() => downloadICS(app.events)}
                                  className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-5 font-bold text-zinc-700 transition hover:border-[#FF5A1F]/40"
                                  title="Ajouter à mon agenda"
                                >
                                  <CalendarPlus size={18} />
                                  Agenda
                                </button>
                                {app.events && (
                                  <a
                                    href={googleCalUrl(app.events)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-5 font-bold text-zinc-700 transition hover:border-[#FF5A1F]/40"
                                    title="Ajouter à Google Calendar"
                                  >
                                    <img src="https://calendar.google.com/googlecalendar/images/favicon_v2018_96.png" alt="Google" className="h-4 w-4" />
                                    Google
                                  </a>
                                )}
                              </>
                            )}

                            {app.status !== "rejected" && !app.withdrawal_reason && (
                              <button
                                onClick={() => cancelApplication(app)}
                                disabled={cancelling === app.id}
                                className="flex h-14 items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-8 font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                              >
                                {cancelling === app.id ? "Annulation..."
                                  : app.status === "accepted" ? "Demander l'annulation"
                                  : "Annuler"}
                              </button>
                            )}
                            {app.withdrawal_reason && (
                              <div className="flex h-14 items-center justify-center rounded-2xl border border-orange-200 bg-orange-50 px-6 text-sm font-bold text-orange-600">
                                ⏳ Annulation en attente
                              </div>
                            )}

                          </div>

                          {/* Briefing acknowledgment */}
                          {app.status === "accepted" && app.events?.briefing && (() => {
                            const isPast = new Date(app.events.event_end_date || app.events.event_date) < new Date();
                            if (isPast) return null;
                            const isOpen = !!briefingOpened[app.id];
                            if (app.briefing_acknowledged) {
                              return (
                                <div className="mt-5 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4">
                                  <CheckCircle2 size={18} className="text-green-600 shrink-0" />
                                  <div>
                                    <p className="text-sm font-black text-green-700">Briefing confirmé</p>
                                    {app.briefing_acknowledged_at && (
                                      <p className="text-xs text-green-600 mt-0.5">
                                        Lu le {new Date(app.briefing_acknowledged_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            }
                            return (
                              <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 overflow-hidden">
                                <button
                                  onClick={() => setBriefingOpened((prev) => ({ ...prev, [app.id]: !prev[app.id] }))}
                                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="text-base">📋</span>
                                    <p className="text-sm font-black text-orange-700">Briefing à lire et confirmer</p>
                                  </div>
                                  {isOpen ? <ChevronUp size={18} className="text-orange-500 shrink-0" /> : <ChevronDown size={18} className="text-orange-500 shrink-0" />}
                                </button>
                                {isOpen && (
                                  <>
                                    <div className="border-t border-orange-200 bg-white px-5 py-5">
                                      <p className="whitespace-pre-line text-sm text-zinc-700 leading-relaxed">{app.events.briefing}</p>
                                    </div>
                                    <div className="border-t border-orange-200 px-5 py-4 flex items-center justify-between gap-4">
                                      <p className="text-xs text-orange-600 font-medium">En cliquant, vous confirmez avoir lu et compris ce briefing.</p>
                                      <button
                                        onClick={() => acknowledgeBriefing(app.id)}
                                        disabled={acknowledging === app.id}
                                        className="shrink-0 flex h-10 items-center gap-2 rounded-xl bg-orange-500 px-5 text-sm font-bold text-white transition hover:bg-orange-600 disabled:opacity-60"
                                      >
                                        {acknowledging === app.id ? "Enregistrement..." : "Je confirme avoir lu"}
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            );
                          })()}

                          {/* Documents de l'événement */}
                          {app.status === "accepted" && docs[app.event_id]?.length > 0 && (
                            <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                              <p className="mb-3 text-sm font-black text-zinc-900">📁 Documents de l'événement</p>
                              <div className="space-y-2">
                                {docs[app.event_id].map((doc: any) => (
                                  <a
                                    key={doc.id}
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 transition hover:border-[#FF5A1F]/40 hover:text-[#FF5A1F]"
                                  >
                                    <span className="text-base">📄</span>
                                    <span className="truncate">{doc.name}</span>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Sondage post-événement */}
                          {app.status === "accepted" && (() => {
                            const endDate = new Date(app.events?.event_end_date || app.events?.event_date);
                            const daysSinceEnd = (Date.now() - endDate.getTime()) / (1000 * 60 * 60 * 24);
                            if (daysSinceEnd < 1 || daysSinceEnd > 30) return null;
                            const eventId = app.event_id;
                            const s = surveys[eventId] || { organisation: 0, securite: 0, ambiance: 0, comment: "", saved: false };
                            const dims = [
                              { key: "organisation" as const, label: "Organisation" },
                              { key: "securite" as const, label: "Sécurité" },
                              { key: "ambiance" as const, label: "Ambiance" },
                            ];
                            return (
                              <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-5">
                                <p className="mb-4 text-sm font-black text-blue-900">
                                  {s.saved ? "✓ Sondage complété — merci !" : "📊 Sondage post-événement"}
                                </p>
                                {!s.saved && (
                                  <>
                                    <div className="space-y-3 mb-4">
                                      {dims.map(({ key, label }) => (
                                        <div key={key}>
                                          <p className="text-xs font-bold text-blue-700 mb-1">{label}</p>
                                          <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                              <button
                                                key={star}
                                                onClick={() => setSurveys((prev) => ({ ...prev, [eventId]: { ...s, [key]: star, saved: false } }))}
                                                className="transition hover:scale-110"
                                              >
                                                <Star size={20} className={star <= s[key] ? "fill-blue-500 text-blue-500" : "text-blue-200"} />
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    <textarea
                                      value={s.comment}
                                      onChange={(e) => setSurveys((prev) => ({ ...prev, [eventId]: { ...s, comment: e.target.value } }))}
                                      placeholder="Commentaire libre (optionnel)"
                                      rows={2}
                                      className="w-full resize-none rounded-xl border border-blue-200 bg-white p-3 text-sm outline-none placeholder:text-blue-300 focus:border-blue-400"
                                    />
                                    {s.organisation > 0 && s.securite > 0 && s.ambiance > 0 && (
                                      <button
                                        onClick={() => submitSurvey(eventId)}
                                        disabled={surveySubmitting === eventId}
                                        className="mt-3 flex h-10 items-center rounded-xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
                                      >
                                        {surveySubmitting === eventId ? "Envoi..." : "Envoyer le sondage"}
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            );
                          })()}

                          {/* Marshal rating for past events */}
                          {app.status === "accepted" && (() => {
                            const isPast = new Date(app.events?.event_end_date || app.events?.event_date) < new Date();
                            if (!isPast) return null;
                            const eventId = app.event_id;
                            const r = ratings[eventId] || { rating: 0, comment: "", saved: false };
                            return (
                              <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                                <p className="mb-3 text-sm font-black text-zinc-900">
                                  {r.saved ? "✓ Votre avis sur cet événement" : "Évaluez cet événement"}
                                </p>
                                <div className="flex gap-1 mb-3">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      onClick={() => setRatings((prev) => ({ ...prev, [eventId]: { ...r, rating: star, saved: false } }))}
                                      className="transition hover:scale-110"
                                    >
                                      <Star
                                        size={24}
                                        className={star <= r.rating ? "fill-[#FF5A1F] text-[#FF5A1F]" : "text-zinc-300"}
                                      />
                                    </button>
                                  ))}
                                  {r.rating > 0 && (
                                    <span className="ml-2 self-center text-xs text-zinc-500">
                                      {r.rating === 1 ? "Insuffisant" : r.rating === 2 ? "Passable" : r.rating === 3 ? "Bien" : r.rating === 4 ? "Très bien" : "Excellent"}
                                    </span>
                                  )}
                                </div>
                                <textarea
                                  value={r.comment}
                                  onChange={(e) => setRatings((prev) => ({ ...prev, [eventId]: { ...r, comment: e.target.value, saved: false } }))}
                                  placeholder="Organisation, accueil, sécurité... (optionnel)"
                                  rows={2}
                                  className="w-full resize-none rounded-xl border border-zinc-200 bg-white p-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#FF5A1F]"
                                />
                                {!r.saved && r.rating > 0 && (
                                  <button
                                    onClick={() => submitMarshalRating(eventId)}
                                    disabled={ratingSubmitting === eventId}
                                    className="mt-3 flex h-10 items-center rounded-xl bg-[#FF5A1F] px-5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
                                  >
                                    {ratingSubmitting === eventId ? "Envoi..." : r.saved ? "Mettre à jour" : "Enregistrer l'avis"}
                                  </button>
                                )}
                              </div>
                            );
                          })()}

                        </div>

                      </div>

                    </div>

                  );
                })}

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Modal demande d'annulation */}
      {withdrawModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="w-full max-w-lg rounded-[28px] border border-zinc-200 bg-white p-6 space-y-5 shadow-xl">
            <div>
              <h3 className="text-xl font-black text-zinc-900">Demander l'annulation</h3>
              <p className="mt-1 text-sm text-zinc-500">{withdrawModal.eventTitle}</p>
              <p className="mt-3 text-sm text-zinc-600">
                Votre participation reste active jusqu'à confirmation de l'organisateur.
              </p>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                Raison de l'annulation <span className="text-red-500">*</span>
              </label>
              <textarea
                value={withdrawReason}
                onChange={(e) => setWithdrawReason(e.target.value)}
                placeholder="Expliquez pourquoi vous ne pouvez plus participer..."
                rows={4}
                className="mt-2 w-full resize-none rounded-2xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 transition focus:border-[#FF5A1F]"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setWithdrawModal(null); setWithdrawReason(""); }}
                className="flex h-12 flex-1 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-sm font-bold text-zinc-700 transition hover:bg-zinc-100"
              >
                Retour
              </button>
              <button
                onClick={sendWithdrawRequest}
                disabled={!withdrawReason.trim() || withdrawSending}
                className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-[#FF5A1F] text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {withdrawSending ? "Envoi..." : "Envoyer la demande"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

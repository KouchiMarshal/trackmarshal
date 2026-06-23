"use client";

import { useEffect, useState, use } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Props = { params: Promise<{ id: string }> };

const T = {
  fr: {
    loading: "Génération du CV...",
    notFound: "Profil introuvable.",
    back: "← Retour",
    print: "Imprimer / Sauvegarder en PDF",
    jobTitle: "Commissaire de piste Motorsport",
    yearsExp: (n: number) => `${n} ans d'expérience`,
    statEvents: "Épreuves",
    statRating: "Note moy.",
    statReviews: "Évaluations",
    bio: "Biographie",
    disciplines: "Disciplines",
    verifiedLicenses: "Licences vérifiées",
    licenseNo: "N°",
    organizerReviews: "Avis organisateurs",
    eventHistory: (n: number) => `Historique des épreuves (${n})`,
    noEvents: "Aucune épreuve enregistrée.",
    generated: "Généré via TrackMarshal · trackmarshal.app",
    dateLocale: "fr-FR",
    dateTbd: "Date à confirmer",
  },
  en: {
    loading: "Generating CV...",
    notFound: "Profile not found.",
    back: "← Back",
    print: "Print / Save as PDF",
    jobTitle: "Motorsport Track Marshal",
    yearsExp: (n: number) => `${n} years of experience`,
    statEvents: "Events",
    statRating: "Avg. rating",
    statReviews: "Reviews",
    bio: "Biography",
    disciplines: "Disciplines",
    verifiedLicenses: "Verified Licenses",
    licenseNo: "No.",
    organizerReviews: "Organizer Reviews",
    eventHistory: (n: number) => `Event History (${n})`,
    noEvents: "No events recorded.",
    generated: "Generated via TrackMarshal · trackmarshal.app",
    dateLocale: "en-GB",
    dateTbd: "Date TBD",
  },
};

function fmtDateRange(startStr: string | null | undefined, endStr: string | null | undefined, locale: string, tbd: string): string {
  if (!startStr) return tbd;
  const start = new Date(startStr);
  if (isNaN(start.getTime())) return startStr;
  const fmt = (d: Date, opts: Intl.DateTimeFormatOptions) => d.toLocaleDateString(locale, opts);
  const full: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
  if (!endStr) return fmt(start, full);
  const end = new Date(endStr);
  if (isNaN(end.getTime()) || start.toDateString() === end.toDateString()) return fmt(start, full);
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()} – ${fmt(end, full)}`;
  }
  if (start.getFullYear() === end.getFullYear()) {
    return `${fmt(start, { day: "numeric", month: "long" })} – ${fmt(end, full)}`;
  }
  return `${fmt(start, full)} – ${fmt(end, full)}`;
}

export default function CvPrintPage({ params }: Props) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const lang = (searchParams.get("lang") === "en" ? "en" : "fr") as "fr" | "en";
  const t = T[lang];

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, [id]);

  async function load() {
    const { data: { session } } = await supabase.auth.getSession();

    const [{ data: profile }, { data: licenses }, { data: apps }, { data: reviews }, careerRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", id).single(),
      supabase.from("licenses").select("*").eq("user_id", id).order("created_at"),
      supabase.from("applications").select("*, events(id, title, event_date, event_end_date, location, discipline)").eq("marshal_id", id).eq("status", "accepted").order("created_at", { ascending: false }),
      supabase.from("reviews").select("rating, comment, created_at").eq("marshal_id", id).order("created_at", { ascending: false }),
      session
        ? fetch(`/api/admin/career-events?userId=${id}`, { headers: { Authorization: `Bearer ${session.access_token}` } }).then((r) => r.json()).catch(() => ({ events: [] }))
        : Promise.resolve({ events: [] }),
    ]);

    const platformEvents = (apps || []).map((a: any) => ({
      title: a.events?.title,
      start: a.events?.event_date,
      end: a.events?.event_end_date,
      location: a.events?.location,
      discipline: a.events?.discipline,
      role: null,
      source: "platform",
    })).filter((e: any) => e.title);

    const careerEvents = (careerRes?.events || []).map((e: any) => ({
      title: e.event_name,
      start: e.event_date,
      end: e.event_end_date,
      location: e.location,
      discipline: e.discipline,
      role: e.role,
      source: "manual",
    }));

    const allEvents = [...platformEvents, ...careerEvents].sort(
      (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()
    );

    const avgRating = reviews && reviews.length > 0
      ? Math.round((reviews.reduce((s: number, r: any) => s + (r.rating || 0), 0) / reviews.length) * 10) / 10
      : null;

    setData({ profile, licenses: licenses || [], allEvents, reviews: reviews || [], avgRating });
    setLoading(false);
  }

  useEffect(() => {
    if (!loading && data) {
      const timer = setTimeout(() => window.print(), 600);
      return () => clearTimeout(timer);
    }
  }, [loading, data]);

  if (loading) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif" }}>
        <p style={{ color: "#71717a" }}>{t.loading}</p>
      </div>
    );
  }

  if (!data?.profile) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif" }}>
        <p style={{ color: "#ef4444" }}>{t.notFound}</p>
      </div>
    );
  }

  const { profile, licenses, allEvents, reviews, avgRating } = data;
  const verifiedLicenses = licenses.filter((l: any) => l.verified);

  return (
    <>
      <style>{`
        @page { size: A4; margin: 12mm 14mm; }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', system-ui, sans-serif; background: white; color: #18181b; font-size: 11px; line-height: 1.5; }
      `}</style>

      {/* Actions bar — hidden on print */}
      <div className="no-print" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e4e4e7", background: "white", padding: "12px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <a href={`/admin/cv-lab/${id}`} style={{ fontSize: "13px", fontWeight: 600, color: "#52525b", textDecoration: "none" }}>{t.back}</a>
        <button onClick={() => window.print()} style={{ background: "#FF5A1F", color: "white", border: "none", borderRadius: "12px", padding: "8px 20px", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
          {t.print}
        </button>
      </div>

      {/* CV A4 */}
      <div style={{ maxWidth: "794px", margin: "0 auto", padding: "64px 0 32px", background: "white" }}>
        <style>{`@media print { div { padding-top: 0 !important; } }`}</style>

        {/* Header */}
        <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", borderBottom: "2px solid #FF5A1F", paddingBottom: "16px", marginBottom: "16px" }}>
          {profile.avatar_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar_url} alt={profile.full_name} style={{ width: "88px", height: "88px", borderRadius: "12px", objectFit: "cover", flexShrink: 0 }} />
          )}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <h1 style={{ fontSize: "24px", fontWeight: 900, color: "#18181b", lineHeight: 1.1 }}>{profile.full_name}</h1>
                <p style={{ fontSize: "11px", color: "#FF5A1F", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: "4px" }}>
                  {t.jobTitle}
                </p>
              </div>
              <div style={{ textAlign: "right", fontSize: "10px", color: "#71717a" }}>
                <p>{[profile.city, profile.country].filter(Boolean).join(", ")}</p>
                {profile.years_experience && <p style={{ marginTop: "2px" }}>{t.yearsExp(profile.years_experience)}</p>}
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              {[
                { label: t.statEvents, value: allEvents.length },
                avgRating ? { label: t.statRating, value: `${avgRating}/5 ★` } : null,
                { label: t.statReviews, value: reviews.length },
              ].filter(Boolean).map((s: any) => (
                <div key={s.label} style={{ background: "#f4f4f5", borderRadius: "8px", padding: "5px 12px", textAlign: "center" }}>
                  <p style={{ fontSize: "15px", fontWeight: 900, color: "#FF5A1F" }}>{s.value}</p>
                  <p style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#71717a" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ display: "grid", gridTemplateColumns: "190px 1fr", gap: "20px" }}>

          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {profile.bio && (
              <div>
                <p style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#FF5A1F", marginBottom: "5px" }}>{t.bio}</p>
                <p style={{ color: "#3f3f46", lineHeight: 1.6 }}>{profile.bio}</p>
              </div>
            )}
            {profile.disciplines && (
              <div>
                <p style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#FF5A1F", marginBottom: "5px" }}>{t.disciplines}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {profile.disciplines.split(",").map((d: string) => (
                    <span key={d} style={{ background: "#fff1ec", border: "1px solid #ffd5c5", borderRadius: "99px", padding: "2px 8px", fontSize: "9px", fontWeight: 700, color: "#FF5A1F", textTransform: "uppercase" }}>{d.trim()}</span>
                  ))}
                </div>
              </div>
            )}
            {verifiedLicenses.length > 0 && (
              <div>
                <p style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#FF5A1F", marginBottom: "5px" }}>{t.verifiedLicenses}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  {verifiedLicenses.map((l: any) => (
                    <div key={l.id} style={{ border: "1px solid #e4e4e7", borderRadius: "8px", padding: "6px 8px" }}>
                      <p style={{ fontWeight: 700, color: "#18181b", fontSize: "10px" }}>{l.type || "—"}</p>
                      <p style={{ fontSize: "9px", color: "#71717a" }}>{l.category === "moto" ? "FFM" : "FFSA"}{l.number ? ` · ${t.licenseNo} ${l.number}` : ""}{l.asa ? ` · ${l.asa}` : ""}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {reviews.filter((r: any) => r.comment).length > 0 && (
              <div>
                <p style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#FF5A1F", marginBottom: "5px" }}>{t.organizerReviews}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {reviews.filter((r: any) => r.comment).slice(0, 3).map((r: any, i: number) => (
                    <div key={i} style={{ border: "1px solid #e4e4e7", borderRadius: "8px", padding: "6px 8px" }}>
                      <p style={{ fontSize: "9px", color: "#FF5A1F", fontWeight: 700, marginBottom: "2px" }}>{"★".repeat(r.rating || 0)}{"☆".repeat(5 - (r.rating || 0))}</p>
                      <p style={{ color: "#52525b", lineHeight: 1.5, fontSize: "9px" }}>"{r.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — events */}
          <div>
            <p style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#FF5A1F", marginBottom: "8px" }}>
              {t.eventHistory(allEvents.length)}
            </p>
            {allEvents.length === 0 && <p style={{ color: "#a1a1aa", fontStyle: "italic" }}>{t.noEvents}</p>}
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {allEvents.map((e: any, i: number) => (
                <div key={i} style={{ display: "flex", gap: "10px", borderLeft: `2px solid ${e.source === "platform" ? "#22c55e" : "#d4d4d8"}`, paddingLeft: "8px", paddingTop: "3px", paddingBottom: "3px" }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, color: "#18181b", fontSize: "10px" }}>{e.title}</p>
                    {e.role && <p style={{ color: "#FF5A1F", fontSize: "9px", fontWeight: 600 }}>{e.role}</p>}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "2px", color: "#71717a", fontSize: "9px" }}>
                      <span>{fmtDateRange(e.start, e.end, t.dateLocale, t.dateTbd)}</span>
                      {e.location && <span>· {e.location}</span>}
                      {e.discipline && <span>· {e.discipline}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{ marginTop: "24px", paddingTop: "10px", borderTop: "1px solid #e4e4e7", display: "flex", justifyContent: "space-between", color: "#a1a1aa", fontSize: "9px" }}>
          <span>{t.generated}</span>
          <span>{new Date().toLocaleDateString(t.dateLocale, { day: "numeric", month: "long", year: "numeric" })}</span>
        </div>
      </div>
    </>
  );
}

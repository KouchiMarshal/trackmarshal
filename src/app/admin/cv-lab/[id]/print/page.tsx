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
        @page { size: A4 portrait; margin: 12mm 14mm; }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; }
          .no-print { display: none !important; }
          .cv-wrapper { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
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
      <div className="cv-wrapper" style={{ width: "100%", maxWidth: "794px", margin: "0 auto", padding: "56px 0 24px", background: "white" }}>

        {/* Header */}
        <div style={{ display: "flex", gap: "18px", alignItems: "center", paddingBottom: "14px", marginBottom: "14px", borderBottom: "2.5px solid #FF5A1F" }}>
          {profile.avatar_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar_url} alt={profile.full_name} style={{ width: "76px", height: "76px", borderRadius: "10px", objectFit: "cover", flexShrink: 0 }} />
          )}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: "22pt", fontWeight: 900, color: "#18181b", lineHeight: 1.1 }}>{profile.full_name}</h1>
            <p style={{ fontSize: "8pt", color: "#FF5A1F", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginTop: "3px" }}>{t.jobTitle}</p>
            <p style={{ fontSize: "8pt", color: "#71717a", marginTop: "2px" }}>{[profile.city, profile.country].filter(Boolean).join(", ")}{profile.years_experience ? ` · ${t.yearsExp(profile.years_experience)}` : ""}</p>
          </div>
          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
            {[
              { label: t.statEvents, value: allEvents.length },
              avgRating ? { label: t.statRating, value: `${avgRating}/5 ★` } : null,
              { label: t.statReviews, value: reviews.length },
            ].filter(Boolean).map((s: any) => (
              <div key={s.label} style={{ background: "#f4f4f5", borderRadius: "8px", padding: "6px 12px", textAlign: "center", minWidth: "52px" }}>
                <p style={{ fontSize: "14pt", fontWeight: 900, color: "#FF5A1F", lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: "7pt", textTransform: "uppercase", letterSpacing: "0.08em", color: "#71717a", marginTop: "2px" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Info strip — bio, disciplines, licences side by side */}
        {(profile.bio || profile.disciplines || verifiedLicenses.length > 0 || reviews.filter((r: any) => r.comment).length > 0) && (
          <div style={{ display: "flex", gap: "16px", marginBottom: "14px", paddingBottom: "14px", borderBottom: "1px solid #e4e4e7" }}>
            {profile.bio && (
              <div style={{ flex: 2 }}>
                <p style={{ fontSize: "7pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#FF5A1F", marginBottom: "4px" }}>{t.bio}</p>
                <p style={{ fontSize: "8pt", color: "#3f3f46", lineHeight: 1.55 }}>{profile.bio}</p>
              </div>
            )}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
              {profile.disciplines && (
                <div>
                  <p style={{ fontSize: "7pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#FF5A1F", marginBottom: "4px" }}>{t.disciplines}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}>
                    {profile.disciplines.split(",").map((d: string) => (
                      <span key={d} style={{ background: "#fff1ec", border: "1px solid #ffd5c5", borderRadius: "99px", padding: "1px 7px", fontSize: "7.5pt", fontWeight: 700, color: "#FF5A1F", textTransform: "uppercase" }}>{d.trim()}</span>
                    ))}
                  </div>
                </div>
              )}
              {verifiedLicenses.length > 0 && (
                <div>
                  <p style={{ fontSize: "7pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#FF5A1F", marginBottom: "4px" }}>{t.verifiedLicenses}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    {verifiedLicenses.map((l: any) => (
                      <div key={l.id} style={{ border: "1px solid #e4e4e7", borderRadius: "6px", padding: "4px 8px" }}>
                        <p style={{ fontWeight: 700, color: "#18181b", fontSize: "8pt" }}>{l.type || "—"}</p>
                        <p style={{ fontSize: "7.5pt", color: "#71717a" }}>{l.category === "moto" ? "FFM" : "FFSA"}{l.number ? ` · ${t.licenseNo} ${l.number}` : ""}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {reviews.filter((r: any) => r.comment).length > 0 && (
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "7pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#FF5A1F", marginBottom: "4px" }}>{t.organizerReviews}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  {reviews.filter((r: any) => r.comment).slice(0, 2).map((r: any, i: number) => (
                    <div key={i} style={{ border: "1px solid #e4e4e7", borderRadius: "6px", padding: "4px 8px" }}>
                      <p style={{ fontSize: "8pt", color: "#FF5A1F", fontWeight: 700 }}>{"★".repeat(r.rating || 0)}{"☆".repeat(5 - (r.rating || 0))}</p>
                      <p style={{ color: "#52525b", lineHeight: 1.4, fontSize: "7.5pt" }}>"{r.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Events — 2 columns to maximise space usage */}
        <div>
          <p style={{ fontSize: "7pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#FF5A1F", marginBottom: "8px" }}>
            {t.eventHistory(allEvents.length)}
          </p>
          {allEvents.length === 0 && <p style={{ color: "#a1a1aa", fontStyle: "italic", fontSize: "8pt" }}>{t.noEvents}</p>}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 16px" }}>
            {allEvents.map((e: any, i: number) => (
              <div key={i} style={{ borderLeft: `2px solid ${e.source === "platform" ? "#22c55e" : "#d4d4d8"}`, paddingLeft: "7px", paddingTop: "3px", paddingBottom: "3px", pageBreakInside: "avoid" }}>
                <p style={{ fontWeight: 700, color: "#18181b", fontSize: "8.5pt", lineHeight: 1.2 }}>{e.title}</p>
                {e.role && <p style={{ color: "#FF5A1F", fontSize: "7.5pt", fontWeight: 600 }}>{e.role}</p>}
                <p style={{ color: "#71717a", fontSize: "7.5pt", marginTop: "1px" }}>
                  {fmtDateRange(e.start, e.end, t.dateLocale, t.dateTbd)}
                  {e.location ? ` · ${e.location}` : ""}
                  {e.discipline ? ` · ${e.discipline}` : ""}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: "20px", paddingTop: "8px", borderTop: "1px solid #e4e4e7", display: "flex", justifyContent: "space-between", color: "#a1a1aa", fontSize: "7pt" }}>
          <span>{t.generated}</span>
          <span>{new Date().toLocaleDateString(t.dateLocale, { day: "numeric", month: "long", year: "numeric" })}</span>
        </div>
      </div>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { BarChart3, CalendarCheck, FileCheck2, MessageSquare, TrendingUp, Users, ExternalLink } from "lucide-react";

type MonthPoint = { key: string; label: string; count: number };

function buildMonths(rows: { created_at: string }[], now: Date): MonthPoint[] {
  const map: Record<string, number> = {};
  rows.forEach((r) => {
    const d = new Date(r.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    map[key] = (map[key] || 0) + 1;
  });
  const months: MonthPoint[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    months.push({ key, label: d.toLocaleDateString("fr-FR", { month: "short" }), count: map[key] || 0 });
  }
  return months;
}

function MiniChart({ data, color }: { data: MonthPoint[]; color: string }) {
  const max = Math.max(...data.map((m) => m.count), 1);
  return (
    <div className="flex items-end gap-1 h-20">
      {data.map((m) => (
        <div key={m.key} className="group flex flex-1 flex-col items-center gap-1">
          <span className={`text-[9px] font-black transition ${m.count === 0 ? "opacity-0" : ""}`} style={{ color }}>
            {m.count}
          </span>
          <div
            className="w-full rounded-t-md transition-all"
            style={{
              height: `${Math.max(4, Math.round((m.count / max) * 52))}px`,
              background: color,
              opacity: m.count === 0 ? 0.15 : 1,
            }}
          />
          <span className="text-[8px] text-zinc-400">{m.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);

  // KPIs
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalApplications, setTotalApplications] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [acceptedApplications, setAcceptedApplications] = useState(0);

  // Charts 12 months
  const [signups, setSignups] = useState<MonthPoint[]>([]);
  const [applications, setApplications] = useState<MonthPoint[]>([]);
  const [events, setEvents] = useState<MonthPoint[]>([]);

  // Applications by status
  const [appStatuses, setAppStatuses] = useState<{ status: string; count: number }[]>([]);

  useEffect(() => {
    async function load() {
      const now = new Date();
      const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1).toISOString();

      const [usersRes, eventsRes, appsRes, msgsRes, appsAllRes] = await Promise.all([
        supabase.from("profiles").select("created_at").gte("created_at", twelveMonthsAgo),
        supabase.from("events").select("created_at").gte("created_at", twelveMonthsAgo),
        supabase.from("applications").select("created_at").gte("created_at", twelveMonthsAgo),
        supabase.from("messages").select("id", { count: "exact", head: true }),
        supabase.from("applications").select("status"),
      ]);

      const usersAll = await supabase.from("profiles").select("id", { count: "exact", head: true });
      const eventsAll = await supabase.from("events").select("id", { count: "exact", head: true });
      const appsAllCount = await supabase.from("applications").select("id", { count: "exact", head: true });

      setTotalUsers(usersAll.count || 0);
      setTotalEvents(eventsAll.count || 0);
      setTotalApplications(appsAllCount.count || 0);
      setTotalMessages(msgsRes.count || 0);

      setSignups(buildMonths(usersRes.data || [], now));
      setEvents(buildMonths(eventsRes.data || [], now));
      setApplications(buildMonths(appsRes.data || [], now));

      const allApps = appsAllRes.data || [];
      const accepted = allApps.filter((a) => a.status === "accepted").length;
      setAcceptedApplications(accepted);

      const statusMap: Record<string, number> = {};
      allApps.forEach((a) => {
        const s = a.status || "pending";
        statusMap[s] = (statusMap[s] || 0) + 1;
      });
      setAppStatuses(Object.entries(statusMap).map(([status, count]) => ({ status, count })).sort((a, b) => b.count - a.count));

      setLoading(false);
    }
    load();
  }, []);

  const acceptRate = totalApplications > 0 ? Math.round((acceptedApplications / totalApplications) * 100) : 0;

  const statusLabel: Record<string, { label: string; color: string; bg: string }> = {
    accepted:  { label: "Acceptées",  color: "#16a34a", bg: "#f0fdf4" },
    rejected:  { label: "Refusées",   color: "#dc2626", bg: "#fef2f2" },
    pending:   { label: "En attente", color: "#d97706", bg: "#fffbeb" },
    waitlisted:{ label: "Liste d'attente", color: "#2563eb", bg: "#eff6ff" },
  };

  return (
    <div>
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white">
        <div className="flex h-20 items-center px-6 lg:px-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Administration</p>
            <h1 className="mt-1 text-2xl font-black text-zinc-900 lg:text-3xl">Analytiques</h1>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] p-6 pb-32 lg:p-10 lg:pb-10 space-y-10">

        {/* Vercel Analytics card */}
        <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm p-6 lg:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-900">
                <BarChart3 size={22} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-zinc-900">Trafic web — Vercel Analytics</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Pages vues, visiteurs uniques, pays, appareils et performances — mis à jour en temps réel.
                </p>
              </div>
            </div>
            <a
              href="https://vercel.com/kouchimarshal/trackmarshal/analytics"
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center gap-2 rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-zinc-700"
            >
              Ouvrir Vercel Analytics
              <ExternalLink size={14} />
            </a>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Pages vues", sub: "Toutes les pages" },
              { label: "Visiteurs uniques", sub: "Par session" },
              { label: "Performance", sub: "Core Web Vitals" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
                <p className="text-sm font-bold text-zinc-900">{item.label}</p>
                <p className="text-xs text-zinc-500">{item.sub}</p>
                <p className="mt-3 text-xs text-zinc-400 italic">Voir dans Vercel Analytics →</p>
              </div>
            ))}
          </div>
        </div>

        {/* KPIs */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { icon: Users, label: "Utilisateurs inscrits", value: totalUsers, color: "text-zinc-900", border: "border-zinc-200", bg: "bg-white" },
            { icon: CalendarCheck, label: "Événements publiés", value: totalEvents, color: "text-blue-600", border: "border-blue-200", bg: "bg-blue-50" },
            { icon: FileCheck2, label: "Candidatures totales", value: totalApplications, color: "text-[#FF5A1F]", border: "border-orange-200", bg: "bg-orange-50" },
            { icon: MessageSquare, label: "Messages échangés", value: totalMessages, color: "text-green-600", border: "border-green-200", bg: "bg-green-50" },
          ].map(({ icon: Icon, label, value, color, border, bg }) => (
            <div key={label} className={`rounded-3xl border ${border} ${bg} p-7`}>
              <div className="flex items-center gap-3">
                <Icon size={18} className={color} />
                <p className="text-sm text-zinc-600">{label}</p>
              </div>
              {loading ? (
                <div className="mt-5 h-12 w-24 animate-pulse rounded-xl bg-zinc-200" />
              ) : (
                <p className={`mt-5 text-5xl font-black ${color}`}>{value.toLocaleString("fr-FR")}</p>
              )}
            </div>
          ))}
        </div>

        {/* Taux d'acceptation */}
        <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm p-6 lg:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Engagement</p>
              <h2 className="mt-2 text-2xl font-black text-zinc-900">Candidatures par statut</h2>
            </div>
            <div className="text-right">
              <p className="text-4xl font-black text-[#FF5A1F]">{acceptRate}%</p>
              <p className="text-sm text-zinc-500">taux d'acceptation</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {appStatuses.map(({ status, count }) => {
              const s = statusLabel[status] || { label: status, color: "#71717a", bg: "#fafafa" };
              return (
                <div key={status} className="flex items-center gap-3 rounded-2xl border px-5 py-3" style={{ borderColor: s.color + "33", background: s.bg }}>
                  <div className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-sm font-bold text-zinc-700">{s.label}</span>
                  <span className="text-lg font-black" style={{ color: s.color }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3 graphiques côte à côte */}
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { title: "Nouvelles inscriptions", sub: "Tous rôles — 12 mois", data: signups, color: "#FF5A1F", icon: Users },
            { title: "Candidatures soumises", sub: "12 derniers mois", data: applications, color: "#2563eb", icon: FileCheck2 },
            { title: "Événements publiés", sub: "12 derniers mois", data: events, color: "#16a34a", icon: CalendarCheck },
          ].map(({ title, sub, data, color, icon: Icon }) => {
            const total = data.reduce((s, m) => s + m.count, 0);
            return (
              <div key={title} className="rounded-3xl border border-zinc-200 bg-white shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Icon size={16} style={{ color }} />
                      <p className="text-sm font-black text-zinc-900">{title}</p>
                    </div>
                    <p className="text-xs text-zinc-500">{sub}</p>
                  </div>
                  <div className="text-right">
                    {loading ? (
                      <div className="h-8 w-12 animate-pulse rounded-lg bg-zinc-200" />
                    ) : (
                      <p className="text-3xl font-black" style={{ color }}>{total}</p>
                    )}
                  </div>
                </div>
                {loading ? (
                  <div className="h-20 animate-pulse rounded-2xl bg-zinc-100" />
                ) : (
                  <MiniChart data={data} color={color} />
                )}
              </div>
            );
          })}
        </div>

        {/* Croissance cumulée */}
        <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm p-6 lg:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Vue d'ensemble</p>
              <h2 className="mt-2 text-2xl font-black text-zinc-900">Activité mensuelle combinée</h2>
              <p className="mt-1 text-sm text-zinc-500">Inscriptions + candidatures + événements — 12 derniers mois</p>
            </div>
            <div className="flex gap-5">
              {[
                { label: "Inscriptions", color: "#FF5A1F" },
                { label: "Candidatures", color: "#2563eb" },
                { label: "Événements", color: "#16a34a" },
              ].map(({ label, color }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="h-2 w-4 rounded-full" style={{ background: color }} />
                  <span className="text-xs text-zinc-500">{label}</span>
                </div>
              ))}
            </div>
          </div>
          {loading ? (
            <div className="h-28 animate-pulse rounded-2xl bg-zinc-100" />
          ) : (
            <div className="flex items-end gap-1.5 sm:gap-2 h-28">
              {signups.map((m, i) => {
                const a = applications[i]?.count || 0;
                const e = events[i]?.count || 0;
                const maxVal = Math.max(...signups.map((s, j) => s.count + (applications[j]?.count || 0) + (events[j]?.count || 0)), 1);
                const total = m.count + a + e;
                const h = Math.max(4, Math.round((total / maxVal) * 88));
                const signupH = total > 0 ? Math.round((m.count / total) * h) : 0;
                const appH = total > 0 ? Math.round((a / total) * h) : 0;
                const evtH = h - signupH - appH;
                return (
                  <div key={m.key} className="flex flex-1 flex-col items-center gap-1">
                    <div className="flex w-full flex-col-reverse rounded-t-md overflow-hidden" style={{ height: `${h}px` }}>
                      {signupH > 0 && <div style={{ height: `${signupH}px`, background: "#FF5A1F" }} />}
                      {appH > 0 && <div style={{ height: `${appH}px`, background: "#2563eb" }} />}
                      {evtH > 0 && <div style={{ height: `${evtH}px`, background: "#16a34a" }} />}
                    </div>
                    <span className="text-[8px] text-zinc-400">{m.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Conseil SEO */}
        <div className="rounded-3xl border border-[#FF5A1F]/20 bg-orange-50 p-6 lg:p-8">
          <div className="flex items-start gap-4">
            <TrendingUp size={22} className="mt-0.5 shrink-0 text-[#FF5A1F]" />
            <div>
              <h2 className="text-lg font-black text-zinc-900">Améliorer la fréquentation</h2>
              <ul className="mt-3 space-y-2 text-sm text-zinc-600">
                <li>→ Soumets le sitemap dans <strong>Google Search Console</strong> si ce n'est pas déjà fait.</li>
                <li>→ Demande l'indexation de <code className="rounded bg-orange-100 px-1">/devenir-commissaire</code> et <code className="rounded bg-orange-100 px-1">/events</code> manuellement.</li>
                <li>→ Surveille les Core Web Vitals dans <strong>Vercel Analytics</strong> — un score élevé améliore le classement Google.</li>
                <li>→ Partage régulièrement des événements sur les réseaux sociaux pour générer du trafic entrant.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

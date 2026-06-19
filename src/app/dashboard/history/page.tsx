"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, MapPin, Trophy } from "lucide-react";
import { supabase } from "@/lib/supabase";
import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import NotificationBell from "@/components/notifications/notification-bell";
import { formatDateRange } from "@/lib/formatDate";

const DISC_STYLE: Record<string, string> = {
  "Circuit":        "text-blue-700 border-blue-200 bg-blue-100",
  "Rallye":         "text-[#FF5A1F] border-[#FF5A1F]/30 bg-[#FF5A1F]/10",
  "Course de côte": "text-purple-700 border-purple-200 bg-purple-100",
  "Karting":        "text-green-700 border-green-200 bg-green-100",
  "Tout-terrain":   "text-yellow-700 border-yellow-200 bg-yellow-100",
  "Endurance":      "text-red-700 border-red-200 bg-red-100",
  "Drift":          "text-pink-700 border-pink-200 bg-pink-100",
  "Moto Cross":     "text-cyan-700 border-cyan-200 bg-cyan-100",
  "Enduro":         "text-lime-700 border-lime-200 bg-lime-100",
  "Road Racing":    "text-orange-700 border-orange-200 bg-orange-100",
};

export default function HistoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [participations, setParticipations] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState("all");

  useEffect(() => { loadHistory(); }, []);

  async function loadHistory() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("full_name, license_type, license_number, asa, avatar_url")
      .eq("id", user.id)
      .single();
    setProfile(profileData);

    const { data: apps } = await supabase
      .from("applications")
      .select("id, post, events(id, title, discipline, event_date, event_end_date, location)")
      .eq("marshal_id", user.id)
      .eq("attended", true)
      .order("created_at", { ascending: false });

    setParticipations(apps || []);
    setLoading(false);
  }

  const byYear: Record<string, any[]> = {};
  participations.forEach((p) => {
    const year = p.events?.event_date
      ? new Date(p.events.event_date).getFullYear().toString()
      : "?";
    if (!byYear[year]) byYear[year] = [];
    byYear[year].push(p);
  });
  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

  const statsByDiscipline: Record<string, number> = {};
  participations.forEach((p) => {
    const d = p.events?.discipline || "Autre";
    statsByDiscipline[d] = (statsByDiscipline[d] || 0) + 1;
  });

  const filtered = selectedYear === "all"
    ? participations
    : (byYear[selectedYear] || []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 text-zinc-900">
        <p className="text-zinc-500">Chargement...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1">

          <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white">
            <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-10">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Dashboard Commissaire</p>
                <h1 className="mt-2 text-2xl font-black text-zinc-900 lg:text-4xl">Mon historique</h1>
              </div>
              <NotificationBell />
            </div>
          </header>

          <div className="relative overflow-hidden">

            <div className="relative z-10 mx-auto max-w-[1600px] p-4 pb-24 sm:p-6 lg:p-10 lg:pb-10">

              {/* Licence + total */}
              <div className="mb-6 flex flex-wrap items-center gap-4 rounded-[24px] border border-[#FF5A1F]/20 bg-[#FF5A1F]/5 p-5">
                <Trophy size={24} className="text-[#FF5A1F] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Licence</p>
                  <p className="font-black text-[#FF5A1F] truncate">
                    {profile?.license_type || "—"}
                    {profile?.license_number ? ` · N° ${profile.license_number}` : ""}
                    {profile?.asa ? ` — ${profile.asa}` : ""}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Total</p>
                  <p className="text-3xl font-black text-zinc-900">{participations.length}</p>
                </div>
              </div>

              {/* Stats by discipline */}
              {Object.keys(statsByDiscipline).length > 0 && (
                <div className="mb-6 grid gap-3 grid-cols-2 sm:grid-cols-3 xl:grid-cols-5">
                  {Object.entries(statsByDiscipline).sort((a, b) => b[1] - a[1]).map(([disc, count]) => (
                    <div key={disc} className={`rounded-[20px] border p-4 ${DISC_STYLE[disc] || "border-zinc-200 bg-white text-zinc-900"}`}>
                      <p className="text-xs uppercase tracking-[0.15em] opacity-70 truncate">{disc}</p>
                      <p className="mt-2 text-4xl font-black">{count}</p>
                      <p className="text-xs opacity-60">fois</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Year filter */}
              {years.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedYear("all")}
                    className={`rounded-full px-4 py-2 text-sm font-bold transition ${selectedYear === "all" ? "bg-[#FF5A1F] text-white" : "border border-zinc-200 text-zinc-600 hover:text-zinc-900"}`}
                  >
                    Toutes les années
                  </button>
                  {years.map((y) => (
                    <button
                      key={y}
                      onClick={() => setSelectedYear(y)}
                      className={`rounded-full px-4 py-2 text-sm font-bold transition ${selectedYear === y ? "bg-[#FF5A1F] text-white" : "border border-zinc-200 text-zinc-600 hover:text-zinc-900"}`}
                    >
                      {y} <span className="ml-1 opacity-60 text-xs">({byYear[y].length})</span>
                    </button>
                  ))}
                </div>
              )}

              {/* List */}
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-[32px] border border-dashed border-zinc-300 py-20 text-center">
                  <Trophy size={40} className="text-zinc-300" />
                  <p className="mt-4 font-semibold text-zinc-500">Aucune participation enregistrée</p>
                  <p className="mt-2 text-sm text-zinc-400 max-w-xs">
                    Vos participations apparaissent ici une fois que l'organisateur a validé votre présence dans le bilan post-événement.
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {selectedYear === "all" ? (
                    years.map((year) => (
                      <div key={year}>
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">
                          {year} — {byYear[year].length} participation{byYear[year].length > 1 ? "s" : ""}
                        </p>
                        <div className="space-y-2">
                          {byYear[year].map((p) => <EventRow key={p.id} p={p} />)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="space-y-2">
                      {filtered.map((p) => <EventRow key={p.id} p={p} />)}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function EventRow({ p }: { p: any }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-[20px] border border-zinc-200 bg-white p-4 hover:bg-zinc-50 lg:p-5">
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-black text-zinc-900">{p.events?.title}</span>
          {p.events?.discipline && (
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${DISC_STYLE[p.events.discipline] || "border-zinc-200 text-zinc-600"}`}>
              {p.events.discipline}
            </span>
          )}
          {p.post && <span className="text-xs text-zinc-500 italic">{p.post}</span>}
        </div>
        <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-zinc-500">
          {p.events?.event_date && (
            <span className="flex items-center gap-1">
              <CalendarDays size={11} />
              {formatDateRange(p.events.event_date, p.events.event_end_date)}
            </span>
          )}
          {p.events?.location && (
            <span className="flex items-center gap-1">
              <MapPin size={11} />
              {p.events.location}
            </span>
          )}
        </div>
      </div>
      <span className="shrink-0 rounded-full border border-green-200 bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
        ✔ Présent
      </span>
    </div>
  );
}

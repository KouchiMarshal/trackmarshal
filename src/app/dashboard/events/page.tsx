"use client";

import { CalendarDays, ChevronLeft, ChevronRight, LayoutGrid, MapPin, Search, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import NotificationBell from "@/components/notifications/notification-bell";
import { formatDateRange } from "@/lib/formatDate";
import { Toast, type ToastData } from "@/components/ui/toast";
import { SkeletonEventCard } from "@/components/ui/skeleton";
import { canApplyToEvent } from "@/lib/licenseUtils";

const DISCIPLINES = ["Rallye", "Circuit", "Karting", "Drift", "Endurance", "Moto Cross", "Enduro", "Trial", "Road Racing", "Supermoto", "Rallye Moto"];

export default function DashboardEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [acceptedCounts, setAcceptedCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastData>(null);

  const [search, setSearch] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "calendar">("grid");
  const [calendarDate, setCalendarDate] = useState(new Date());

  useEffect(() => {
    let userId: string | null = null;

    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      userId = user.id;
      await loadData(user.id);

      const channel = supabase
        .channel("dashboard-applications")
        .on("postgres_changes", { event: "*", schema: "public", table: "applications", filter: `marshal_id=eq.${user.id}` },
          () => loadApplications(user.id))
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }

    init();
  }, []);

  async function loadData(userId: string) {
    const [eventsRes, applicationsRes, licensesRes] = await Promise.all([
      supabase.from("events").select("*").order("event_date", { ascending: true }),
      supabase.from("applications").select("*").eq("marshal_id", userId),
      supabase.from("licenses").select("category, verified").eq("user_id", userId),
    ]);

    const evs = eventsRes.data || [];
    setEvents(evs);
    setApplications(applicationsRes.data || []);
    setUserProfile(licensesRes.data || []);

    if (evs.length > 0) {
      const { data: accepted } = await supabase
        .from("applications")
        .select("event_id")
        .in("event_id", evs.map((e: any) => e.id))
        .eq("status", "accepted");
      const counts: Record<string, number> = {};
      (accepted || []).forEach((a: any) => { counts[a.event_id] = (counts[a.event_id] || 0) + 1; });
      setAcceptedCounts(counts);
    }

    setLoading(false);
  }

  async function loadApplications(userId: string) {
    const { data } = await supabase.from("applications").select("*").eq("marshal_id", userId);
    setApplications(data || []);
  }

  async function applyToEvent(eventId: string, eventDiscipline?: string) {
    const check = canApplyToEvent(userProfile || {}, eventDiscipline);
    if (!check.allowed) {
      setToast({ message: check.reason || "Licence non valide pour cet événement.", type: "error" });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("applications")
      .insert({ marshal_id: user.id, event_id: eventId, status: "pending" });

    if (error) {
      setToast({ message: error.message, type: "error" });
      return;
    }

    setToast({ message: "Candidature envoyée avec succès !", type: "success" });
    loadApplications(user.id);
  }

  const now = new Date();

  const filtered = events.filter((event) => {
    const matchSearch =
      !search ||
      event.title?.toLowerCase().includes(search.toLowerCase()) ||
      event.location?.toLowerCase().includes(search.toLowerCase()) ||
      event.country?.toLowerCase().includes(search.toLowerCase());

    const matchDiscipline = !discipline || event.discipline === discipline;

    let matchDate = true;
    if (dateFilter === "month") {
      const d = new Date(event.event_date);
      matchDate = d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    } else if (dateFilter === "3months") {
      const d = new Date(event.event_date);
      const limit = new Date(now);
      limit.setMonth(limit.getMonth() + 3);
      matchDate = d >= now && d <= limit;
    } else if (dateFilter === "upcoming") {
      const eventEnd = event.event_end_date ? new Date(event.event_end_date) : new Date(event.event_date);
      matchDate = eventEnd >= now;
    }

    return matchSearch && matchDiscipline && matchDate;
  });

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">

      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="flex min-h-screen">

        <DashboardSidebar />

        <div className="flex-1">

          <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white">
            <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-10">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Dashboard Commissaire</p>
                <h1 className="mt-2 text-2xl font-black text-zinc-900 lg:text-4xl">Événements</h1>
              </div>
              <NotificationBell />
            </div>
          </header>

          <div className="relative overflow-hidden">

            <div className="relative z-10 mx-auto max-w-[1600px] p-4 pb-24 sm:p-6 lg:p-10 lg:pb-10">

              {/* Barre de recherche + toggle vue */}
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-14 flex-1 items-center gap-4 rounded-[20px] border border-zinc-300 bg-zinc-50 px-5">
                  <Search size={20} className="shrink-0 text-[#FF5A1F]" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, ville, pays..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-transparent text-zinc-900 outline-none placeholder:text-zinc-400"
                  />
                  {search && (
                    <button onClick={() => setSearch("")} className="shrink-0 text-xs text-zinc-500 hover:text-zinc-900">
                      Effacer
                    </button>
                  )}
                </div>
                <div className="flex h-14 shrink-0 items-center gap-1 rounded-[20px] border border-zinc-200 bg-white p-1.5">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${viewMode === "grid" ? "bg-[#FF5A1F] text-white" : "text-zinc-500 hover:text-zinc-900"}`}
                    title="Vue grille"
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("calendar")}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${viewMode === "calendar" ? "bg-[#FF5A1F] text-white" : "text-zinc-500 hover:text-zinc-900"}`}
                    title="Vue calendrier"
                  >
                    <CalendarDays size={18} />
                  </button>
                </div>
              </div>

              {/* Filtres discipline */}
              <div className="mb-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setDiscipline("")}
                  className={`rounded-full px-4 py-2 text-sm font-bold uppercase tracking-[0.1em] transition ${
                    discipline === "" ? "bg-[#FF5A1F] text-white" : "border border-zinc-200 text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  Toutes
                </button>
                {DISCIPLINES.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDiscipline(discipline === d ? "" : d)}
                    className={`rounded-full px-4 py-2 text-sm font-bold uppercase tracking-[0.1em] transition ${
                      discipline === d ? "bg-[#FF5A1F] text-white" : "border border-zinc-200 text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              {/* Filtres date */}
              <div className="mb-8 flex flex-wrap gap-2">
                {[
                  { key: "all", label: "Toutes dates" },
                  { key: "upcoming", label: "À venir" },
                  { key: "month", label: "Ce mois" },
                  { key: "3months", label: "3 prochains mois" },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setDateFilter(f.key)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
                      dateFilter === f.key
                        ? "bg-zinc-200 text-zinc-900"
                        : "border border-zinc-200 text-zinc-500 hover:text-zinc-900"
                    }`}
                  >
                    <CalendarDays size={14} />
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Vue Calendrier */}
              {viewMode === "calendar" && !loading && (
                <div className="mb-8 rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm lg:p-8">
                  <div className="mb-6 flex items-center justify-between">
                    <button
                      onClick={() => setCalendarDate((d) => { const n = new Date(d); n.setMonth(n.getMonth() - 1); return n; })}
                      className="flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-200 text-zinc-600 transition hover:bg-zinc-100"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <h3 className="text-xl font-black capitalize text-zinc-900">
                      {calendarDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                    </h3>
                    <button
                      onClick={() => setCalendarDate((d) => { const n = new Date(d); n.setMonth(n.getMonth() + 1); return n; })}
                      className="flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-200 text-zinc-600 transition hover:bg-zinc-100"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                  <div className="min-w-[320px]">
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
                      <div key={d} className="py-2 text-xs font-bold uppercase tracking-[0.1em] text-zinc-500">{d}</div>
                    ))}
                    {(() => {
                      const year = calendarDate.getFullYear();
                      const month = calendarDate.getMonth();
                      const firstDay = new Date(year, month, 1).getDay();
                      const offset = firstDay === 0 ? 6 : firstDay - 1;
                      const daysInMonth = new Date(year, month + 1, 0).getDate();
                      const cells: JSX.Element[] = [];
                      for (let i = 0; i < offset; i++) cells.push(<div key={`e${i}`} />);
                      for (let day = 1; day <= daysInMonth; day++) {
                        const date = new Date(year, month, day);
                        const eventsOnDay = events.filter((ev) => {
                          const start = new Date(ev.event_date);
                          const end = ev.event_end_date ? new Date(ev.event_end_date) : start;
                          start.setHours(0, 0, 0, 0);
                          end.setHours(0, 0, 0, 0);
                          const day_ = new Date(year, month, day);
                          return day_ >= start && day_ <= end;
                        });
                        const hasApp = eventsOnDay.some((ev) => applications.find((a) => a.event_id === ev.id));
                        const isToday = date.toDateString() === new Date().toDateString();
                        cells.push(
                          <div key={day} className={`relative min-h-[52px] rounded-xl p-1.5 transition ${isToday ? "border border-[#FF5A1F]/40 bg-[#FF5A1F]/5" : "hover:bg-zinc-50"}`}>
                            <p className={`text-xs font-bold ${isToday ? "text-[#FF5A1F]" : "text-zinc-500"}`}>{day}</p>
                            {eventsOnDay.map((ev) => {
                              const app = applications.find((a) => a.event_id === ev.id);
                              return (
                                <Link
                                  key={ev.id}
                                  href={`/events/${ev.slug}`}
                                  className={`mt-0.5 block truncate rounded px-1 py-0.5 text-[10px] font-bold leading-tight ${
                                    app?.status === "accepted" ? "bg-green-100 text-green-700" :
                                    app?.status === "rejected" ? "bg-red-100 text-red-700" :
                                    app ? "bg-yellow-100 text-yellow-700" :
                                    "bg-[#FF5A1F]/20 text-[#FF5A1F]"
                                  }`}
                                  title={ev.title}
                                >
                                  {ev.title}
                                </Link>
                              );
                            })}
                          </div>
                        );
                      }
                      return cells;
                    })()}
                  </div>
                  </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-[#FF5A1F]/40" /> Événement disponible</span>
                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-yellow-200" /> En attente</span>
                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-green-200" /> Accepté</span>
                  </div>
                </div>
              )}

              {/* Résultats — vue grille */}
              {viewMode === "grid" && (loading ? (
                <div className="grid gap-6 lg:grid-cols-2">
                  {[1, 2, 3, 4].map((i) => <SkeletonEventCard key={i} />)}
                </div>
              ) : filtered.length === 0 ? (
                <div className="rounded-[32px] border border-dashed border-zinc-300 p-16 text-center">
                  <h2 className="text-3xl font-black text-zinc-900">Aucun événement trouvé</h2>
                  <p className="mt-4 text-zinc-500">Modifiez vos filtres ou revenez plus tard.</p>
                </div>
              ) : (
                <div className="grid gap-6 lg:grid-cols-2">
                  {filtered.map((event) => {
                    const app = applications.find((a) => a.event_id === event.id);
                    const accepted = acceptedCounts[event.id] || 0;
                    const remaining = Math.max(0, (event.marshals_needed || 0) - accepted);

                    return (
                      <div
                        key={event.id}
                        className="overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-sm transition hover:border-zinc-300"
                      >
                        <div className="relative h-[200px]">
                          <img
                            src={
                              event.image_url ||
                              "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop"
                            }
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                          <div className="absolute bottom-4 left-4 flex gap-2">
                            {event.discipline && (
                              <span className="rounded-full bg-[#FF5A1F] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-white">
                                {event.discipline}
                              </span>
                            )}
                            {app && (
                              <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.1em] ${
                                app.status === "accepted" ? "bg-green-500/80 text-white" :
                                app.status === "rejected" ? "bg-red-500/80 text-white" :
                                "bg-yellow-500/80 text-black"
                              }`}>
                                {app.status === "accepted" ? "Accepté" : app.status === "rejected" ? "Refusé" : "En attente"}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-6">
                          <h2 className="text-2xl font-black text-zinc-900 lg:text-3xl">{event.title}</h2>

                          <div className="mt-4 space-y-2 text-sm text-zinc-600">
                            <div className="flex items-center gap-2">
                              <CalendarDays size={16} className="text-[#FF5A1F]" />
                              <span>{formatDateRange(event.event_date, event.event_end_date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin size={16} className="text-[#FF5A1F]" />
                              <span>{event.location || "Lieu non renseigné"}{event.country ? `, ${event.country}` : ""}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users size={16} className="text-[#FF5A1F]" />
                              <span>{remaining} place{remaining !== 1 ? "s" : ""} disponible{remaining !== 1 ? "s" : ""} / {event.marshals_needed || 0}</span>
                            </div>
                          </div>

                          <div className="mt-6 flex gap-3">
                            <Link
                              href={`/events/${event.slug}`}
                              className="flex h-12 flex-1 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-sm font-bold text-zinc-700 transition hover:border-[#FF5A1F]/40"
                            >
                              Voir détails
                            </Link>

                            {!app ? (
                              <button
                                onClick={() => applyToEvent(event.id, event.discipline)}
                                className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-[#FF5A1F] text-sm font-bold text-white transition hover:scale-[1.01]"
                              >
                                Postuler
                              </button>
                            ) : (
                              <div className={`flex h-12 flex-1 items-center justify-center rounded-2xl text-sm font-bold ${
                                app.status === "accepted" ? "bg-green-100 text-green-700" :
                                app.status === "rejected" ? "bg-red-100 text-red-700" :
                                "bg-yellow-100 text-yellow-700"
                              }`}>
                                {app.status === "accepted" ? "✓ Accepté" : app.status === "rejected" ? "✗ Refusé" : "⏳ En attente"}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

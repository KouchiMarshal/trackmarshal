"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { supabase } from "@/lib/supabase";
import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import NotificationBell from "@/components/notifications/notification-bell";

export default function DisponibilitesPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [availableDates, setAvailableDates] = useState<Set<string>>(new Set());
  const [toggling, setToggling] = useState<Set<string>>(new Set());
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [month, setMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) { router.push("/login"); return; }
    setUserId(session.user.id);
    setToken(session.access_token);

    const [{ dates }, { data: apps }] = await Promise.all([
      fetch(`/api/availability?userId=${session.user.id}`).then((r) => r.json()),
      supabase
        .from("applications")
        .select("event_id, events(id, title, slug, event_date, event_end_date)")
        .eq("marshal_id", session.user.id)
        .eq("status", "accepted"),
    ]);

    setAvailableDates(new Set(dates || []));
    const events = (apps || []).map((a: any) => a.events).filter(Boolean);
    const future = events.filter((e: any) => new Date(e.event_end_date || e.event_date) >= new Date());
    setUpcomingEvents(future);
  }

  async function toggleDate(dateStr: string) {
    if (!token) return;
    setToggling((prev) => new Set([...prev, dateStr]));
    try {
      const res = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ date: dateStr }),
      });
      const data = await res.json();
      setAvailableDates((prev) => {
        const next = new Set(prev);
        if (data.action === "added") next.add(dateStr);
        else next.delete(dateStr);
        return next;
      });
    } finally {
      setToggling((prev) => { const next = new Set(prev); next.delete(dateStr); return next; });
    }
  }

  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const monthLabel = month.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  function dateStr(day: number) {
    return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  function eventOnDay(day: number) {
    const d = new Date(year, monthIndex, day);
    return upcomingEvents.filter((e) => {
      const start = new Date(e.event_date);
      const end = new Date(e.event_end_date || e.event_date);
      return d >= new Date(start.getFullYear(), start.getMonth(), start.getDate()) &&
             d <= new Date(end.getFullYear(), end.getMonth(), end.getDate());
    });
  }

  const availableCount = [...availableDates].filter((d) => d.startsWith(`${year}-${String(monthIndex + 1).padStart(2, "0")}`)).length;

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="flex min-h-screen">
        <DashboardSidebar />

        <div className="flex-1">
          <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white">
            <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-10">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Dashboard Commissaire</p>
                <h1 className="mt-2 text-2xl font-black text-zinc-900 lg:text-4xl">Mes disponibilités</h1>
              </div>
              <NotificationBell />
            </div>
          </header>

          <div className="mx-auto max-w-[1200px] p-4 pb-24 sm:p-6 lg:p-10 lg:pb-10">

            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
              <Info size={16} className="mt-0.5 shrink-0" />
              <p>Cliquez sur les jours où vous êtes disponible. Les organisateurs pourront voir votre disponibilité pour leurs événements. Vos disponibilités sont publiques pour les organisateurs.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

              {/* Calendar */}
              <div className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <button
                    onClick={() => setMonth((m) => { const d = new Date(m); d.setMonth(d.getMonth() - 1); return d; })}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-300 text-zinc-600 hover:text-[#FF5A1F] transition"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div className="text-center">
                    <h2 className="text-xl font-black capitalize text-zinc-900">{monthLabel}</h2>
                    <p className="text-xs text-zinc-400 mt-0.5">{availableCount} jour{availableCount !== 1 ? "s" : ""} disponible{availableCount !== 1 ? "s" : ""}</p>
                  </div>
                  <button
                    onClick={() => setMonth((m) => { const d = new Date(m); d.setMonth(d.getMonth() + 1); return d; })}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-300 text-zinc-600 hover:text-[#FF5A1F] transition"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
                    <div key={d} className="py-2 text-center text-[10px] font-bold uppercase tracking-widest text-zinc-400">{d}</div>
                  ))}

                  {cells.map((day, i) => {
                    if (!day) return <div key={i} />;
                    const ds = dateStr(day);
                    const isAvailable = availableDates.has(ds);
                    const isToday = ds === todayStr;
                    const isPast = new Date(ds) < new Date(todayStr);
                    const eventDays = eventOnDay(day);
                    const isToggling = toggling.has(ds);

                    return (
                      <button
                        key={i}
                        onClick={() => !isPast && toggleDate(ds)}
                        disabled={isPast || isToggling}
                        className={`relative flex aspect-square flex-col items-center justify-center rounded-2xl border-2 text-sm font-bold transition
                          ${isPast
                            ? "cursor-not-allowed border-transparent bg-zinc-50 text-zinc-300"
                            : isAvailable
                              ? "border-green-400 bg-green-50 text-green-700 hover:border-green-500 hover:bg-green-100"
                              : "border-zinc-200 bg-white text-zinc-700 hover:border-[#FF5A1F]/40 hover:bg-orange-50"
                          }
                          ${isToday && !isAvailable && !isPast ? "border-[#FF5A1F]/50 ring-1 ring-[#FF5A1F]/20" : ""}
                          ${isToggling ? "opacity-50" : ""}
                        `}
                      >
                        <span className={`text-sm font-black ${isToday && !isAvailable && !isPast ? "text-[#FF5A1F]" : ""}`}>{day}</span>
                        {isAvailable && <span className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-green-500" />}
                        {eventDays.length > 0 && (
                          <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-[#FF5A1F]" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 flex flex-wrap gap-4 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded border-2 border-green-400 bg-green-50" />
                    Disponible
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded border-2 border-zinc-200 bg-white" />
                    Non renseigné
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#FF5A1F]" />
                    Mission prévue
                  </div>
                </div>
              </div>

              {/* Sidebar: upcoming events */}
              <div className="space-y-4">
                <div className="rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm">
                  <h3 className="font-black text-zinc-900">Mes prochaines missions</h3>
                  {upcomingEvents.length === 0 ? (
                    <p className="mt-3 text-sm text-zinc-400">Aucune mission à venir.</p>
                  ) : (
                    <div className="mt-3 space-y-3">
                      {upcomingEvents.slice(0, 5).map((e) => (
                        <a
                          key={e.id}
                          href={`/events/${e.slug}`}
                          className="block rounded-2xl border border-zinc-100 bg-zinc-50 p-3 transition hover:border-[#FF5A1F]/30"
                        >
                          <p className="text-sm font-black text-zinc-900 line-clamp-1">{e.title}</p>
                          <p className="mt-0.5 text-xs text-[#FF5A1F]">
                            {new Date(e.event_date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                            {e.event_end_date ? ` → ${new Date(e.event_end_date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}` : ""}
                          </p>
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm">
                  <h3 className="font-black text-zinc-900">Astuce</h3>
                  <p className="mt-2 text-sm text-zinc-500">
                    Marquez vos disponibilités à l'avance. Les organisateurs peuvent filtrer les commissaires disponibles sur leurs dates lors du recrutement.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

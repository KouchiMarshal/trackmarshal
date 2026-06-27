"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Eye, MapPin, Plus, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import OrganizerSidebar from "@/components/layout/organizer-sidebar";
import NotificationBell from "@/components/notifications/notification-bell";
import { formatDateRange } from "@/lib/formatDate";

function getEventStatus(event: any): { label: string; color: string } {
  const now = new Date();
  const date = event.event_end_date ? new Date(event.event_end_date) : new Date(event.event_date);
  if (date < now) return { label: "Terminé", color: "bg-zinc-100 text-zinc-600" };
  if ((event.accepted_count || 0) >= (event.marshals_needed || 0))
    return { label: "Complet", color: "bg-green-100 text-green-700" };
  return { label: "Ouvert", color: "bg-[#FF5A1F] text-white" };
}

export default function OrganizerEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "full" | "past">("all");

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data: eventsData } = await supabase
      .from("events")
      .select("*")
      .eq("organizer_id", user.id)
      .order("created_at", { ascending: false });

    if (eventsData && eventsData.length > 0) {
      const ids = eventsData.map((e: any) => e.id);
      const { data: counts } = await supabase
        .from("applications")
        .select("event_id")
        .in("event_id", ids)
        .eq("status", "accepted");

      const countMap: Record<string, number> = {};
      (counts || []).forEach((a: any) => {
        countMap[a.event_id] = (countMap[a.event_id] || 0) + 1;
      });
      setEvents(eventsData.map((e: any) => ({ ...e, accepted_count: countMap[e.id] || 0 })));
    } else {
      setEvents(eventsData || []);
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">

      <div className="flex min-h-screen">

        <OrganizerSidebar />

        <div className="flex-1">

          <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white">
            <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-10">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">
                  Dashboard Organisateur
                </p>
                <h1 className="mt-2 text-2xl font-black text-zinc-900 lg:text-4xl">
                  Mes événements
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <NotificationBell />
                <Link
                  href="/organizer/events/create"
                  className="flex h-14 items-center gap-3 rounded-2xl bg-[#FF5A1F] px-8 font-bold text-white transition hover:scale-[1.02]"
                >
                  <Plus size={20} />
                  <span className="hidden sm:inline">Créer un événement</span>
                  <span className="sm:hidden">Créer</span>
                </Link>
              </div>
            </div>
          </header>

          <div className="relative z-10 mx-auto max-w-[1600px] p-4 pb-24 sm:p-6 lg:p-10 lg:pb-10">

            {loading && (
              <div className="mt-12 text-zinc-500">Chargement...</div>
            )}

            {!loading && events.length === 0 && (
              <div className="mt-12 rounded-[36px] border border-dashed border-zinc-300 p-16 text-center">
                <h2 className="text-4xl font-black text-zinc-900">Aucun événement</h2>
                <p className="mt-4 text-zinc-500">
                  Créez votre premier événement TrackMarshal.
                </p>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              {(["all", "open", "full", "past"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                    statusFilter === s ? "bg-[#FF5A1F] text-white" : "border border-zinc-200 bg-white text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  {s === "all" ? "Tous" : s === "open" ? "Ouverts" : s === "full" ? "Complets" : "Terminés"}
                </button>
              ))}
            </div>

            <div className="mt-6 grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
              {events.filter((event) => {
                if (statusFilter === "all") return true;
                const status = getEventStatus(event).label;
                if (statusFilter === "open") return status === "Ouvert";
                if (statusFilter === "full") return status === "Complet";
                if (statusFilter === "past") return status === "Terminé";
                return true;
              }).map((event) => (
                <div
                  key={event.id}
                  className="overflow-hidden rounded-[36px] border border-zinc-200 bg-white shadow-sm"
                >
                  <div className="relative h-[240px]">
                    <img
                      src={
                        event.image_url ||
                        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop"
                      }
                      alt={event.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute bottom-6 left-6 flex gap-2">
                      <div className="rounded-full bg-[#FF5A1F] px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-white">
                        {event.discipline}
                      </div>
                      <div className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.15em] ${getEventStatus(event).color}`}>
                        {getEventStatus(event).label}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h2 className="text-3xl font-black text-zinc-900">{event.title}</h2>
                    <div className="mt-5 space-y-3 text-zinc-600">
                      <div className="flex items-center gap-3">
                        <CalendarDays size={16} />
                        {formatDateRange(event.event_date, event.event_end_date)}
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin size={16} />
                        {event.location}, {event.country}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-zinc-600">
                            <Users size={16} />
                            <span>{event.accepted_count || 0} / {event.marshals_needed} commissaires</span>
                          </div>
                          {(() => {
                            const remaining = Math.max(0, (event.marshals_needed || 0) - (event.accepted_count || 0));
                            return remaining > 0 ? (
                              <span className="text-xs font-bold text-[#FF5A1F]">{remaining} place{remaining > 1 ? "s" : ""} restante{remaining > 1 ? "s" : ""}</span>
                            ) : null;
                          })()}
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-zinc-100">
                          <div
                            className="h-1.5 rounded-full bg-[#FF5A1F] transition-all"
                            style={{ width: `${Math.min(100, Math.round(((event.accepted_count || 0) / (event.marshals_needed || 1)) * 100))}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-8">
                      <Link
                        href={`/organizer/events/${event.id}`}
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#FF5A1F] font-bold text-white transition hover:scale-[1.01]"
                      >
                        <Eye size={18} />
                        Gérer
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

    </main>
  );
}

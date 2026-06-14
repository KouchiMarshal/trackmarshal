"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Eye, MapPin, Plus, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import OrganizerSidebar from "@/components/layout/organizer-sidebar";
import { formatDate } from "@/lib/formatDate";

export default function OrganizerEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("organizer_id", user.id)
      .order("created_at", { ascending: false });

    setEvents(data || []);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <div className="flex min-h-screen">

        <OrganizerSidebar />

        <div className="flex-1">

          <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur-2xl">
            <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-10">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">
                  Dashboard Organisateur
                </p>
                <h1 className="mt-2 text-2xl font-black lg:text-4xl">
                  Mes événements
                </h1>
              </div>
              <Link
                href="/organizer/events/create"
                className="flex h-14 items-center gap-3 rounded-2xl bg-[#FF5A1F] px-8 font-bold transition hover:scale-[1.02]"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Créer un événement</span>
                <span className="sm:hidden">Créer</span>
              </Link>
            </div>
          </header>

          <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-[#FF5A1F]/10 blur-[180px] pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-[1600px] p-4 pb-24 sm:p-6 lg:p-10 lg:pb-10">

            {loading && (
              <div className="mt-12 text-zinc-500">Chargement...</div>
            )}

            {!loading && events.length === 0 && (
              <div className="mt-12 rounded-[36px] border border-dashed border-white/10 p-16 text-center">
                <h2 className="text-4xl font-black">Aucun événement</h2>
                <p className="mt-4 text-zinc-500">
                  Créez votre premier événement TrackMarshal.
                </p>
              </div>
            )}

            <div className="mt-10 grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.03]"
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
                    <div className="absolute bottom-6 left-6">
                      <div className="rounded-full bg-[#FF5A1F] px-4 py-2 text-xs font-black uppercase tracking-[0.15em]">
                        {event.discipline}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h2 className="text-3xl font-black">{event.title}</h2>
                    <div className="mt-5 space-y-3 text-zinc-400">
                      <div className="flex items-center gap-3">
                        <CalendarDays size={16} />
                        {formatDate(event.event_date)}
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin size={16} />
                        {event.location}, {event.country}
                      </div>
                      <div className="flex items-center gap-3">
                        <Users size={16} />
                        {event.marshals_needed} commissaires
                      </div>
                    </div>
                    <div className="mt-8">
                      <Link
                        href={`/organizer/events/${event.id}`}
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#FF5A1F] font-bold transition hover:scale-[1.01]"
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

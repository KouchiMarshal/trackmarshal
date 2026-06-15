"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Heart, MapPin, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import NotificationBell from "@/components/notifications/notification-bell";
import { formatDate } from "@/lib/formatDate";
import { useFavorites } from "@/hooks/useFavorites";

export default function FavoritesPage() {
  const { favorites, toggle, isFavorite } = useFavorites();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (favorites.length === 0) { setLoading(false); return; }
    supabase
      .from("events")
      .select("*")
      .in("slug", favorites)
      .then(({ data }) => {
        setEvents(data || []);
        setLoading(false);
      });
  }, [favorites.length]);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen">
        <DashboardSidebar />

        <div className="flex-1">
          <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur-2xl">
            <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-10">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Dashboard Commissaire</p>
                <h1 className="mt-2 text-2xl font-black lg:text-4xl">Mes favoris</h1>
              </div>
              <NotificationBell />
            </div>
          </header>

          <div className="mx-auto max-w-[1600px] p-4 pb-24 sm:p-6 lg:p-10 lg:pb-10">
            {loading && (
              <p className="text-zinc-500">Chargement...</p>
            )}

            {!loading && favorites.length === 0 && (
              <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-12 text-center">
                <Heart size={48} className="mx-auto mb-6 text-zinc-700" />
                <h2 className="text-3xl font-black">Aucun favori</h2>
                <p className="mt-4 text-zinc-500">
                  Ajoutez des événements à vos favoris depuis la liste des événements.
                </p>
                <Link
                  href="/events"
                  className="mt-8 inline-flex h-14 items-center rounded-2xl bg-[#FF5A1F] px-8 font-black transition hover:scale-[1.01]"
                >
                  Voir les événements
                </Link>
              </div>
            )}

            <div className="grid gap-6 xl:grid-cols-2">
              {events.map((event) => (
                <div
                  key={event.slug}
                  className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-xl transition hover:border-[#FF5A1F]/30"
                >
                  <div className="relative h-[220px]">
                    <img
                      src={event.image_url || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop"}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <button
                      onClick={() => toggle(event.slug)}
                      className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition hover:scale-110"
                    >
                      <Heart size={18} className={isFavorite(event.slug) ? "fill-[#FF5A1F] text-[#FF5A1F]" : "text-white"} />
                    </button>
                  </div>

                  <div className="p-6">
                    <h2 className="text-2xl font-black lg:text-3xl">{event.title}</h2>
                    <div className="mt-4 space-y-3 text-zinc-300">
                      <div className="flex items-center gap-3"><MapPin size={16} /><p>{event.location}</p></div>
                      <div className="flex items-center gap-3"><CalendarDays size={16} /><p>{formatDate(event.event_date)}</p></div>
                      <div className="flex items-center gap-3"><Users size={16} /><p>{event.marshals_needed || 0} commissaires recherchés</p></div>
                    </div>
                    <Link
                      href={`/events/${event.slug}`}
                      className="mt-6 flex h-12 items-center justify-center rounded-2xl bg-[#FF5A1F] font-bold transition hover:scale-[1.01]"
                    >
                      Voir l'événement
                    </Link>
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

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Home, LogOut, MapPin, Plus, Users, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function OrganizerEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
  }

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
      .order("created_at", {
        ascending: false,
      });

    setEvents(data || []);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur-2xl lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-black">Track<span className="text-[#FF5A1F]">Marshal</span></Link>
          <Link href="/organizer/events/create" className="flex items-center gap-2 rounded-xl bg-[#FF5A1F] px-4 py-2 text-sm font-bold">
            <Plus size={16} /> Créer
          </Link>
        </div>
      </header>

      <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-[#FF5A1F]/10 blur-[180px]" />

      <div className="relative z-10 mx-auto max-w-[1700px] p-6 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#FF5A1F]">
              Dashboard Organisateur
            </p>

            <h1 className="mt-4 text-5xl font-black lg:text-7xl">
              Mes événements
            </h1>
          </div>

          <Link
            href="/organizer/events/create"
            className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-[#FF5A1F] px-8 font-bold transition hover:scale-[1.02]"
          >
            <Plus size={20} />
            Créer un événement
          </Link>
        </div>

        {loading && (
          <div className="mt-12 text-zinc-500">
            Chargement...
          </div>
        )}

        {!loading && events.length === 0 && (
          <div className="mt-12 rounded-[36px] border border-dashed border-white/10 p-16 text-center">
            <h2 className="text-4xl font-black">
              Aucun événement
            </h2>

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
                <h2 className="text-3xl font-black">
                  {event.title}
                </h2>

                <div className="mt-5 space-y-3 text-zinc-400">
                  <div className="flex items-center gap-3">
                    <CalendarDays size={16} />
                    {event.event_date}
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

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/90 backdrop-blur-2xl lg:hidden">
        <div className="grid grid-cols-3">
          {[
            { icon: Home, label: "Dashboard", href: "/organizer/dashboard" },
            { icon: CalendarDays, label: "Événements", href: "/organizer/events" },
            { icon: Plus, label: "Créer", href: "/organizer/events/create" },
          ].map((item) => (
            <Link href={item.href} key={item.label} className="flex flex-col items-center gap-2 py-4 text-zinc-400 transition hover:text-[#FF5A1F]">
              <item.icon size={20} />
              <span className="text-xs font-semibold">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

    </main>
  );
}
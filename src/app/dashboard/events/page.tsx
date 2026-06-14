"use client";

import {
  CalendarDays,
  FileBadge2,
  Home,
  LogOut,
  MapPin,
  MessageSquare,
  Settings,
  User,
  Users,
} from "lucide-react";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function DashboardEventsPage() {
  const router = useRouter();

  const [events, setEvents] =
    useState<any[]>([]);

  const [applications, setApplications] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: eventsData } =
      await supabase
        .from("events")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    const {
      data: applicationsData,
    } = await supabase
      .from("applications")
      .select("*")
      .eq("marshal_id", user.id);

    setEvents(eventsData || []);
    setApplications(
      applicationsData || []
    );

    setLoading(false);
  }

  async function applyToEvent(
    eventId: string
  ) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const alreadyApplied =
      applications.find(
        (app) =>
          app.event_id === eventId
      );

    if (alreadyApplied) {
      alert(
        "Vous avez déjà postulé."
      );
      return;
    }

    const { error } =
      await supabase
        .from("applications")
        .insert({
          marshal_id: user.id,
          event_id: eventId,
          status: "pending",
        });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Candidature envoyée.");
    loadData();
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <div className="flex min-h-screen">

        <aside className="hidden w-[280px] border-r border-white/10 bg-[#050505] lg:flex lg:flex-col">
          <div className="border-b border-white/10 p-8">
            <Link href="/" className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF5A1F]/10">
                <div className="h-4 w-4 rounded-full bg-[#FF5A1F]" />
              </div>
              <h1 className="text-3xl font-black">Track<span className="text-[#FF5A1F]">Marshal</span></h1>
            </Link>
          </div>
          <div className="flex-1 p-6">
            <nav className="space-y-3">
              {[
                { icon: Home, label: "Dashboard", href: "/dashboard" },
                { icon: CalendarDays, label: "Événements", href: "/dashboard/events", active: true },
                { icon: FileBadge2, label: "Mes candidatures", href: "/dashboard/applications" },
                { icon: MessageSquare, label: "Messages", href: "/dashboard/messages" },
                { icon: User, label: "Mon profil", href: "/dashboard/profile" },
                { icon: Settings, label: "Paramètres", href: "/dashboard/settings" },
              ].map((item) => (
                <Link key={item.label} href={item.href} className={`flex h-14 items-center gap-4 rounded-2xl px-5 transition ${"active" in item && item.active ? "bg-[#FF5A1F] text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`}>
                  <item.icon size={20} />
                  <span className="font-semibold">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="border-t border-white/10 p-6">
            <button onClick={logout} className="flex h-14 w-full items-center gap-4 rounded-2xl px-5 text-zinc-400 transition hover:bg-white/5 hover:text-white">
              <LogOut size={20} />
              <span className="font-semibold">Déconnexion</span>
            </button>
          </div>
        </aside>

        <div className="flex-1">
          <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur-2xl">
            <div className="mx-auto flex h-20 max-w-[1600px] items-center px-4 sm:px-6 lg:px-10">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Dashboard Commissaire</p>
                <h1 className="mt-2 text-2xl font-black lg:text-4xl">Événements disponibles</h1>
              </div>
            </div>
          </header>

      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-[#FF5A1F]/10 blur-[140px]" />

        <div className="relative z-10 mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-10">
          <div className="mb-10">
            <p className="mt-3 max-w-2xl text-lg text-zinc-400">
              Découvrez les événements ouverts
              et postulez directement depuis la plateforme.
            </p>
          </div>

          {loading && (
            <div className="py-20 text-center text-zinc-500">
              Chargement...
            </div>
          )}

          <div className="grid gap-6 xl:grid-cols-2">
            {events.map((event) => {
              const alreadyApplied =
                applications.find(
                  (app) =>
                    app.event_id ===
                    event.id
                );

              return (
                <div
                  key={event.id}
                  className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-xl"
                >
                  <div className="relative h-[240px]">
                    <img
                      src={
                        event.image_url ||
                        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop"
                      }
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                    <div className="absolute bottom-0 left-0 p-6">
                      <div className="rounded-full bg-[#FF5A1F] px-4 py-2 text-xs font-black uppercase tracking-[0.15em]">
                        Recrutement ouvert
                      </div>

                      <h2 className="mt-5 text-4xl font-black leading-none">
                        {event.title}
                      </h2>
                    </div>
                  </div>

                  <div className="p-6 lg:p-8">
                    <div className="space-y-4 text-zinc-300">
                      <div className="flex items-center gap-3">
                        <CalendarDays size={18} />

                        <p>
                          {event.event_date ||
                            "Date non renseignée"}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <MapPin size={18} />

                        <p>
                          {event.location ||
                            "Lieu non renseigné"}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <Users size={18} />

                        <p>
                          {event.marshals_needed ||
                            0}{" "}
                          commissaires recherchés
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                      <Link
                        href={`/events/${event.slug}`}
                        className="flex h-14 flex-1 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 font-bold transition hover:border-[#FF5A1F]/40"
                      >
                        Voir détails
                      </Link>

                      <button
                        onClick={() =>
                          applyToEvent(
                            event.id
                          )
                        }
                        disabled={
                          !!alreadyApplied
                        }
                        className={`flex h-14 flex-1 items-center justify-center rounded-2xl px-6 font-bold transition ${
                          alreadyApplied
                            ? "bg-green-500/20 text-green-400"
                            : "bg-[#FF5A1F] hover:scale-[1.01]"
                        }`}
                      >
                        {alreadyApplied
                          ? "Candidature envoyée"
                          : "Postuler"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

        </div>

      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/90 backdrop-blur-2xl lg:hidden">
        <div className="grid grid-cols-4">
          {[
            { icon: Home, label: "Accueil", href: "/dashboard" },
            { icon: CalendarDays, label: "Events", href: "/dashboard/events" },
            { icon: MessageSquare, label: "Messages", href: "/dashboard/messages" },
            { icon: User, label: "Profil", href: "/dashboard/profile" },
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
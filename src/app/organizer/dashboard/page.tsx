"use client";

import {
  CalendarDays,
  CheckCircle2,
  FileBadge2,
  Home,
  LogOut,
  Plus,
  Settings,
  Users,
} from "lucide-react";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function OrganizerDashboard() {

  const router = useRouter();

  const [events, setEvents] =
    useState<any[]>([]);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  const [applications, setApplications] =
    useState<any[]>([]);

  const [profile, setProfile] =
    useState<any>(null);

  useEffect(() => {

    loadDashboard();

  }, []);

  async function loadDashboard() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: profileData } =
      await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    setProfile(profileData);

    const { data: eventsData } =
      await supabase
        .from("events")
        .select("*")
        .eq("organizer_id", user.id)
        .order("created_at", {
          ascending: false,
        });

    setEvents(eventsData || []);

    const eventIds =
      eventsData?.map(
        (event) => event.id
      ) || [];

    if (eventIds.length > 0) {

      const {
        data: applicationsData,
      } = await supabase
        .from("applications")
        .select(`
          *,
          events (*),
          profiles (*)
        `)
        .in("event_id", eventIds);

      setApplications(
        applicationsData || []
      );
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <div className="flex min-h-screen">

        <aside className="hidden w-[280px] border-r border-white/10 bg-[#050505] lg:flex lg:flex-col">

          <div className="border-b border-white/10 p-8">

            <Link
              href="/"
              className="flex items-center gap-4"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF5A1F]/10">

                <div className="h-4 w-4 rounded-full bg-[#FF5A1F]" />

              </div>

              <h1 className="text-3xl font-black">

                Track
                <span className="text-[#FF5A1F]">

                  Marshal

                </span>

              </h1>

            </Link>

          </div>

          <div className="flex-1 p-6">

            <nav className="space-y-3">

              {[
                { icon: Home, label: "Dashboard", href: "/organizer/dashboard", active: true },
                { icon: CalendarDays, label: "Mes événements", href: "/organizer/events" },
                { icon: FileBadge2, label: "Candidatures", href: "/organizer/applications" },
                { icon: Settings, label: "Paramètres", href: "/dashboard/settings" },
              ].map((item) => (

                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex h-14 items-center gap-4 rounded-2xl px-5 transition ${
                    item.active
                      ? "bg-[#FF5A1F] text-white"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >

                  <item.icon size={20} />

                  <span className="font-semibold">

                    {item.label}

                  </span>

                </Link>

              ))}

            </nav>

          <div className="border-t border-white/10 p-6">
            <button onClick={logout} className="flex h-14 w-full items-center gap-4 rounded-2xl px-5 text-zinc-400 transition hover:bg-white/5 hover:text-white">
              <LogOut size={20} />
              <span className="font-semibold">Déconnexion</span>
            </button>
          </div>

        </aside>

        <div className="flex-1">

          <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur-2xl">

            <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-10">

              <div>

                <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">

                  Dashboard Organisateur

                </p>

                <h1 className="mt-2 text-2xl font-black lg:text-4xl">

                  Bonjour {
                    profile?.full_name ||
                    "Organisateur"
                  } 👋

                </h1>

              </div>

              <Link
                href="/organizer/events/create"
                className="hidden h-14 items-center gap-3 rounded-2xl bg-[#FF5A1F] px-8 font-bold transition hover:scale-105 lg:flex"
              >

                <Plus size={20} />

                Créer un événement

              </Link>

            </div>

          </header>

          <div className="relative overflow-hidden">

            <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-[#FF5A1F]/10 blur-[140px]" />

            <div className="relative z-10 mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-10">

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">

                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">

                    Événements créés

                  </p>

                  <h2 className="mt-6 text-5xl font-black">

                    {events.length}

                  </h2>

                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">

                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">

                    Candidatures reçues

                  </p>

                  <h2 className="mt-6 text-5xl font-black">

                    {
                      applications.length
                    }

                  </h2>

                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">

                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">

                    Commissaires

                  </p>

                  <h2 className="mt-6 text-5xl font-black">

                    {
                      applications.filter(
                        (
                          app
                        ) =>
                          app.status ===
                          "accepted"
                      ).length
                    }

                  </h2>

                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">

                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">

                    Validation

                  </p>

                  <h2 className="mt-6 text-3xl font-black text-green-400">

                    Active

                  </h2>

                </div>

              </div>

              <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">

                <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 lg:p-8">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">

                        Derniers événements

                      </p>

                      <h2 className="mt-3 text-3xl font-black">

                        Gestion événements

                      </h2>

                    </div>

                    <Link
                      href="/organizer/events"
                      className="text-sm font-bold text-[#FF5A1F]"
                    >

                      Voir tout

                    </Link>

                  </div>

                  <div className="mt-8 space-y-5">

                    {events.map((event) => (

                      <div
                        key={event.id}
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-5"
                      >

                        <div>

                          <h3 className="text-xl font-bold">

                            {event.title}

                          </h3>

                          <p className="mt-2 text-sm text-zinc-500">

                            {
                              event.location
                            }

                          </p>

                        </div>

                        <Link
                          href={`/organizer/events/${event.id}`}
                          className="rounded-2xl bg-[#FF5A1F] px-5 py-3 text-sm font-bold transition hover:scale-105"
                        >

                          Gérer

                        </Link>

                      </div>

                    ))}

                  </div>

                </div>

                <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 lg:p-8">

                  <div className="flex items-center gap-4">

                    <Users
                      size={28}
                      className="text-[#FF5A1F]"
                    />

                    <div>

                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">

                        Dernières candidatures

                      </p>

                      <h2 className="mt-2 text-3xl font-black">

                        Commissaires

                      </h2>

                    </div>

                  </div>

                  <div className="mt-8 space-y-4">

                    {applications
                      .slice(0, 5)
                      .map((app) => (

                        <div
                          key={app.id}
                          className="rounded-2xl border border-white/10 bg-black/30 p-5"
                        >

                          <div className="flex items-center justify-between">

                            <div>

                              <h3 className="text-lg font-bold">

                                {
                                  app
                                    .profiles
                                    ?.full_name
                                }

                              </h3>

                              <p className="mt-1 text-sm text-zinc-500">

                                {
                                  app
                                    .events
                                    ?.title
                                }

                              </p>

                            </div>

                            <div
                              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] ${
                                app.status ===
                                "accepted"
                                  ? "bg-green-500/20 text-green-400"
                                  : app.status ===
                                    "rejected"
                                  ? "bg-red-500/20 text-red-400"
                                  : "bg-yellow-500/20 text-yellow-400"
                              }`}
                            >

                              {
                                app.status
                              }

                            </div>

                          </div>

                        </div>

                      ))}

                  </div>

                </div>

              </div>

            </div>

          </div>

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
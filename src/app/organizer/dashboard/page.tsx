"use client";

import {
  Plus,
  Users,
} from "lucide-react";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";
import OrganizerSidebar from "@/components/layout/organizer-sidebar";
import NotificationBell from "@/components/notifications/notification-bell";

export default function OrganizerDashboard() {

  const [events, setEvents] =
    useState<any[]>([]);

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

      const { data: appsData } =
        await supabase
          .from("applications")
          .select("*")
          .in("event_id", eventIds);

      if (appsData && appsData.length > 0) {
        const profileIds = [...new Set(appsData.map((a: any) => a.marshal_id))];

        const { data: profilesData } =
          await supabase
            .from("profiles")
            .select("*")
            .in("id", profileIds);

        const profilesMap: Record<string, any> = {};
        (profilesData || []).forEach((p: any) => { profilesMap[p.id] = p; });

        const eventsMap: Record<string, any> = {};
        (eventsData || []).forEach((e: any) => { eventsMap[e.id] = e; });

        const merged = appsData.map((a: any) => ({
          ...a,
          events: eventsMap[a.event_id] || null,
          profiles: profilesMap[a.marshal_id] || null,
        }));

        setApplications(merged);
      } else {
        setApplications([]);
      }
    }
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

                  Bonjour {
                    profile?.full_name ||
                    "Organisateur"
                  } 👋

                </h1>

              </div>

              <div className="flex items-center gap-3">
                <NotificationBell />
                <Link
                  href="/organizer/events/create"
                  className="hidden h-14 items-center gap-3 rounded-2xl bg-[#FF5A1F] px-8 font-bold transition hover:scale-105 lg:flex"
                >
                  <Plus size={20} />
                  Créer un événement
                </Link>
              </div>

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

                              {app.status === "accepted"
                                ? "Accepté"
                                : app.status === "rejected"
                                ? "Refusé"
                                : "En attente"}

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

    </main>
  );
}
"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileBadge2,
  Home,
  LogOut,
  MessageSquare,
  Settings,
  User,
} from "lucide-react";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function DashboardPage() {

  const router = useRouter();

  const [profile, setProfile] =
    useState<any>(null);

  const [applications, setApplications] =
    useState<any[]>([]);

  const [events, setEvents] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {

      router.push("/login");

      return;
    }

   const { data: profileData } =
  await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

if (
  profileData?.role ===
  "organizer"
) {

  router.push(
    "/organizer/dashboard"
  );

  return;
}

setProfile(profileData);

    const {
      data: applicationsData,
    } = await supabase
      .from("applications")
      .select(`
        *,
        events (*)
      `)
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    setApplications(
      applicationsData || []
    );

    const upcomingEvents =
      applicationsData
        ?.filter(
          (app: any) =>
            app.status === "accepted"
        )
        .map((app: any) => app.events) || [];

    setEvents(upcomingEvents);

    setLoading(false);
  }

  async function logout() {

    await supabase.auth.signOut();

    router.push("/");
  }

  if (loading) {

    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">

        <p className="text-xl text-zinc-400">

          Chargement du dashboard...

        </p>

      </main>
    );
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
                {
                  icon: Home,
                  label: "Dashboard",
                  href: "/dashboard",
                  active: true,
                },
                {
                  icon: CalendarDays,
                  label: "Événements",
                  href: "/dashboard/events",
                },
                {
                  icon: FileBadge2,
                  label: "Mes candidatures",
                  href: "/dashboard/applications",
                },
                {
                  icon: MessageSquare,
                  label: "Messages",
                  href: "/dashboard/messages",
                },
                {
                  icon: User,
                  label: "Mon profil",
                  href: "/dashboard/profile",
                },
                {
                  icon: Settings,
                  label: "Paramètres",
                  href: "/dashboard/settings",
                },
              ].map((item) => (

                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex h-14 w-full items-center gap-4 rounded-2xl px-5 transition ${
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

          </div>

          <div className="border-t border-white/10 p-6">

            <button
              onClick={logout}
              className="flex h-14 w-full items-center gap-4 rounded-2xl px-5 text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >

              <LogOut size={20} />

              <span className="font-semibold">

                Déconnexion

              </span>

            </button>

          </div>

        </aside>

        <div className="flex-1">

          <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur-2xl">

            <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-10">

              <div>

                <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">

                  Dashboard Commissaire

                </p>

                <h1 className="mt-2 text-2xl font-black lg:text-4xl">

                  Bonjour {
                    profile?.full_name ||
                    "Commissaire"
                  } 👋

                </h1>

              </div>

              <Link
                href="/dashboard/profile"
                className="hidden h-14 items-center rounded-2xl bg-[#FF5A1F] px-8 font-bold transition hover:scale-105 lg:flex"
              >

                Modifier mon profil

              </Link>

            </div>

          </header>

          <div className="relative overflow-hidden">

            <div className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-[#FF5A1F]/10 blur-[140px]" />

            <div className="relative z-10 mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-10">

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:p-8">

                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">

                    Candidatures

                  </p>

                  <h2 className="mt-6 text-5xl font-black">

                    {applications.length}

                  </h2>

                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:p-8">

                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">

                    Événements à venir

                  </p>

                  <h2 className="mt-6 text-5xl font-black">

                    {events.length}

                  </h2>

                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:p-8">

                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">

                    Licence

                  </p>

                  <h2 className="mt-6 text-3xl font-black text-green-400">

                    {profile?.license_verified
                      ? "Vérifiée"
                      : "En attente"}

                  </h2>

                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:p-8">

                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">

                    Expérience

                  </p>

                  <h2 className="mt-6 text-3xl font-black text-[#FF5A1F]">

                    {
                      profile?.experience ||
                      "N/A"
                    }

                  </h2>

                </div>

              </div>

              {events.length > 0 && (

                <div className="mt-6 overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03]">

                  <div className="relative h-[260px] lg:h-[340px]">

                    <img
                      src={
                        events[0]?.image_url ||
                        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop"
                      }
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                    <div className="absolute bottom-0 left-0 p-6 lg:p-10">

                      <div className="rounded-full bg-[#FF5A1F] px-4 py-2 text-xs font-black uppercase tracking-[0.15em] w-fit">

                        Événement accepté

                      </div>

                      <h2 className="mt-5 text-4xl font-black leading-none lg:text-6xl">

                        {events[0]?.title}

                      </h2>

                    </div>

                  </div>

                  <div className="p-6 lg:p-10">

                    <div className="space-y-4 text-zinc-300">

                      <div className="flex items-center gap-3">

                        <CalendarDays
                          size={18}
                        />

                        <p>

                          {
                            events[0]?.date ||
                            "Date non renseignée"
                          }

                        </p>

                      </div>

                      <div className="flex items-center gap-3">

                        <Clock3
                          size={18}
                        />

                        <p>

                          {
                            events[0]?.location ||
                            "Lieu non renseigné"
                          }

                        </p>

                      </div>

                    </div>

                    <div className="mt-8">

                      <Link
                        href={`/events/${events[0]?.id}`}
                        className="flex h-14 w-fit items-center justify-center rounded-2xl bg-[#FF5A1F] px-8 font-bold transition hover:scale-[1.01]"
                      >

                        Voir l’événement

                      </Link>

                    </div>

                  </div>

                </div>

              )}

              <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">

                <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:p-8">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">

                        Mes candidatures

                      </p>

                      <h2 className="mt-3 text-3xl font-black">

                        Récentes

                      </h2>

                    </div>

                  </div>

                  <div className="mt-8 space-y-5">

                    {applications.length === 0 && (

                      <p className="text-zinc-500">

                        Aucune candidature.

                      </p>

                    )}

                    {applications.map(
                      (application) => (

                        <div
                          key={application.id}
                          className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-5"
                        >

                          <div>

                            <h3 className="text-lg font-bold">

                              {
                                application
                                  .events
                                  ?.title
                              }

                            </h3>

                            <p className="mt-2 text-sm text-zinc-500">

                              {
                                application
                                  .events
                                  ?.date
                              }

                            </p>

                          </div>

                          <div
                            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] ${
                              application.status ===
                              "accepted"
                                ? "bg-green-500/20 text-green-400"
                                : application.status ===
                                  "rejected"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >

                            {
                              application.status
                            }

                          </div>

                        </div>

                      )
                    )}

                  </div>

                </div>

                <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:p-8">

                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">

                    Mon profil

                  </p>

                  <div className="mt-8 flex flex-col gap-6 sm:flex-row">

                    <img
                      src={
                        profile?.avatar_url ||
                        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop"
                      }
                      className="h-40 w-40 rounded-[28px] object-cover"
                    />

                    <div className="flex-1">

                      <h2 className="text-4xl font-black">

                        {
                          profile?.full_name
                        }

                      </h2>

                      <p className="mt-3 text-zinc-400">

                        {
                          profile?.bio ||
                          "Aucune bio"
                        }

                      </p>

                      <div className="mt-6 flex flex-wrap gap-3">

                        {profile?.disciplines
                          ?.split(",")
                          .map(
                            (
                              badge: string
                            ) => (

                              <div
                                key={badge}
                                className="rounded-full border border-[#FF5A1F]/20 bg-[#FF5A1F]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#FF5A1F]"
                              >

                                {badge}

                              </div>

                            )
                          )}

                      </div>

                      <Link
                        href="/dashboard/profile"
                        className="mt-8 flex h-14 w-fit items-center rounded-2xl bg-[#FF5A1F] px-8 font-bold transition hover:scale-[1.01]"
                      >

                        Modifier mon profil

                      </Link>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/90 backdrop-blur-2xl lg:hidden">

        <div className="grid grid-cols-4">

          {[
            {
              icon: Home,
              label: "Accueil",
              href: "/dashboard",
            },
            {
              icon: CalendarDays,
              label: "Events",
              href: "/dashboard/events",
            },
            {
              icon: MessageSquare,
              label: "Messages",
              href: "/dashboard/messages",
            },
            {
              icon: User,
              label: "Profil",
              href: "/dashboard/profile",
            },
          ].map((item) => (

            <Link
              href={item.href}
              key={item.label}
              className="flex flex-col items-center gap-2 py-4 text-zinc-400 transition hover:text-[#FF5A1F]"
            >

              <item.icon size={20} />

              <span className="text-xs font-semibold">

                {item.label}

              </span>

            </Link>

          ))}

        </div>

      </div>

    </main>
  );
}
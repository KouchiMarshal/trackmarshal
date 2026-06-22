"use client";

import { CalendarDays, MapPin } from "lucide-react";

import Link from "next/link";

import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import NotificationBell from "@/components/notifications/notification-bell";
import { formatDateRange } from "@/lib/formatDate";

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

  const [licenses, setLicenses] =
    useState<any[]>([]);

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

const isAdmin = user.email === (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "foussardk@gmail.com");

if (profileData?.role === "organizer" && !isAdmin) {
  router.push("/organizer/dashboard");
  return;
}

setProfile(profileData);

    const { data: licensesData } = await supabase
      .from("licenses")
      .select("id, type, category, verified")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });
    setLicenses(licensesData || []);

    const { data: appsData } =
      await supabase
        .from("applications")
        .select("*")
        .eq("marshal_id", user.id)
        .order("created_at", { ascending: false });

    const applicationsData = appsData || [];

    if (applicationsData.length > 0) {
      const eventIds = [...new Set(applicationsData.map((a: any) => a.event_id))];
      const { data: eventsData } = await supabase
        .from("events")
        .select("*")
        .in("id", eventIds);

      const eventsMap: Record<string, any> = {};
      (eventsData || []).forEach((e: any) => { eventsMap[e.id] = e; });

      const merged = applicationsData.map((a: any) => ({
        ...a,
        events: eventsMap[a.event_id] || null,
      }));

      setApplications(merged);

      const upcomingEvents = merged
        .filter((app: any) => app.status === "accepted")
        .map((app: any) => app.events)
        .filter(Boolean);

      setEvents(upcomingEvents);
    } else {
      setApplications([]);
      setEvents([]);
    }

    setLoading(false);
  }

  if (loading) {

    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 text-zinc-900">

        <p className="text-xl text-zinc-500">

          Chargement du dashboard...

        </p>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">

      <div className="flex min-h-screen">

        <DashboardSidebar />

        <div className="flex-1">

          <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white">

            <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-10">

              <div>

                <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">

                  Dashboard Commissaire

                </p>

                <h1 className="mt-2 text-2xl font-black text-zinc-900 lg:text-4xl">

                  Bonjour {
                    profile?.full_name ||
                    "Commissaire"
                  } 👋

                </h1>

              </div>

              <div className="flex items-center gap-3">
                <NotificationBell />
                <Link
                  href="/dashboard/profile"
                  className="hidden h-14 items-center rounded-2xl bg-[#FF5A1F] px-8 font-bold text-white transition hover:scale-105 lg:flex"
                >
                  Modifier mon profil
                </Link>
              </div>

            </div>

          </header>

          <div className="relative overflow-hidden">

            <div className="relative z-10 mx-auto max-w-[1600px] p-4 pb-24 sm:p-6 lg:p-10 lg:pb-10">

              {(() => {
                const accepted = applications.filter((a: any) => a.status === "accepted").length;
                const pending = applications.filter((a: any) => a.status === "pending").length;
                const acceptRate = applications.length > 0 ? Math.round((accepted / applications.length) * 100) : 0;
                return (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm lg:p-8">
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Candidatures</p>
                      <h2 className="mt-6 text-5xl font-black text-zinc-900">{applications.length}</h2>
                      <p className="mt-2 text-xs text-zinc-500">{accepted} acceptées · {pending} en attente</p>
                    </div>

                    <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm lg:p-8">
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Taux d'acceptation</p>
                      <h2 className={`mt-6 text-5xl font-black ${acceptRate >= 50 ? "text-green-600" : acceptRate > 0 ? "text-yellow-600" : "text-zinc-900"}`}>
                        {acceptRate}%
                      </h2>
                      <p className="mt-2 text-xs text-zinc-500">{accepted} sur {applications.length}</p>
                    </div>

                    <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm lg:p-8">
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Licences</p>
                      {licenses.length === 0 ? (
                        <h2 className="mt-6 text-2xl font-black text-zinc-400">Aucune</h2>
                      ) : (
                        <div className="mt-4 space-y-2">
                          {licenses.map((l: any) => (
                            <div key={l.id} className="flex items-center gap-2">
                              <span className={`h-2 w-2 shrink-0 rounded-full ${l.verified ? "bg-green-500" : "bg-yellow-400"}`} />
                              <p className="truncate text-xs font-semibold text-zinc-700">{l.type || (l.category === "moto" ? "FFM" : "FFSA")}</p>
                              {l.verified && <span className="ml-auto shrink-0 text-[10px] font-bold text-green-600">✔</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm lg:p-8">
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Événements à venir</p>
                      <h2 className="mt-6 text-5xl font-black text-[#FF5A1F]">{events.length}</h2>
                      {profile?.available !== false ? (
                        <p className="mt-2 flex items-center gap-1.5 text-xs text-green-600"><span className="h-2 w-2 rounded-full bg-green-500" />Disponible</p>
                      ) : (
                        <p className="mt-2 flex items-center gap-1.5 text-xs text-red-600"><span className="h-2 w-2 rounded-full bg-red-500" />Indisponible</p>
                      )}
                    </div>

                  </div>
                );
              })()}

              {events.length > 0 && (

                <div className="mt-6 overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-sm">

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

                      <div className="rounded-full bg-[#FF5A1F] px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-white w-fit">

                        Événement accepté

                      </div>

                      <h2 className="mt-5 text-4xl font-black leading-none text-white lg:text-6xl">

                        {events[0]?.title}

                      </h2>

                    </div>

                  </div>

                  <div className="p-6 lg:p-10">

                    <div className="space-y-4 text-zinc-600">

                      <div className="flex items-center gap-3">

                        <CalendarDays
                          size={18}
                        />

                        <p>{formatDateRange(events[0]?.event_date, events[0]?.event_end_date)}</p>

                      </div>

                      <div className="flex items-center gap-3">

                        <MapPin
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
                        href={`/events/${events[0]?.slug}`}
                        className="flex h-14 w-fit items-center justify-center rounded-2xl bg-[#FF5A1F] px-8 font-bold text-white transition hover:scale-[1.01]"
                      >

                        Voir l'événement

                      </Link>

                    </div>

                  </div>

                </div>

              )}

              <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">

                <div className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm lg:p-8">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">

                        Mes candidatures

                      </p>

                      <h2 className="mt-3 text-3xl font-black text-zinc-900">

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
                          className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 p-5"
                        >

                          <div>

                            {application.events?.slug ? (
                              <Link
                                href={`/events/${application.events.slug}`}
                                className="text-lg font-bold text-zinc-900 transition hover:text-[#FF5A1F]"
                              >
                                {application.events?.title}
                              </Link>
                            ) : (
                              <h3 className="text-lg font-bold text-zinc-900">
                                {application.events?.title}
                              </h3>
                            )}

                            <p className="mt-2 text-sm text-zinc-500">
                              {formatDateRange(application.events?.event_date, application.events?.event_end_date)}
                            </p>

                          </div>

                          <div
                            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] ${
                              application.status ===
                              "accepted"
                                ? "bg-green-100 text-green-700"
                                : application.status ===
                                  "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >

                            {application.status === "accepted"
                              ? "Accepté"
                              : application.status === "rejected"
                              ? "Refusé"
                              : "En attente"}

                          </div>

                        </div>

                      )
                    )}

                  </div>

                </div>

                <div className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm lg:p-8">

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

                      <h2 className="text-4xl font-black text-zinc-900">

                        {
                          profile?.full_name
                        }

                      </h2>

                      <p className="mt-3 text-zinc-600">

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
                        className="mt-8 flex h-14 w-fit items-center rounded-2xl bg-[#FF5A1F] px-8 font-bold text-white transition hover:scale-[1.01]"
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

    </main>
  );
}

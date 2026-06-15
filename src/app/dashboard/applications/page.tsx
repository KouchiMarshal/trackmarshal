"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  XCircle,
} from "lucide-react";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";
import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import { formatDate } from "@/lib/formatDate";

export default function ApplicationsPage() {

  const router = useRouter();

  const [applications, setApplications] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [cancelling, setCancelling] =
    useState<string | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {

      router.push("/login");

      return;
    }

    const { data: appsData, error: dbError } =
      await supabase
        .from("applications")
        .select("*")
        .eq("marshal_id", user.id)
        .order("created_at", { ascending: false });

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
      return;
    }

    if (!appsData || appsData.length === 0) {
      setApplications([]);
      setLoading(false);
      return;
    }

    const eventIds = [...new Set(appsData.map((a: any) => a.event_id))];

    const { data: eventsData } =
      await supabase
        .from("events")
        .select("*")
        .in("id", eventIds);

    const eventsMap: Record<string, any> = {};
    (eventsData || []).forEach((e: any) => { eventsMap[e.id] = e; });

    const merged = appsData.map((a: any) => ({
      ...a,
      events: eventsMap[a.event_id] || null,
    }));

    setApplications(merged);

    setLoading(false);
  }

  async function cancelApplication(appId: string, status: string) {
    if (status === "accepted") {
      const confirmed = confirm(
        "Votre candidature a été acceptée. Êtes-vous sûr de vouloir l'annuler ?"
      );
      if (!confirmed) return;
    }

    setCancelling(appId);

    await supabase
      .from("applications")
      .delete()
      .eq("id", appId);

    setApplications((prev) => prev.filter((a) => a.id !== appId));
    setCancelling(null);
  }

  function getStatus(status: string) {

    switch (status) {

      case "accepted":
        return {
          color:
            "bg-green-500/20 text-green-400",
          text:
            "Accepté",
          icon:
            CheckCircle2,
        };

      case "rejected":
        return {
          color:
            "bg-red-500/20 text-red-400",
          text:
            "Refusé",
          icon:
            XCircle,
        };

      default:
        return {
          color:
            "bg-yellow-500/20 text-yellow-400",
          text:
            "En attente",
          icon:
            Clock3,
        };
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <div className="flex min-h-screen">

        <DashboardSidebar />

        <div className="flex-1">

          <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur-2xl">

            <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-10">

              <div>

                <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">

                  Dashboard Commissaire

                </p>

                <h1 className="mt-2 text-2xl font-black lg:text-4xl">

                  Mes candidatures

                </h1>

              </div>

            </div>

          </header>

          <div className="relative overflow-hidden">

            <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-[#FF5A1F]/10 blur-[140px]" />

            <div className="relative z-10 mx-auto max-w-[1600px] p-4 pb-24 sm:p-6 lg:p-10 lg:pb-10">

              {loading && (

                <div className="py-20 text-center text-zinc-500">

                  Chargement...

                </div>

              )}

              {error && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-400">
                  Erreur Supabase : {error}
                </div>
              )}

              {!loading &&
               !error &&
               applications.length === 0 && (

                <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-10 text-center">

                  <h2 className="text-4xl font-black">

                    Aucune candidature

                  </h2>

                  <p className="mt-5 text-zinc-400">

                    Vous n’avez pas encore postulé
                    à un événement.

                  </p>

                </div>

              )}

              <div className="space-y-6">

                {applications.map((app) => {

                  const status =
                    getStatus(app.status);

                  return (

                    <div
                      key={app.id}
                      className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-xl"
                    >

                      <div className="grid lg:grid-cols-[320px_1fr]">

                        <div className="relative h-[240px] lg:h-full">

                          <img
                            src={
                              app.events
                                ?.image_url ||
                              "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop"
                            }
                            className="h-full w-full object-cover"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                        </div>

                        <div className="p-6 lg:p-8">

                          <div
                            className={`w-fit rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.15em] ${status.color}`}
                          >

                            {status.text}

                          </div>

                          <h2 className="mt-6 text-3xl font-black lg:text-5xl">

                            {
                              app.events?.title
                            }

                          </h2>

                          <div className="mt-8 space-y-4 text-zinc-300">

                            <div className="flex items-center gap-3">

                              <CalendarDays
                                size={18}
                              />

                              <p>{formatDate(app.events?.event_date)}</p>

                            </div>

                            <div className="flex items-center gap-3">

                              <MapPin
                                size={18}
                              />

                              <p>

                                {
                                  app.events?.location
                                }

                              </p>

                            </div>

                          </div>

                          <div className="mt-8 flex flex-col gap-4 sm:flex-row">

                            <Link
                              href={`/events/${app.events?.slug}`}
                              className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-8 font-bold transition hover:border-[#FF5A1F]/40"
                            >
                              Voir l’événement
                            </Link>

                            {app.status === "accepted" && (
                              <Link
                                href={`/events/${app.events?.slug}`}
                                className="flex h-14 items-center justify-center rounded-2xl bg-[#FF5A1F] px-8 font-bold transition hover:scale-[1.01]"
                              >
                                Voir briefing
                              </Link>
                            )}

                            {app.status !== "rejected" && (
                              <button
                                onClick={() => cancelApplication(app.id, app.status)}
                                disabled={cancelling === app.id}
                                className="flex h-14 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 px-8 font-bold text-red-400 transition hover:bg-red-500/20 disabled:opacity-60"
                              >
                                {cancelling === app.id ? "Annulation..." : "Annuler"}
                              </button>
                            )}

                          </div>

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

    </main>
  );
}
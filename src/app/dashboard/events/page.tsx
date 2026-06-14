"use client";

import {
  CalendarDays,
  MapPin,
  Users,
} from "lucide-react";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";
import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import { formatDate } from "@/lib/formatDate";
import { Toast, type ToastData } from "@/components/ui/toast";

export default function DashboardEventsPage() {

  const [events, setEvents] =
    useState<any[]>([]);

  const [applications, setApplications] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [toast, setToast] =
    useState<ToastData>(null);

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
      setToast({ message: "Vous avez déjà postulé à cet événement.", type: "error" });
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
      setToast({ message: error.message, type: "error" });
      return;
    }

    setToast({ message: "Candidature envoyée avec succès !", type: "success" });
    loadData();
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="flex min-h-screen">

        <DashboardSidebar />

        <div className="flex-1">

          <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur-2xl">
            <div className="mx-auto flex h-20 max-w-[1600px] items-center px-4 sm:px-6 lg:px-10">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Dashboard Commissaire</p>
                <h1 className="mt-2 text-2xl font-black lg:text-4xl">Événements</h1>
              </div>
            </div>
          </header>

      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-[#FF5A1F]/10 blur-[140px]" />

        <div className="relative z-10 mx-auto max-w-[1600px] p-4 pb-24 sm:p-6 lg:p-10 lg:pb-10">
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

                        <p>{formatDate(event.event_date)}</p>
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

    </main>
  );
}
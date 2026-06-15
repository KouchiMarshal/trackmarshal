"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import OrganizerSidebar from "@/components/layout/organizer-sidebar";
import { formatDate } from "@/lib/formatDate";
import { Toast, type ToastData } from "@/components/ui/toast";

export default function OrganizerApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [toast, setToast] = useState<ToastData>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: eventsData } = await supabase
      .from("events")
      .select("id, title, location, event_date, slug, marshals_needed, image_url")
      .eq("organizer_id", user.id);

    const eventIds = (eventsData || []).map((e: any) => e.id);

    if (eventIds.length === 0) {
      setLoading(false);
      return;
    }

    const { data: appsData } = await supabase
      .from("applications")
      .select("*")
      .in("event_id", eventIds)
      .order("created_at", { ascending: false });

    const appsRaw = appsData || [];

    if (appsRaw.length === 0) {
      setApplications([]);
      setLoading(false);
      return;
    }

    const profileIds = [...new Set(appsRaw.map((a: any) => a.marshal_id))];
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, city, country, experience, years_experience, email, phone")
      .in("id", profileIds);

    const profilesMap: Record<string, any> = {};
    (profilesData || []).forEach((p: any) => { profilesMap[p.id] = p; });

    const eventsMap: Record<string, any> = {};
    (eventsData || []).forEach((e: any) => { eventsMap[e.id] = e; });

    const merged = appsRaw.map((a: any) => ({
      ...a,
      profiles: profilesMap[a.marshal_id] || null,
      events: eventsMap[a.event_id] || null,
    }));

    setApplications(merged);
    setLoading(false);
  }

  async function updateStatus(appId: string, status: "accepted" | "rejected", marshalId: string, eventSlug: string, eventTitle: string, marshalName: string) {
    await supabase.from("applications").update({ status }).eq("id", appId);

    await supabase.from("notifications").insert({
      user_id: marshalId,
      title: status === "accepted"
        ? "Votre candidature a été acceptée"
        : "Votre candidature a été refusée",
      type: status === "accepted" ? "application_accepted" : "application_rejected",
      link: `/events/${eventSlug}`,
    });

    if (status === "accepted") {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        const { data: convData } = await supabase
          .from("conversations")
          .insert({ title: `${eventTitle} — ${marshalName}` })
          .select()
          .single();

        if (convData?.id) {
          await supabase.from("conversation_members").insert([
            { conversation_id: convData.id, user_id: currentUser.id },
            { conversation_id: convData.id, user_id: marshalId },
          ]);
        }
      }
    }

    setToast({
      message: status === "accepted" ? "Candidature acceptée." : "Candidature refusée.",
      type: status === "accepted" ? "success" : "error",
    });

    loadApplications();
  }

  const filtered = applications.filter((a) => filter === "all" || a.status === filter);

  const counts = {
    all: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  return (
    <main className="min-h-screen bg-black text-white">

      <Toast toast={toast} onClose={() => setToast(null)} />

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
                  Candidatures reçues
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-center">
                  <p className="text-xs text-zinc-500">Total</p>
                  <p className="text-2xl font-black">{counts.all}</p>
                </div>
                <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-5 py-3 text-center">
                  <p className="text-xs text-zinc-500">En attente</p>
                  <p className="text-2xl font-black text-yellow-400">{counts.pending}</p>
                </div>
                <div className="hidden rounded-2xl border border-green-500/20 bg-green-500/10 px-5 py-3 text-center sm:block">
                  <p className="text-xs text-zinc-500">Acceptées</p>
                  <p className="text-2xl font-black text-green-400">{counts.accepted}</p>
                </div>
              </div>
            </div>
          </header>

          <div className="relative overflow-hidden">

            <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-[#FF5A1F]/10 blur-[140px] pointer-events-none" />

            <div className="relative z-10 mx-auto max-w-[1600px] p-4 pb-24 sm:p-6 lg:p-10 lg:pb-10">

              <div className="mb-8 flex flex-wrap gap-3">
                {[
                  { key: "all", label: "Toutes", count: counts.all, active: "bg-[#FF5A1F]" },
                  { key: "pending", label: "En attente", count: counts.pending, active: "bg-yellow-600" },
                  { key: "accepted", label: "Acceptées", count: counts.accepted, active: "bg-green-600" },
                  { key: "rejected", label: "Refusées", count: counts.rejected, active: "bg-red-600" },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`flex items-center gap-2 rounded-2xl px-5 py-3 font-bold transition ${
                      filter === f.key ? f.active : "bg-white/[0.05] text-zinc-400 hover:text-white"
                    }`}
                  >
                    {f.label}
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">{f.count}</span>
                  </button>
                ))}
              </div>

              {loading && (
                <div className="py-20 text-center text-zinc-500">Chargement...</div>
              )}

              {!loading && filtered.length === 0 && (
                <div className="rounded-[32px] border border-dashed border-white/10 p-16 text-center">
                  <h2 className="text-3xl font-black">Aucune candidature</h2>
                  <p className="mt-4 text-zinc-500">
                    {filter === "all"
                      ? "Aucun commissaire n'a encore postulé à vos événements."
                      : "Aucune candidature dans cette catégorie."}
                  </p>
                </div>
              )}

              <div className="space-y-5">
                {filtered.map((app) => (
                  <div
                    key={app.id}
                    className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03]"
                  >
                    <div className="grid lg:grid-cols-[280px_1fr]">

                      <div className="relative h-[200px] lg:h-full">
                        <img
                          src={
                            app.events?.image_url ||
                            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop"
                          }
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#FF5A1F]">
                            {app.events?.title}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-xs text-zinc-400">
                            <CalendarDays size={12} />
                            {formatDate(app.events?.event_date)}
                          </div>
                        </div>
                      </div>

                      <div className="p-6 lg:p-8">

                        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">

                          <div className="flex gap-4">
                            <img
                              src={
                                app.profiles?.avatar_url ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(app.profiles?.full_name || "Marshal")}&background=FF5A1F&color=fff`
                              }
                              alt=""
                              className="h-16 w-16 rounded-2xl object-cover"
                            />
                            <div>
                              <h3 className="text-2xl font-black">{app.profiles?.full_name}</h3>
                              <p className="mt-1 text-sm text-zinc-400">
                                📍 {app.profiles?.city || "Ville inconnue"}{app.profiles?.country ? `, ${app.profiles.country}` : ""}
                              </p>
                              <p className="text-sm text-zinc-400">📧 {app.profiles?.email || "—"}</p>
                              {app.profiles?.years_experience && (
                                <p className="mt-2 text-sm text-zinc-300">
                                  ⏳ {app.profiles.years_experience} ans d'expérience
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col items-start gap-3 sm:items-end">
                            <span className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] ${
                              app.status === "accepted"
                                ? "bg-green-500/20 text-green-400"
                                : app.status === "rejected"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}>
                              {app.status === "accepted" ? "Accepté" : app.status === "rejected" ? "Refusé" : "En attente"}
                            </span>

                            <div className="flex gap-3">
                              <button
                                disabled={app.status === "accepted"}
                                onClick={() => updateStatus(app.id, "accepted", app.marshal_id, app.events?.slug, app.events?.title, app.profiles?.full_name)}
                                className={`rounded-2xl px-5 py-3 text-sm font-bold transition ${
                                  app.status === "accepted"
                                    ? "cursor-not-allowed bg-zinc-800 text-zinc-600"
                                    : "bg-green-600 hover:scale-105"
                                }`}
                              >
                                Accepter
                              </button>
                              <button
                                disabled={app.status === "rejected"}
                                onClick={() => updateStatus(app.id, "rejected", app.marshal_id, app.events?.slug, app.events?.title, app.profiles?.full_name)}
                                className={`rounded-2xl px-5 py-3 text-sm font-bold transition ${
                                  app.status === "rejected"
                                    ? "cursor-not-allowed bg-zinc-800 text-zinc-600"
                                    : "bg-red-600 hover:scale-105"
                                }`}
                              >
                                Refuser
                              </button>
                            </div>
                          </div>

                        </div>

                        {app.profiles?.experience && (
                          <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Expérience</p>
                            <p className="mt-2 whitespace-pre-line text-sm text-zinc-300">{app.profiles.experience}</p>
                          </div>
                        )}

                        <div className="mt-4 flex items-center gap-2 text-sm text-zinc-500">
                          <MapPin size={14} />
                          <Link
                            href={`/organizer/events/${app.event_id}`}
                            className="transition hover:text-[#FF5A1F]"
                          >
                            Voir l'événement →
                          </Link>
                        </div>

                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

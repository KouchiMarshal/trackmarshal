"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import OrganizerSidebar from "@/components/layout/organizer-sidebar";
import NotificationBell from "@/components/notifications/notification-bell";
import { formatDateRange } from "@/lib/formatDate";
import { Toast, type ToastData } from "@/components/ui/toast";

export default function OrganizerApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [toast, setToast] = useState<ToastData>(null);
  const [postValues, setPostValues] = useState<Record<string, string>>({});
  const [postSaving, setPostSaving] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadApplications();

    const channel = supabase
      .channel("organizer-applications-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "applications" }, () => {
        loadApplications();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  async function loadApplications() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: eventsData } = await supabase
      .from("events")
      .select("id, title, location, event_date, event_end_date, slug, marshals_needed, image_url")
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

    const initialPostValues: Record<string, string> = {};
    merged.forEach((a: any) => { if (a.post) initialPostValues[a.id] = a.post; });
    setPostValues(initialPostValues);

    setLoading(false);
  }

  async function savePost(appId: string, post: string) {
    setPostSaving(prev => ({ ...prev, [appId]: true }));
    await supabase.from("applications").update({ post: post.trim() || null }).eq("id", appId);
    const app = applications.find(a => a.id === appId);
    if (app && post.trim()) {
      await supabase.from("notifications").insert({
        user_id: app.marshal_id,
        title: `Poste assigné : ${post.trim()}`,
        type: "post_assigned",
        link: `/events/${app.events?.slug}`,
      });
    }
    setPostSaving(prev => ({ ...prev, [appId]: false }));
    setToast({ message: "Poste enregistré.", type: "success" });
    loadApplications();
  }

  async function updateStatus(appId: string, status: "accepted" | "rejected", marshalId: string, eventSlug: string, eventTitle: string, marshalName: string, marshalEmail: string, eventDate: string, eventLocation: string) {
    await supabase.from("applications").update({ status }).eq("id", appId);

    await supabase.from("notifications").insert({
      user_id: marshalId,
      title: status === "accepted"
        ? "Votre candidature a été acceptée"
        : "Votre candidature a été refusée",
      type: status === "accepted" ? "application_accepted" : "application_rejected",
      link: `/events/${eventSlug}`,
    });

    // Envoi de l'email au commissaire
    const { data: { session } } = await supabase.auth.getSession();
    if (session && marshalEmail) {
      await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          to: marshalEmail,
          type: status === "accepted" ? "application_accepted" : "application_rejected",
          data: {
            eventTitle,
            eventDate: formatDateRange(eventDate, undefined),
            eventLocation,
          },
        }),
      });
    }

    if (status === "accepted") {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        // Vérifier si une conversation existe déjà entre cet organisateur et ce commissaire
        const { data: myMemberships } = await supabase
          .from("conversation_members")
          .select("conversation_id")
          .eq("user_id", currentUser.id);

        const myConvIds = (myMemberships || []).map((m: any) => m.conversation_id);
        let alreadyExists = false;

        if (myConvIds.length > 0) {
          const { data: shared } = await supabase
            .from("conversation_members")
            .select("conversation_id")
            .eq("user_id", marshalId)
            .in("conversation_id", myConvIds);
          alreadyExists = (shared || []).length > 0;
        }

        if (!alreadyExists) {
          const { data: convData, error: convError } = await supabase
            .from("conversations")
            .insert({ title: `${eventTitle} — ${marshalName}` })
            .select()
            .single();

          if (convError) {
            console.error("Erreur création conversation:", convError);
          } else if (convData?.id) {
            await supabase.from("conversation_members").insert([
              { conversation_id: convData.id, user_id: currentUser.id },
              { conversation_id: convData.id, user_id: marshalId },
            ]);
          }
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
    <main className="min-h-screen bg-zinc-50 text-zinc-900">

      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="flex min-h-screen">

        <OrganizerSidebar />

        <div className="flex-1">

          <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white">
            <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-10">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">
                  Dashboard Organisateur
                </p>
                <h1 className="mt-2 text-2xl font-black text-zinc-900 lg:text-4xl">
                  Candidatures reçues
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <NotificationBell />
                <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm px-5 py-3 text-center">
                  <p className="text-xs text-zinc-500">Total</p>
                  <p className="text-2xl font-black text-zinc-900">{counts.all}</p>
                </div>
                <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-5 py-3 text-center">
                  <p className="text-xs text-zinc-500">En attente</p>
                  <p className="text-2xl font-black text-yellow-700">{counts.pending}</p>
                </div>
                <div className="hidden rounded-2xl border border-green-200 bg-green-50 px-5 py-3 text-center sm:block">
                  <p className="text-xs text-zinc-500">Acceptées</p>
                  <p className="text-2xl font-black text-green-700">{counts.accepted}</p>
                </div>
              </div>
            </div>
          </header>

          <div className="relative overflow-hidden">

            <div className="relative z-10 mx-auto max-w-[1600px] p-4 pb-24 sm:p-6 lg:p-10 lg:pb-10">

              <div className="mb-8 flex flex-wrap gap-3">
                {[
                  { key: "all", label: "Toutes", count: counts.all, active: "bg-[#FF5A1F] text-white" },
                  { key: "pending", label: "En attente", count: counts.pending, active: "bg-yellow-500 text-white" },
                  { key: "accepted", label: "Acceptées", count: counts.accepted, active: "bg-green-600 text-white" },
                  { key: "rejected", label: "Refusées", count: counts.rejected, active: "bg-red-600 text-white" },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`flex items-center gap-2 rounded-2xl px-5 py-3 font-bold transition ${
                      filter === f.key ? f.active : "bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    {f.label}
                    <span className="rounded-full bg-black/10 px-2 py-0.5 text-xs">{f.count}</span>
                  </button>
                ))}
              </div>

              {loading && (
                <div className="py-20 text-center text-zinc-500">Chargement...</div>
              )}

              {!loading && filtered.length === 0 && (
                <div className="rounded-[32px] border border-dashed border-zinc-300 p-16 text-center">
                  <h2 className="text-3xl font-black text-zinc-900">Aucune candidature</h2>
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
                    className="overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-sm"
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
                          <div className="mt-1 flex items-center gap-2 text-xs text-zinc-300">
                            <CalendarDays size={12} />
                            {formatDateRange(app.events?.event_date, app.events?.event_end_date)}
                          </div>
                        </div>
                      </div>

                      <div className="p-6 lg:p-8">

                        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">

                          <div className="flex gap-4">
                            <Link href={`/organizer/commissaires/${app.marshal_id}`}>
                              <img
                                src={
                                  app.profiles?.avatar_url ||
                                  `https://ui-avatars.com/api/?name=${encodeURIComponent(app.profiles?.full_name || "Marshal")}&background=FF5A1F&color=fff`
                                }
                                alt=""
                                className="h-16 w-16 rounded-2xl object-cover transition hover:opacity-80"
                              />
                            </Link>
                            <div>
                              <Link href={`/organizer/commissaires/${app.marshal_id}`} className="transition hover:text-[#FF5A1F]">
                                <h3 className="text-2xl font-black text-zinc-900">{app.profiles?.full_name}</h3>
                              </Link>
                              <p className="mt-1 text-sm text-zinc-600">
                                📍 {app.profiles?.city || "Ville inconnue"}{app.profiles?.country ? `, ${app.profiles.country}` : ""}
                              </p>
                              <p className="text-sm text-zinc-600">📧 {app.profiles?.email || "—"}</p>
                              {app.profiles?.years_experience && (
                                <p className="mt-2 text-sm text-zinc-700">
                                  ⏳ {app.profiles.years_experience} ans d'expérience
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col items-start gap-3 sm:items-end">
                            <span className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] ${
                              app.status === "accepted"
                                ? "bg-green-100 text-green-700"
                                : app.status === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}>
                              {app.status === "accepted" ? "Accepté" : app.status === "rejected" ? "Refusé" : "En attente"}
                            </span>
                            {app.desired_role && (
                              <span className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">{app.desired_role}</span>
                            )}

                            <div className="flex flex-wrap gap-3">
                              <Link
                                href={`/organizer/commissaires/${app.marshal_id}`}
                                className="rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-3 text-sm font-bold text-zinc-700 transition hover:border-[#FF5A1F]/40 hover:text-[#FF5A1F]"
                              >
                                Voir profil
                              </Link>
                              <button
                                disabled={app.status === "accepted"}
                                onClick={() => updateStatus(app.id, "accepted", app.marshal_id, app.events?.slug, app.events?.title, app.profiles?.full_name, app.profiles?.email, app.events?.event_date, app.events?.location)}
                                className={`rounded-2xl px-5 py-3 text-sm font-bold text-white transition ${
                                  app.status === "accepted"
                                    ? "cursor-not-allowed bg-zinc-200 text-zinc-400"
                                    : "bg-green-600 hover:scale-105"
                                }`}
                              >
                                Accepter
                              </button>
                              <button
                                disabled={app.status === "rejected"}
                                onClick={() => updateStatus(app.id, "rejected", app.marshal_id, app.events?.slug, app.events?.title, app.profiles?.full_name, app.profiles?.email, app.events?.event_date, app.events?.location)}
                                className={`rounded-2xl px-5 py-3 text-sm font-bold text-white transition ${
                                  app.status === "rejected"
                                    ? "cursor-not-allowed bg-zinc-200 text-zinc-400"
                                    : "bg-red-600 hover:scale-105"
                                }`}
                              >
                                Refuser
                              </button>
                            </div>
                          </div>

                        </div>

                        {app.status === "accepted" && (
                          <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-500">Poste assigné</p>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={postValues[app.id] ?? ""}
                                onChange={(e) => setPostValues(prev => ({ ...prev, [app.id]: e.target.value }))}
                                placeholder="ex : Poste 12, Direction de course..."
                                className="flex-1 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#FF5A1F]"
                              />
                              <button
                                onClick={() => savePost(app.id, postValues[app.id] ?? "")}
                                disabled={postSaving[app.id]}
                                className="rounded-xl bg-[#FF5A1F]/20 px-4 py-2 text-sm font-bold text-[#FF5A1F] transition hover:bg-[#FF5A1F]/30 disabled:opacity-50"
                              >
                                {postSaving[app.id] ? "..." : "OK"}
                              </button>
                            </div>
                            {app.post && (
                              <p className="mt-1.5 text-xs text-zinc-500">Actuel : <span className="font-semibold text-zinc-700">{app.post}</span></p>
                            )}
                          </div>
                        )}

                        {app.profiles?.experience && (
                          <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Expérience</p>
                            <p className="mt-2 whitespace-pre-line text-sm text-zinc-700">{app.profiles.experience}</p>
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

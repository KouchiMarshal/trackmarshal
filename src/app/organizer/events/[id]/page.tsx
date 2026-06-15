"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Copy,
  FileSpreadsheet,
  FileText,
  MapPin,
  Pencil,
  Users,
  Trash2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import OrganizerSidebar from "@/components/layout/organizer-sidebar";
import NotificationBell from "@/components/notifications/notification-bell";
import { formatDate } from "@/lib/formatDate";
import { Toast, type ToastData } from "@/components/ui/toast";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { sendEmail } from "@/lib/sendEmail";

export default function OrganizerEventDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const eventId = params?.id as string;

const [filter, setFilter] =
  useState("all");

  const [toast, setToast] = useState<ToastData>(null);

  const [event, setEvent] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  useEffect(() => {
    if (!eventId) return;

    loadEvent();

    const channel = supabase
      .channel(`organizer-event-${eventId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "applications", filter: `event_id=eq.${eventId}` }, () => {
        loadEvent();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [eventId]);

  async function loadEvent() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); setLoading(false); return; }

      const { data: eventData } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .eq("organizer_id", user.id)
        .maybeSingle();

      setEvent(eventData ?? null);

      const { data: appsRaw } =
        await supabase
          .from("applications")
          .select("*")
          .eq("event_id", eventId)
          .order("created_at", { ascending: false });

      const appsData = appsRaw || [];

      if (appsData.length > 0) {
        const profileIds = [...new Set(appsData.map((a: any) => a.marshal_id))];
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, full_name, email, phone, city, country, experience, years_experience, avatar_url, license_type, license_number, license_url, license_verified, languages, specialties, disciplines")
          .in("id", profileIds);

        const profilesMap: Record<string, any> = {};
        (profilesData || []).forEach((p: any) => { profilesMap[p.id] = p; });

        setApplications(appsData.map((a: any) => ({
          ...a,
          profiles: profilesMap[a.marshal_id] || null,
        })));
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  async function deleteEvent() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("events").delete().eq("id", eventId).eq("organizer_id", user.id);
    router.push("/organizer/events");
  }

  async function cloneEvent() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !event) return;

    const slug = `${event.slug || event.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-copie-${Date.now()}`;
    const { data, error } = await supabase.from("events").insert({
      title: `${event.title} (copie)`,
      slug,
      organizer_id: user.id,
      location: event.location,
      country: event.country,
      event_date: event.event_date,
      discipline: event.discipline,
      description: event.description,
      briefing: event.briefing,
      marshals_needed: event.marshals_needed,
      hotel: event.hotel,
      repas: event.repas,
      repas_type: event.repas_type,
      defraiement: event.defraiement,
      defraiement_amount: event.defraiement_amount,
      pass_accompagnant: event.pass_accompagnant,
      pass_accompagnant_count: event.pass_accompagnant_count,
      organizer_contact: event.organizer_contact,
      schedule: event.schedule,
    }).select().single();

    if (error) { setToast({ message: error.message, type: "error" }); return; }
    setToast({ message: "Événement dupliqué avec succès !", type: "success" });
    setTimeout(() => router.push(`/organizer/events/${data.id}`), 1000);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        Chargement...
      </main>
    );
  }

  if (!event) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-4xl font-black">
            Événement introuvable
          </h1>

          <Link
            href="/organizer/events"
            className="mt-6 inline-flex rounded-2xl bg-[#FF5A1F] px-6 py-3 font-bold"
          >
            Retour aux événements
          </Link>
        </div>
      </main>
    );
  }

  const accepted =
    applications.filter(
      (a) => a.status === "accepted"
    ).length;

  const pending =
    applications.filter(
      (a) => a.status === "pending"
    ).length;

  const remaining =
    Math.max(
      0,
      (event.marshals_needed || 0) - accepted
    );

const filteredApplications =
  applications.filter((app) => {

    if (filter === "all") {
      return true;
    }

    return app.status === filter;
  });

  async function bulkUpdateStatus(status: "accepted" | "rejected") {
    if (selected.length === 0) return;
    setBulkLoading(true);
    await supabase.from("applications").update({ status }).in("id", selected);
    setSelected([]);
    setBulkLoading(false);
    loadEvent();
    setToast({ message: `${selected.length} candidature(s) ${status === "accepted" ? "acceptée(s)" : "refusée(s)"}`, type: "success" });
  }

  function escapeHtml(val: string | null | undefined): string {
    if (!val) return "—";
    return String(val)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeCSV(val: any): string {
    if (val === null || val === undefined) return "";
    const str = String(val).replace(/"/g, '""');
    return str.includes(",") || str.includes("\n") || str.includes('"') ? `"${str}"` : str;
  }

  function exportCSV() {
    const accepted = applications.filter((a) => a.status === "accepted");
    const headers = ["Nom", "Email", "Téléphone", "Ville", "Pays", "Années d'expérience", "Type licence", "Numéro licence", "Licence vérifiée", "URL licence", "Langues", "Spécialités", "Disciplines", "Expérience"];
    const rows = accepted.map((app) => {
      const p = app.profiles || {};
      return [
        p.full_name, p.email, p.phone, p.city, p.country,
        p.years_experience, p.license_type, p.license_number,
        p.license_verified ? "Oui" : "Non",
        p.license_url, p.languages, p.specialties, p.disciplines,
        p.experience,
      ].map(escapeCSV);
    });

    const csvContent = "﻿" + [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.title.replace(/[^a-z0-9]/gi, "_")}_commissaires.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportPDF() {
    const accepted = applications.filter((a) => a.status === "accepted");
    const rows = accepted.map((app) => {
      const p = app.profiles || {};
      return `
        <tr>
          <td>${escapeHtml(p.full_name)}</td>
          <td>${escapeHtml(p.email)}</td>
          <td>${escapeHtml(p.phone)}</td>
          <td>${escapeHtml(p.city)}${p.country ? `, ${escapeHtml(p.country)}` : ""}</td>
          <td>${escapeHtml(p.years_experience)}</td>
          <td>${escapeHtml(p.license_type)}</td>
          <td>${escapeHtml(p.license_number)}</td>
          <td>${p.license_verified ? "✔ Vérifiée" : "En attente"}</td>
          <td>${escapeHtml(p.languages)}</td>
          <td>${escapeHtml(p.specialties)}</td>
        </tr>
      `;
    }).join("");

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
      <title>Commissaires acceptés — ${event.title}</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 11px; color: #111; margin: 20px; }
        h1 { font-size: 18px; margin-bottom: 4px; }
        p { color: #555; margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #FF5A1F; color: #fff; padding: 8px 6px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; }
        td { padding: 7px 6px; border-bottom: 1px solid #eee; vertical-align: top; }
        tr:nth-child(even) td { background: #fafafa; }
      </style>
    </head><body>
      <h1>${escapeHtml(event.title)}</h1>
      <p>Commissaires acceptés — exporté le ${new Date().toLocaleDateString("fr-FR")}</p>
      <table>
        <thead><tr>
          <th>Nom</th><th>Email</th><th>Téléphone</th><th>Localisation</th>
          <th>Exp.</th><th>Type licence</th><th>N° licence</th><th>Vérifiée</th><th>Langues</th><th>Spécialités</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </body></html>`;

    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
      win.focus();
      setTimeout(() => { win.print(); }, 300);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <Toast toast={toast} onClose={() => setToast(null)} />
      <ConfirmModal
        open={confirmDelete}
        title="Supprimer l'événement"
        message={`Êtes-vous sûr de vouloir supprimer "${event?.title}" ? Cette action est irréversible et supprimera toutes les candidatures associées.`}
        confirmText="Supprimer définitivement"
        danger
        onConfirm={() => { setConfirmDelete(false); deleteEvent(); }}
        onCancel={() => setConfirmDelete(false)}
      />

      <div className="flex min-h-screen">

        <OrganizerSidebar />

        <div className="flex-1 overflow-auto">

      <div className="relative h-[420px] overflow-hidden">

        <img
          src={
            event.image_url ||
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop"
          }
          alt={event.title}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-between p-6 lg:p-10">

          <div className="flex justify-between">

            <Link
              href="/organizer/events"
              className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/40 px-5 py-3 backdrop-blur-xl"
            >
              <ArrowLeft size={18} />
              Retour
            </Link>

            <div className="flex items-center gap-3">
              <NotificationBell />
              <button
                onClick={cloneEvent}
                className="flex items-center gap-2 rounded-2xl bg-white/10 px-5 py-3 font-bold backdrop-blur-xl transition hover:bg-white/20"
              >
                <Copy size={18} />
                Cloner
              </button>

              <Link
                href={`/organizer/events/${eventId}/edit`}
                className="flex items-center gap-2 rounded-2xl bg-white/10 px-5 py-3 font-bold backdrop-blur-xl transition hover:bg-white/20"
              >
                <Pencil size={18} />
                Modifier
              </Link>

              <button
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-2 rounded-2xl bg-red-500 px-5 py-3 font-bold"
              >
                <Trash2 size={18} />
                Supprimer
              </button>
            </div>

          </div>

          <div>

            <div className="mb-4 inline-flex rounded-full bg-[#FF5A1F] px-4 py-2 text-sm font-bold">
              {event.discipline}
            </div>

            <h1 className="max-w-5xl text-5xl font-black lg:text-7xl">
              {event.title}
            </h1>

            <div className="mt-6 flex flex-wrap gap-6 text-zinc-300">

              <div className="flex items-center gap-2">
                <CalendarDays size={18} />
                {formatDate(event.event_date)}
              </div>

              <div className="flex items-center gap-2">
                <MapPin size={18} />
                {event.location}, {event.country}
              </div>

            </div>

          </div>

        </div>

      </div>

      <div className="mx-auto max-w-[1700px] p-6 lg:p-10">

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
            <p className="text-zinc-500">
              Candidatures
            </p>
            <h2 className="mt-4 text-5xl font-black">
              {applications.length}
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
            <p className="text-zinc-500">
              Acceptés
            </p>
            <h2 className="mt-4 text-5xl font-black text-green-400">
              {accepted}
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
            <p className="text-zinc-500">
              En attente
            </p>
            <h2 className="mt-4 text-5xl font-black text-yellow-400">
              {pending}
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
            <p className="text-zinc-500">
              Places restantes
            </p>
            <h2 className="mt-4 text-5xl font-black text-[#FF5A1F]">
              {remaining}
            </h2>
          </div>

        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_420px]">

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">

            <div className="flex flex-wrap items-center justify-between gap-4">

              <div className="flex items-center gap-3">
                <Users />
                <h2 className="text-3xl font-black">
                  Candidatures
                </h2>
              </div>

              {accepted > 0 && (
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/organizer/events/${eventId}/reviews`}
                    className="flex items-center gap-2 rounded-2xl border border-[#FF5A1F]/30 bg-[#FF5A1F]/10 px-5 py-3 text-sm font-bold text-[#FF5A1F] transition hover:bg-[#FF5A1F]/20"
                  >
                    ⭐ Évaluer
                  </Link>
                  <button
                    onClick={exportCSV}
                    className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-bold transition hover:border-[#FF5A1F]/40 hover:text-[#FF5A1F]"
                  >
                    <FileSpreadsheet size={16} />
                    Excel / CSV
                  </button>
                  <button
                    onClick={exportPDF}
                    className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-bold transition hover:border-[#FF5A1F]/40 hover:text-[#FF5A1F]"
                  >
                    <FileText size={16} />
                    Imprimer / PDF
                  </button>
                </div>
              )}

            </div>

{selected.length > 0 && (
  <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
    <span className="text-sm font-bold text-zinc-400">{selected.length} sélectionné(s)</span>
    <button
      onClick={() => bulkUpdateStatus("accepted")}
      disabled={bulkLoading}
      className="rounded-2xl bg-green-600 px-5 py-2 text-sm font-bold transition hover:bg-green-500 disabled:opacity-60"
    >
      Accepter la sélection
    </button>
    <button
      onClick={() => bulkUpdateStatus("rejected")}
      disabled={bulkLoading}
      className="rounded-2xl bg-red-600 px-5 py-2 text-sm font-bold transition hover:bg-red-500 disabled:opacity-60"
    >
      Refuser la sélection
    </button>
    <button onClick={() => setSelected([])} className="text-sm text-zinc-500 hover:text-white transition">
      Désélectionner
    </button>
  </div>
)}

<div className="mt-8 mb-6 flex flex-wrap gap-3">

  <button
    onClick={() => setFilter("all")}
    className={`rounded-2xl px-4 py-2 font-bold ${
      filter === "all"
        ? "bg-[#FF5A1F]"
        : "bg-white/10"
    }`}
  >
    Toutes
  </button>

  <button
    onClick={() => setFilter("pending")}
    className={`rounded-2xl px-4 py-2 font-bold ${
      filter === "pending"
        ? "bg-yellow-600"
        : "bg-white/10"
    }`}
  >
    En attente
  </button>

  <button
    onClick={() => setFilter("accepted")}
    className={`rounded-2xl px-4 py-2 font-bold ${
      filter === "accepted"
        ? "bg-green-600"
        : "bg-white/10"
    }`}
  >
    Acceptées
  </button>

  <button
    onClick={() => setFilter("rejected")}
    className={`rounded-2xl px-4 py-2 font-bold ${
      filter === "rejected"
        ? "bg-red-600"
        : "bg-white/10"
    }`}
  >
    Refusées
  </button>

</div>
            {filteredApplications.length === 0 ? (

              <div className="mt-8 rounded-3xl border border-dashed border-white/10 p-12 text-center">

                <h3 className="text-2xl font-black">
                  Aucune candidature
                </h3>

                <p className="mt-4 text-zinc-500">
                  Votre événement est en ligne.
                  Les commissaires peuvent
                  désormais postuler.
                </p>

              </div>

            ) : (

<div className="mt-8 space-y-4">
  {filteredApplications.map((app) => (
<div
  key={app.id}
  className={`rounded-3xl border bg-black/30 p-6 transition ${selected.includes(app.id) ? "border-[#FF5A1F]/50 bg-[#FF5A1F]/5" : "border-white/10"}`}
>
  <div className="flex items-start justify-between">

    <div className="flex gap-4">

      <input
        type="checkbox"
        checked={selected.includes(app.id)}
        onChange={(e) => setSelected(prev => e.target.checked ? [...prev, app.id] : prev.filter(id => id !== app.id))}
        className="mt-1 h-5 w-5 cursor-pointer accent-[#FF5A1F]"
      />

      <Link href={`/organizer/commissaires/${app.marshal_id}`}>
        <img
          src={
            app.profiles?.avatar_url ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              app.profiles?.full_name || "Marshal"
            )}`
          }
          alt=""
          className="h-16 w-16 rounded-full transition hover:opacity-80"
        />
      </Link>

      <div>

        <Link href={`/organizer/commissaires/${app.marshal_id}`} className="transition hover:text-[#FF5A1F]">
          <h3 className="text-2xl font-black">
            {app.profiles?.full_name}
          </h3>
        </Link>

        <p className="mt-2 text-zinc-400">
          📍 {app.profiles?.city || "Ville inconnue"}
          {app.profiles?.country
            ? `, ${app.profiles.country}`
            : ""}
        </p>

        <p className="text-zinc-400">
          📧 {app.profiles?.email || "-"}
        </p>

        <p className="text-zinc-400">
          📞 {app.profiles?.phone || "-"}
        </p>

        <p className="mt-3 text-zinc-300">
          🏁 Expérience :
        </p>

        <p className="whitespace-pre-line text-zinc-400">
          {app.profiles?.experience || "Aucune"}
        </p>

        <p className="mt-3 text-zinc-300">
          ⏳ Ancienneté :
          {" "}
          {app.profiles?.years_experience || "-"}
        </p>

<div className="mt-3">

  <span
    className={`rounded-full px-3 py-1 text-sm font-bold ${
      app.status === "accepted"
        ? "bg-green-500/20 text-green-400"
        : app.status === "rejected"
        ? "bg-red-500/20 text-red-400"
        : "bg-yellow-500/20 text-yellow-400"
    }`}
  >
    {app.status === "accepted"
      ? "Accepté"
      : app.status === "rejected"
      ? "Refusé"
      : "En attente"}
  </span>

</div>

      </div>

    </div>

    <div className="flex flex-col gap-3">

  <Link
    href={`/organizer/commissaires/${app.marshal_id}`}
    className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2 text-center text-sm font-bold transition hover:border-[#FF5A1F]/40 hover:text-[#FF5A1F]"
  >
    Voir profil
  </Link>

  <div className="flex gap-3">
  <button
  disabled={app.status === "accepted"}
  onClick={async () => {

    if (accepted >= event.marshals_needed) {

      setToast({ message: "Le nombre maximum de commissaires a été atteint.", type: "error" });

      return;
    }

 await supabase
  .from("applications")
  .update({ status: "accepted" })
  .eq("id", app.id);

await supabase
  .from("notifications")
  .insert({
    user_id: app.marshal_id,
    title: "Votre candidature a été acceptée",
    type: "application_accepted",
    link: `/events/${event.slug}`,
  });

if (app.profiles?.email) {
  sendEmail(app.profiles.email, "application_accepted", {
    eventTitle: event.title,
    eventDate: formatDate(event.event_date),
    eventLocation: event.location,
  });
}

const { data: { user: currentUser } } = await supabase.auth.getUser();
if (currentUser) {
  const { data: convData, error: convError } = await supabase
    .from("conversations")
    .insert({ title: `${event.title} — ${app.profiles?.full_name || "Commissaire"}` })
    .select()
    .single();

  if (convError) {
    console.error("Erreur création conversation:", convError);
    setToast({ message: `Candidature acceptée mais erreur messagerie: ${convError.message}`, type: "error" });
  } else if (convData?.id) {
    const { error: membersError } = await supabase.from("conversation_members").insert([
      { conversation_id: convData.id, user_id: currentUser.id },
      { conversation_id: convData.id, user_id: app.marshal_id },
    ]);
    if (membersError) console.error("Erreur membres conversation:", membersError);
  }
}

loadEvent();
  }}
  className={`rounded-2xl px-5 py-3 font-bold ${
    app.status === "accepted"
      ? "bg-zinc-700 cursor-not-allowed"
      : "bg-green-600"
  }`}
>
  Accepter
</button>

 <button
  disabled={app.status === "rejected"}
  onClick={async () => {

   await supabase
  .from("applications")
  .update({
    status: "rejected",
  })
  .eq("id", app.id);

await supabase
  .from("notifications")
  .insert({
    user_id: app.marshal_id,
    title: "Votre candidature a été refusée",
    type: "application_rejected",
    link: `/events/${event.slug}`,
  });

if (app.profiles?.email) {
  sendEmail(app.profiles.email, "application_rejected", {
    eventTitle: event.title,
  });
}

loadEvent();
  }}
  className={`rounded-2xl px-5 py-3 font-bold ${
    app.status === "rejected"
      ? "bg-zinc-700 cursor-not-allowed"
      : "bg-red-600"
  }`}
>
  Refuser
</button>

    </div>

  </div>

  </div>
</div>
  ))}
</div>

            )}

          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">

              <h3 className="text-xl font-black">
                Description
              </h3>

              <p className="mt-4 text-zinc-300">
                {event.briefing || event.description || "Aucune description disponible."}
              </p>

            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">

              <h3 className="text-xl font-black">
                Avantages
              </h3>

              <div className="mt-4 flex flex-col gap-3">

                {event.hotel && (
                  <div>🏨 Hôtel fourni</div>
                )}

                {event.pass_accompagnant && (
                  <div>
                    🎟️ {event.pass_accompagnant_count}
                    {" "}pass accompagnant(s)
                  </div>
                )}

                {event.defraiement && (
                  <div>
                    💰 Défraiement :
                    {" "}
                    {event.defraiement_amount} €
                  </div>
                )}

                {event.repas && (
                  <div>
                    🍽️ {event.repas_type}
                  </div>
                )}

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
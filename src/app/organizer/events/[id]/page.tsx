"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Users,
  Trash2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function OrganizerEventDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const eventId = params?.id as string;

const [filter, setFilter] =
  useState("all");

  const [event, setEvent] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (eventId) {
      loadEvent();
    }
  }, [eventId]);

  async function loadEvent() {
    try {
      const { data: eventData } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .maybeSingle();

      setEvent(eventData ?? null);

const { data: applicationsData, error } =
  await supabase
    .from("applications")
    .select(`
      *,
      profiles:marshal_id (
        id,
        full_name,
        email,
        phone,
        city,
        country,
        experience,
        years_experience,
        avatar_url
      )
    `)
    .eq("event_id", eventId)
    .order("created_at", {
      ascending: false,
    });

console.log("APPLICATIONS:", applicationsData);

applicationsData?.forEach((app) => {
  console.log(
    app.profiles?.full_name,
    app.profiles
  );
});

console.log("ERROR:", error);

      setApplications(applicationsData || []);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  async function deleteEvent() {
    const confirmDelete = confirm(
      "Supprimer définitivement cet événement ?"
    );

    if (!confirmDelete) return;

    await supabase
      .from("events")
      .delete()
      .eq("id", eventId);

    router.push("/organizer/events");
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

  return (
    <main className="min-h-screen bg-black text-white">

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

            <button
              onClick={deleteEvent}
              className="flex items-center gap-2 rounded-2xl bg-red-500 px-5 py-3 font-bold"
            >
              <Trash2 size={18} />
              Supprimer
            </button>

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
                {event.event_date}
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

            <div className="flex items-center gap-3">

              <Users />

              <h2 className="text-3xl font-black">
                Candidatures
              </h2>

            </div>

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
  className="rounded-3xl border border-white/10 bg-black/30 p-6"
>
  <div className="flex items-start justify-between">

    <div className="flex gap-4">

      <img
        src={
          app.profiles?.avatar_url ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            app.profiles?.full_name || "Marshal"
          )}`
        }
        alt=""
        className="h-16 w-16 rounded-full"
      />

      <div>

        <h3 className="text-2xl font-black">
          {app.profiles?.full_name}
        </h3>

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

    <div className="flex gap-3">

  <button
  disabled={app.status === "accepted"}
  onClick={async () => {

    if (accepted >= event.marshals_needed) {

      alert(
        "Le nombre maximum de commissaires a été atteint."
      );

      return;
    }

 await supabase
  .from("applications")
  .update({
    status: "accepted",
  })
  .eq("id", app.id);

await supabase
  .from("notifications")
  .insert({
    user_id: app.marshal_id,
    title: "Votre candidature a été acceptée",
    type: "application_accepted",
    link: `/events/${eventId}`,
  });

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
    link: `/events/${eventId}`,
  });

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
                {event.description}
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

    </main>
  );
}
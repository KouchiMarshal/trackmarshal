"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { supabase } from "@/lib/supabase";

export default function OrganizerEvents() {

  const [events, setEvents] = useState<any[]>([]);

  const [isMounted, setIsMounted] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [country, setCountry] = useState("");
  const [discipline, setDiscipline] = useState("");

  const [briefing, setBriefing] = useState("");
  const [schedule, setSchedule] = useState("");

  const [accommodation, setAccommodation] = useState("");
  const [meals, setMeals] = useState("");

  const [imageUrl, setImageUrl] = useState("");

  const [marshalsNeeded, setMarshalsNeeded] = useState("");

  const [organizerContact, setOrganizerContact] = useState("");

  const [eventDate, setEventDate] = useState("");

  useEffect(() => {

    setIsMounted(true);

    loadEvents();

  }, []);

  async function loadEvents() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("organizer_id", user.id);

    setEvents(data || []);
  }

  function openEdit(event: any) {

    setSelectedEvent(event);

    setTitle(event.title || "");
    setLocation(event.location || "");
    setCountry(event.country || "");
    setDiscipline(event.discipline || "");

    setBriefing(event.briefing || "");
    setSchedule(event.schedule || "");

    setAccommodation(event.accommodation || "");
    setMeals(event.meals || "");

    setImageUrl(event.image_url || "");

    setMarshalsNeeded(
      String(event.marshals_needed || "")
    );

    setOrganizerContact(
      event.organizer_contact || ""
    );

    setEventDate(event.event_date || "");
  }

  async function handleUpdate() {

    if (!selectedEvent) return;

    const slug = title
      .toLowerCase()
      .replaceAll(" ", "-");

    const { error } = await supabase
      .from("events")
      .update({
        title,
        location,
        country,
        discipline,

        briefing,
        schedule,

        accommodation,
        meals,

        image_url: imageUrl,

        marshals_needed: Number(
          marshalsNeeded
        ),

        organizer_contact: organizerContact,

        event_date: eventDate,

        slug,
      })
      .eq("id", selectedEvent.id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Événement mis à jour.");

    window.location.reload();
  }

  async function deleteEvent(id: string) {

    const confirmed = confirm(
      "Supprimer cet événement ?"
    );

    if (!confirmed) return;

    await supabase
      .from("events")
      .delete()
      .eq("id", id);

    setEvents(
      events.filter(
        (event) => event.id !== id
      )
    );
  }

  return (
    <>
      <div className="mt-10 rounded-[32px] border border-white/10 bg-[#0A0A0A] p-8">

        <div className="mb-8 flex items-center justify-between">

          <div>

            <p className="text-sm uppercase tracking-[0.3em] text-[#FF5A1F]">

              Gestion Événements

            </p>

            <h2 className="mt-4 text-5xl font-black">
              Mes Événements
            </h2>

          </div>

        </div>

        <div className="space-y-4">

          {events.length === 0 && (

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-zinc-400">

              Aucun événement créé pour le moment.

            </div>

          )}

          {events.map((event: any) => (

            <div
              key={event.id}
              className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:flex-row lg:items-center lg:justify-between"
            >

              <div>

                <div className="flex flex-wrap items-center gap-3">

                  <div className="rounded-full bg-[#FF5A1F]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#FF5A1F]">

                    {event.discipline || "Motorsport"}

                  </div>

                  <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.15em] text-zinc-300">

                    {event.country || "France"}

                  </div>

                </div>

                <h3 className="mt-5 text-3xl font-black">
                  {event.title}
                </h3>

                <p className="mt-3 text-zinc-400">
                  {event.location}
                </p>

              </div>

              <div className="flex flex-wrap gap-3">

                <button
                  onClick={() => openEdit(event)}
                  className="rounded-2xl bg-[#FF5A1F] px-6 py-3 font-bold text-white transition hover:opacity-90"
                >
                  Modifier
                </button>

                <button
                  onClick={() => deleteEvent(event.id)}
                  className="rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-3 font-bold text-red-400 transition hover:bg-red-500/20"
                >
                  Supprimer
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

      {isMounted && selectedEvent && createPortal(

        <div className="fixed inset-0 z-[999999] overflow-y-auto bg-black/90 p-6">

          <div className="mx-auto w-full max-w-5xl rounded-[36px] border border-white/10 bg-[#111111] p-10 text-white">

            <div className="mb-10">

              <p className="text-sm uppercase tracking-[0.3em] text-[#FF5A1F]">

                Édition Événement

              </p>

              <h2 className="mt-4 text-5xl font-black">
                Modifier l'Événement
              </h2>

            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nom de l'événement"
                className="h-14 rounded-2xl border border-white/10 bg-black px-5"
              />

              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Circuit / Lieu"
                className="h-14 rounded-2xl border border-white/10 bg-black px-5"
              />

              <input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Pays"
                className="h-14 rounded-2xl border border-white/10 bg-black px-5"
              />

              <input
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value)}
                placeholder="Discipline"
                className="h-14 rounded-2xl border border-white/10 bg-black px-5"
              />

              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="URL de l'image"
                className="h-14 rounded-2xl border border-white/10 bg-black px-5"
              />

              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="h-14 rounded-2xl border border-white/10 bg-black px-5"
              />

              <input
                value={marshalsNeeded}
                onChange={(e) => setMarshalsNeeded(e.target.value)}
                placeholder="Commissaires recherchés"
                className="h-14 rounded-2xl border border-white/10 bg-black px-5"
              />

              <input
                value={organizerContact}
                onChange={(e) => setOrganizerContact(e.target.value)}
                placeholder="Contact organisateur"
                className="h-14 rounded-2xl border border-white/10 bg-black px-5"
              />

            </div>

            <textarea
              value={briefing}
              onChange={(e) => setBriefing(e.target.value)}
              placeholder="Briefing de l'événement"
              className="mt-5 min-h-[160px] w-full rounded-2xl border border-white/10 bg-black p-5"
            />

            <textarea
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              placeholder="Planning de l'événement"
              className="mt-5 min-h-[160px] w-full rounded-2xl border border-white/10 bg-black p-5"
            />

            <div className="mt-5 grid gap-5 md:grid-cols-2">

              <input
                value={accommodation}
                onChange={(e) => setAccommodation(e.target.value)}
                placeholder="Hébergement"
                className="h-14 rounded-2xl border border-white/10 bg-black px-5"
              />

              <input
                value={meals}
                onChange={(e) => setMeals(e.target.value)}
                placeholder="Repas"
                className="h-14 rounded-2xl border border-white/10 bg-black px-5"
              />

            </div>

            <button
              onClick={handleUpdate}
              className="mt-8 h-14 w-full rounded-2xl bg-[#FF5A1F] text-lg font-bold transition hover:opacity-90"
            >
              Enregistrer les Modifications
            </button>

            <button
              onClick={() => setSelectedEvent(null)}
              className="mt-4 h-14 w-full rounded-2xl border border-white/10 transition hover:bg-white/5"
            >
              Fermer
            </button>

          </div>

        </div>,

        document.body

      )}

    </>
  );
}
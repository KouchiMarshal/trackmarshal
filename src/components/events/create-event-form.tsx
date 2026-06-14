"use client";

import { useState } from "react";

import { supabase } from "@/lib/supabase";

export default function CreateEventForm() {

  const [loading, setLoading] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [country, setCountry] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [eventDate, setEventDate] = useState("");

  const [briefing, setBriefing] = useState("");
  const [marshalsNeeded, setMarshalsNeeded] = useState("");
  const [accommodation, setAccommodation] = useState("");
  const [meals, setMeals] = useState("");
  const [schedule, setSchedule] = useState("");
  const [organizerContact, setOrganizerContact] = useState("");

  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {

    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(true);

    const fileExt = file.name.split(".").pop();

    const fileName = `${Date.now()}.${fileExt}`;

    const filePath = `events/${fileName}`;

    const { error } = await supabase.storage
      .from("event-images")
      .upload(filePath, file);

    if (error) {
      alert(error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("event-images")
      .getPublicUrl(filePath);

    setImageUrl(data.publicUrl);

    setUploading(false);
  }

  async function handleCreateEvent() {

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Vous devez être connecté.");
      setLoading(false);
      return;
    }

    const slug = title
      .toLowerCase()
      .replaceAll(" ", "-");

    const { error } = await supabase
      .from("events")
      .insert([
        {
          title,
          location,
          country,
          discipline,
          image_url: imageUrl,
          event_date: eventDate,
          slug,
          organizer_id: user.id,

          briefing,
          marshals_needed: Number(marshalsNeeded),
          accommodation,
          meals,
          schedule,
          organizer_contact: organizerContact,
        },
      ]);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Événement créé avec succès.");

    setTitle("");
    setLocation("");
    setCountry("");
    setDiscipline("");
    setImageUrl("");
    setEventDate("");

    setBriefing("");
    setMarshalsNeeded("");
    setAccommodation("");
    setMeals("");
    setSchedule("");
    setOrganizerContact("");
  }

  return (
    <div className="rounded-[36px] border border-white/10 bg-[#0A0A0A] p-10">

      <div className="mb-10">

        <p className="text-sm uppercase tracking-[0.3em] text-[#FF5A1F]">

          Panel Organisateur

        </p>

        <h2 className="mt-4 text-5xl font-black">

          Créer un Événement
        </h2>

      </div>

      <div className="grid gap-6 md:grid-cols-2">

        <input
          placeholder="Nom de l'événement"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-16 rounded-2xl border border-white/10 bg-white/5 px-6 text-white outline-none backdrop-blur-xl"
        />

        <input
          placeholder="Circuit / Lieu"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="h-16 rounded-2xl border border-white/10 bg-white/5 px-6 text-white outline-none backdrop-blur-xl"
        />

        <input
          placeholder="Pays"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="h-16 rounded-2xl border border-white/10 bg-white/5 px-6 text-white outline-none backdrop-blur-xl"
        />

        <input
          placeholder="Discipline"
          value={discipline}
          onChange={(e) => setDiscipline(e.target.value)}
          className="h-16 rounded-2xl border border-white/10 bg-white/5 px-6 text-white outline-none backdrop-blur-xl"
        />

        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          className="h-16 rounded-2xl border border-white/10 bg-white/5 px-6 text-white outline-none backdrop-blur-xl"
        />

        <input
          placeholder="Commissaires recherchés"
          value={marshalsNeeded}
          onChange={(e) => setMarshalsNeeded(e.target.value)}
          className="h-16 rounded-2xl border border-white/10 bg-white/5 px-6 text-white outline-none backdrop-blur-xl"
        />

        <input
          placeholder="Hébergement"
          value={accommodation}
          onChange={(e) => setAccommodation(e.target.value)}
          className="h-16 rounded-2xl border border-white/10 bg-white/5 px-6 text-white outline-none backdrop-blur-xl"
        />

        <input
          placeholder="Repas"
          value={meals}
          onChange={(e) => setMeals(e.target.value)}
          className="h-16 rounded-2xl border border-white/10 bg-white/5 px-6 text-white outline-none backdrop-blur-xl"
        />

        <input
          placeholder="Contact organisateur"
          value={organizerContact}
          onChange={(e) => setOrganizerContact(e.target.value)}
          className="h-16 rounded-2xl border border-white/10 bg-white/5 px-6 text-white outline-none backdrop-blur-xl md:col-span-2"
        />

      </div>

      <div className="mt-8">

        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-zinc-400">

          Image de l'Événement

        </p>

        <label className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-[32px] border border-dashed border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl transition hover:bg-white/10">

          {imageUrl ? (

            <img
              src={imageUrl}
              alt="Preview"
              className="h-[220px] w-full rounded-2xl object-cover"
            />

          ) : (

            <div>

              <p className="text-lg font-semibold text-white">

                {uploading
                  ? "Upload en cours..."
                  : "Ajouter une image"}

              </p>

              <p className="mt-3 text-zinc-500">

                PNG, JPG ou WEBP

              </p>

            </div>

          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

        </label>

      </div>

      <textarea
        placeholder="Briefing de l'événement"
        value={briefing}
        onChange={(e) => setBriefing(e.target.value)}
        className="mt-8 min-h-[160px] w-full rounded-[32px] border border-white/10 bg-white/5 p-6 text-white outline-none backdrop-blur-xl"
      />

      <textarea
        placeholder="Planning de l'événement"
        value={schedule}
        onChange={(e) => setSchedule(e.target.value)}
        className="mt-6 min-h-[160px] w-full rounded-[32px] border border-white/10 bg-white/5 p-6 text-white outline-none backdrop-blur-xl"
      />

      <button
        onClick={handleCreateEvent}
        disabled={loading}
        className="mt-10 h-16 w-full rounded-2xl bg-[#FF5A1F] text-lg font-bold transition duration-300 hover:scale-[1.02] hover:opacity-90"
      >

        {loading
          ? "Création de l'événement..."
          : "Créer l'Événement"}

      </button>

    </div>
  );
}
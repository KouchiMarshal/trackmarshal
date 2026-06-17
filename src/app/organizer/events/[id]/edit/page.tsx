"use client";

import {
  ArrowLeft,
  CalendarDays,
  ImageIcon,
  MapPin,
  Save,
  Users,
} from "lucide-react";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import OrganizerSidebar from "@/components/layout/organizer-sidebar";
import NotificationBell from "@/components/notifications/notification-bell";
import { Toast, type ToastData } from "@/components/ui/toast";

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.id as string;

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [userId, setUserId] = useState("");
  const [toast, setToast] = useState<ToastData>(null);

  const [title, setTitle] = useState("");
  const [country, setCountry] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [marshalsNeeded, setMarshalsNeeded] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [passAccompagnant, setPassAccompagnant] = useState(false);
  const [passCount, setPassCount] = useState("");
  const [defraiement, setDefraiement] = useState(false);
  const [defraiementAmount, setDefraiementAmount] = useState("");
  const [repas, setRepas] = useState(false);
  const [repasType, setRepasType] = useState("");
  const [hotel, setHotel] = useState(false);
  const [hotelDetail, setHotelDetail] = useState("");
  const [organizerContact, setOrganizerContact] = useState("");
  const [schedule, setSchedule] = useState("");

  useEffect(() => {
    if (eventId) loadEvent();
  }, [eventId]);

  async function loadEvent() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    setUserId(user.id);

    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .eq("organizer_id", user.id)
      .maybeSingle();

    if (!data) {
      router.push("/organizer/events");
      return;
    }

    setTitle(data.title || "");
    setCountry(data.country || "");
    setLocation(data.location || "");
    setDate(data.event_date ? data.event_date.split("T")[0] : "");
    setDescription(data.briefing || "");
    setCurrentImageUrl(data.image_url || "");
    setImagePreview(data.image_url || "");
    setMarshalsNeeded(data.marshals_needed?.toString() || "");
    setDiscipline(data.discipline || "");
    setPassAccompagnant(data.pass_accompagnant || false);
    setPassCount(data.pass_accompagnant_count?.toString() || "");
    setDefraiement(data.defraiement || false);
    setDefraiementAmount(data.defraiement_amount?.toString() || "");
    setRepas(data.repas || false);
    setRepasType(data.repas_type || "");
    setHotel(data.hotel || false);
    setHotelDetail(data.hotel_detail || "");
    setOrganizerContact(data.organizer_contact || "");
    setSchedule(data.schedule || "");
    setLoadingData(false);
  }

  async function uploadImage() {
    if (!imageFile) return null;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const formData = new FormData();
    formData.append("file", imageFile);

    const res = await fetch("/api/events/upload-image", {
      method: "POST",
      headers: { authorization: `Bearer ${session.access_token}` },
      body: formData,
    });

    const json = await res.json();
    if (!res.ok) {
      setToast({ message: json.error || "Erreur upload image", type: "error" });
      return null;
    }

    return json.url as string;
  }

  async function saveEvent() {
    if (!title.trim()) { setToast({ message: "Le nom de l'événement est obligatoire.", type: "error" }); return; }
    if (!date) { setToast({ message: "La date est obligatoire.", type: "error" }); return; }
    if (!location.trim()) { setToast({ message: "Le lieu est obligatoire.", type: "error" }); return; }
    if (!discipline) { setToast({ message: "La discipline est obligatoire.", type: "error" }); return; }

    setLoading(true);

    const uploadedImage = await uploadImage();

    const { error } = await supabase
      .from("events")
      .update({
        title,
        country,
        location,
        event_date: date,
        briefing: description,
        ...(uploadedImage ? { image_url: uploadedImage } : {}),
        marshals_needed: Number(marshalsNeeded),
        discipline,
        pass_accompagnant: passAccompagnant,
        pass_accompagnant_count: passCount || null,
        defraiement,
        defraiement_amount: defraiementAmount || null,
        repas,
        repas_type: repasType || null,
        hotel,
        hotel_detail: hotelDetail || null,
        organizer_contact: organizerContact,
        schedule: schedule || null,
      })
      .eq("id", eventId)
      .eq("organizer_id", userId);

    setLoading(false);

    if (error) {
      setToast({ message: error.message, type: "error" });
      return;
    }

    setToast({ message: "Événement mis à jour avec succès !", type: "success" });
    setTimeout(() => router.push(`/organizer/events/${eventId}`), 1200);
  }

  if (loadingData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        Chargement...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="flex min-h-screen">

        <OrganizerSidebar />

        <div className="flex-1 overflow-hidden">

          <header className="sticky top-0 z-40 flex h-16 items-center justify-end border-b border-white/10 bg-black/70 px-6 backdrop-blur-2xl">
            <NotificationBell />
          </header>

          <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-[#FF5A1F]/10 blur-[160px] pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-[1200px] p-4 pb-24 sm:p-6 lg:p-10 lg:pb-10">

            <div>
              <Link
                href={`/organizer/events/${eventId}`}
                className="flex items-center gap-3 text-zinc-400 transition hover:text-white"
              >
                <ArrowLeft size={18} />
                Retour à l'événement
              </Link>

              <p className="mt-8 text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">
                Dashboard Organisateur
              </p>

              <h1 className="mt-3 text-4xl font-black lg:text-6xl">
                Modifier l'événement
              </h1>

              <p className="mt-5 max-w-2xl text-lg text-zinc-400">
                Modifiez les informations de votre événement.
              </p>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.45fr]">

              <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:p-8">

                <div className="grid gap-6">

                  <div>
                    <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Nom de l'événement
                    </p>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="24H du Mans"
                      className="h-16 w-full rounded-2xl border border-white/10 bg-black/40 px-6 outline-none focus:border-[#FF5A1F]"
                    />
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <div>
                      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">Pays</p>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="France"
                        className="h-16 w-full rounded-2xl border border-white/10 bg-black/40 px-6 outline-none focus:border-[#FF5A1F]"
                      />
                    </div>
                    <div>
                      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">Lieu</p>
                      <div className="relative">
                        <MapPin size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="Le Mans"
                          className="h-16 w-full rounded-2xl border border-white/10 bg-black/40 pl-14 pr-6 outline-none focus:border-[#FF5A1F]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <div>
                      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">Date</p>
                      <div className="relative">
                        <CalendarDays size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="h-16 w-full rounded-2xl border border-white/10 bg-black/40 pl-14 pr-6 outline-none focus:border-[#FF5A1F]"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">Discipline</p>
                      <select
                        value={discipline}
                        onChange={(e) => setDiscipline(e.target.value)}
                        className="h-16 w-full rounded-2xl border border-white/10 bg-black/40 px-6 outline-none focus:border-[#FF5A1F]"
                      >
                        <option value="">Choisir</option>
                        <optgroup label="Auto">
                          <option value="Rallye">Rallye</option>
                          <option value="Circuit">Circuit</option>
                          <option value="Karting">Karting</option>
                          <option value="Drift">Drift</option>
                          <option value="Endurance">Endurance</option>
                        </optgroup>
                        <optgroup label="Moto">
                          <option value="Moto Cross">Moto Cross</option>
                          <option value="Enduro">Enduro</option>
                          <option value="Trial">Trial</option>
                          <option value="Road Racing">Road Racing</option>
                          <option value="Supermoto">Supermoto</option>
                          <option value="Rallye Moto">Rallye Moto</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Commissaires recherchés
                    </p>
                    <div className="relative">
                      <Users size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input
                        type="number"
                        value={marshalsNeeded}
                        onChange={(e) => setMarshalsNeeded(e.target.value)}
                        placeholder="25"
                        className="h-16 w-full rounded-2xl border border-white/10 bg-black/40 pl-14 pr-6 outline-none focus:border-[#FF5A1F]"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5">

                    <div className={`rounded-2xl border p-5 transition ${passAccompagnant ? "border-[#FF5A1F]/30 bg-[#FF5A1F]/5" : "border-white/10 bg-black/30"}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">🎟️ Pass accompagnant</span>
                        <button
                          type="button"
                          onClick={() => setPassAccompagnant(!passAccompagnant)}
                          className={`relative h-7 w-12 rounded-full transition-colors ${passAccompagnant ? "bg-[#FF5A1F]" : "bg-zinc-700"}`}
                        >
                          <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${passAccompagnant ? "translate-x-6" : "translate-x-1"}`} />
                        </button>
                      </div>
                      {passAccompagnant && (
                        <input
                          type="number"
                          placeholder="Nombre de pass accompagnant"
                          value={passCount}
                          onChange={(e) => setPassCount(e.target.value)}
                          className="mt-5 h-14 w-full rounded-2xl border border-white/10 bg-black/40 px-5 outline-none focus:border-[#FF5A1F]"
                        />
                      )}
                    </div>

                    <div className={`rounded-2xl border p-5 transition ${defraiement ? "border-[#FF5A1F]/30 bg-[#FF5A1F]/5" : "border-white/10 bg-black/30"}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">💰 Défraiement</span>
                        <button
                          type="button"
                          onClick={() => setDefraiement(!defraiement)}
                          className={`relative h-7 w-12 rounded-full transition-colors ${defraiement ? "bg-[#FF5A1F]" : "bg-zinc-700"}`}
                        >
                          <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${defraiement ? "translate-x-6" : "translate-x-1"}`} />
                        </button>
                      </div>
                      {defraiement && (
                        <input
                          type="text"
                          placeholder="Montant en € ou description (ex: 50€)"
                          value={defraiementAmount}
                          onChange={(e) => setDefraiementAmount(e.target.value)}
                          className="mt-5 h-14 w-full rounded-2xl border border-white/10 bg-black/40 px-5 outline-none focus:border-[#FF5A1F]"
                        />
                      )}
                    </div>

                    <div className={`rounded-2xl border p-5 transition ${repas ? "border-[#FF5A1F]/30 bg-[#FF5A1F]/5" : "border-white/10 bg-black/30"}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">🍽️ Repas fournis</span>
                        <button
                          type="button"
                          onClick={() => setRepas(!repas)}
                          className={`relative h-7 w-12 rounded-full transition-colors ${repas ? "bg-[#FF5A1F]" : "bg-zinc-700"}`}
                        >
                          <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${repas ? "translate-x-6" : "translate-x-1"}`} />
                        </button>
                      </div>
                      {repas && (
                        <input
                          type="text"
                          placeholder="ex : Déjeuner sam. + dim., dîner samedi soir"
                          value={repasType}
                          onChange={(e) => setRepasType(e.target.value)}
                          className="mt-5 h-14 w-full rounded-2xl border border-white/10 bg-black/40 px-5 outline-none focus:border-[#FF5A1F]"
                        />
                      )}
                    </div>

                    <div className={`rounded-2xl border p-5 transition ${hotel ? "border-[#FF5A1F]/30 bg-[#FF5A1F]/5" : "border-white/10 bg-black/30"}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">🏨 Hébergement</span>
                        <button
                          type="button"
                          onClick={() => setHotel(!hotel)}
                          className={`relative h-7 w-12 rounded-full transition-colors ${hotel ? "bg-[#FF5A1F]" : "bg-zinc-700"}`}
                        >
                          <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${hotel ? "translate-x-6" : "translate-x-1"}`} />
                        </button>
                      </div>
                      {hotel && (
                        <input
                          type="text"
                          placeholder="ex : Hôtel pris en charge vendredi et samedi soir"
                          value={hotelDetail}
                          onChange={(e) => setHotelDetail(e.target.value)}
                          className="mt-5 h-14 w-full rounded-2xl border border-white/10 bg-black/40 px-5 outline-none focus:border-[#FF5A1F]"
                        />
                      )}
                    </div>

                  </div>

                  <div>
                    <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Changer l'image (optionnel)
                    </p>
                    <div className="relative">
                      <ImageIcon size={18} className="absolute left-5 top-5 text-zinc-500" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setImageFile(file);
                          setImagePreview(URL.createObjectURL(file));
                        }}
                        className="w-full rounded-2xl border border-white/10 bg-black/40 p-5 pl-14"
                      />
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Contact organisateur
                    </p>
                    <input
                      type="text"
                      value={organizerContact}
                      onChange={(e) => setOrganizerContact(e.target.value)}
                      placeholder="email@organisation.com"
                      className="h-16 w-full rounded-2xl border border-white/10 bg-black/40 px-6 outline-none focus:border-[#FF5A1F]"
                    />
                  </div>

                  <div>
                    <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Description / Briefing
                    </p>
                    <textarea
                      rows={8}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Décrivez votre événement..."
                      className="w-full rounded-2xl border border-white/10 bg-black/40 p-6 outline-none focus:border-[#FF5A1F]"
                    />
                  </div>

                  <div>
                    <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Planning détaillé
                    </p>
                    <textarea
                      rows={6}
                      value={schedule}
                      onChange={(e) => setSchedule(e.target.value)}
                      placeholder={"Vendredi 14h : Accueil\nVendredi 16h : Briefing\nSamedi 08h : Départ épreuve..."}
                      className="w-full rounded-2xl border border-white/10 bg-black/40 p-6 outline-none focus:border-[#FF5A1F]"
                    />
                  </div>

                  <button
                    onClick={saveEvent}
                    disabled={loading}
                    className="flex h-16 items-center justify-center gap-3 rounded-2xl bg-[#FF5A1F] text-lg font-black transition hover:scale-[1.01] disabled:opacity-60"
                  >
                    <Save size={20} />
                    {loading ? "Sauvegarde..." : "Sauvegarder les modifications"}
                  </button>

                </div>
              </div>

              <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-xl">
                <div className="relative h-[280px]">
                  <img
                    src={imagePreview || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop"}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <div className="rounded-full bg-[#FF5A1F] px-4 py-2 text-xs font-black uppercase tracking-[0.15em]">
                      Aperçu
                    </div>
                    <h2 className="mt-5 text-4xl font-black">
                      {title || "Nom événement"}
                    </h2>
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

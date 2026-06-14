import Image from "next/image";

import { supabase } from "@/lib/supabase";

import Navbar from "@/components/layout/navbar";
import ApplyButton from "@/components/events/apply-button";

type EventPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EventPage({
  params,
}: EventPageProps) {

  const { slug } = await params;

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!event) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        Événement introuvable
      </main>
    );
  }

  const imageUrl =
    event.image_url && event.image_url.length > 0
      ? event.image_url
      : "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=2070&auto=format&fit=crop";

  const formattedDate = event.event_date
    ? new Date(event.event_date).toLocaleDateString(
        "fr-FR",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      )
    : "Date à confirmer";

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">

      <Navbar />

      <section className="relative min-h-[100svh] overflow-hidden">

        <Image
          src={imageUrl}
          alt={event.title}
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/75" />

        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-black/50 to-transparent" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/40" />

        <div className="absolute -left-20 top-20 h-[500px] w-[500px] rounded-full bg-[#FF5A1F]/20 blur-[180px]" />

        <div className="relative z-20 mx-auto flex min-h-[100svh] max-w-[1600px] items-end px-5 pb-14 pt-32 sm:px-8 sm:pb-24">

          <div className="max-w-6xl">

            <div className="mb-6 flex flex-wrap items-center gap-3 sm:mb-8 sm:gap-4">

              <div className="rounded-full bg-[#FF5A1F] px-4 py-2 sm:px-5 sm:py-3">

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white sm:text-xs sm:tracking-[0.25em]">

                  Inscriptions Ouvertes

                </p>

              </div>

              <div className="rounded-full border border-white/10 bg-black/40 px-4 py-2 backdrop-blur-xl sm:px-5 sm:py-3">

                <p className="text-[10px] uppercase tracking-[0.2em] text-white sm:text-xs sm:tracking-[0.25em]">

                  {event.discipline}

                </p>

              </div>

            </div>

            <p className="mb-5 text-xs uppercase tracking-[0.3em] text-[#FF5A1F] sm:mb-6 sm:text-sm sm:tracking-[0.35em]">

              {event.country}

            </p>

            <h1 className="max-w-6xl text-5xl font-black uppercase leading-[0.9] tracking-[-0.04em] sm:text-6xl md:text-7xl lg:text-[120px]">

              {event.title}

            </h1>

            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-zinc-300 sm:mt-10 sm:text-xl lg:text-2xl">

              {event.briefing || "Aucune description disponible."}

            </p>

            <div className="mt-10 grid gap-4 sm:mt-14 sm:flex sm:flex-wrap sm:gap-5">

              <div className="rounded-3xl border border-white/10 bg-black/40 px-6 py-5 backdrop-blur-2xl sm:px-7 sm:py-6">

                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 sm:text-xs">
                  Circuit / Lieu
                </p>

                <p className="mt-3 text-xl font-bold sm:text-2xl">
                  {event.location}
                </p>

              </div>

              <div className="rounded-3xl border border-white/10 bg-black/40 px-6 py-5 backdrop-blur-2xl sm:px-7 sm:py-6">

                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 sm:text-xs">
                  Date
                </p>

                <p className="mt-3 text-xl font-bold sm:text-2xl">
                  {formattedDate}
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      <section className="relative z-20 mx-auto max-w-[1600px] px-5 py-14 sm:px-8 sm:py-24">

        <div className="grid gap-8 lg:grid-cols-[1.5fr_420px] lg:gap-10">

          <div className="space-y-8 sm:space-y-10">

            <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[#0A0A0A] sm:rounded-[40px]">

              <div className="border-b border-white/10 p-6 sm:p-8">

                <p className="text-xs uppercase tracking-[0.25em] text-[#FF5A1F] sm:text-sm sm:tracking-[0.3em]">

                  Présentation de l'Événement

                </p>

              </div>

              <div className="p-6 sm:p-10">

                <p className="text-base leading-relaxed text-zinc-300 sm:text-lg lg:text-xl">

                  {event.briefing || "Aucune description disponible."}

                </p>

              </div>

            </div>

            <div className="grid gap-6 md:grid-cols-2 md:gap-10">

              <div className="rounded-[32px] border border-white/10 bg-[#0A0A0A] p-6 sm:rounded-[40px] sm:p-10">

                <p className="text-xs uppercase tracking-[0.25em] text-[#FF5A1F] sm:text-sm sm:tracking-[0.3em]">
                  Hébergement
                </p>

                <p className="mt-6 text-base leading-relaxed text-zinc-300 sm:mt-8 sm:text-lg">
                  {event.accommodation
                    ? event.accommodation
                    : event.hotel
                    ? "Hôtel inclus"
                    : "Non inclus"}
                </p>

              </div>

              <div className="rounded-[32px] border border-white/10 bg-[#0A0A0A] p-6 sm:rounded-[40px] sm:p-10">

                <p className="text-xs uppercase tracking-[0.25em] text-[#FF5A1F] sm:text-sm sm:tracking-[0.3em]">
                  Repas
                </p>

                <p className="mt-6 text-base leading-relaxed text-zinc-300 sm:mt-8 sm:text-lg">
                  {event.meals
                    ? event.meals
                    : event.repas
                    ? event.repas_type || "Repas fournis"
                    : "Non inclus"}
                </p>

              </div>

              <div className="rounded-[32px] border border-white/10 bg-[#0A0A0A] p-6 sm:rounded-[40px] sm:p-10">

                <p className="text-xs uppercase tracking-[0.25em] text-[#FF5A1F] sm:text-sm sm:tracking-[0.3em]">
                  Pass Accompagnant
                </p>

                <p className="mt-6 text-base leading-relaxed text-zinc-300 sm:mt-8 sm:text-lg">
                  {event.pass_accompagnant
                    ? `${event.pass_accompagnant_count || 1} pass accompagnant${(event.pass_accompagnant_count || 1) > 1 ? "s" : ""} inclus`
                    : "Non inclus"}
                </p>

              </div>

              <div className="rounded-[32px] border border-white/10 bg-[#0A0A0A] p-6 sm:rounded-[40px] sm:p-10">

                <p className="text-xs uppercase tracking-[0.25em] text-[#FF5A1F] sm:text-sm sm:tracking-[0.3em]">
                  Défraiement
                </p>

                <p className="mt-6 text-base leading-relaxed text-zinc-300 sm:mt-8 sm:text-lg">
                  {event.defraiement
                    ? event.defraiement_amount
                      ? `${event.defraiement_amount} €`
                      : "Inclus (montant à confirmer)"
                    : "Non prévu"}
                </p>

              </div>

            </div>

            <div className="rounded-[32px] border border-white/10 bg-[#0A0A0A] p-6 sm:rounded-[40px] sm:p-10">

              <p className="text-xs uppercase tracking-[0.25em] text-[#FF5A1F] sm:text-sm sm:tracking-[0.3em]">
                Planning de l'Événement
              </p>

              <div className="mt-6 whitespace-pre-line text-base leading-relaxed text-zinc-300 sm:mt-8 sm:text-lg">
                {event.schedule || "Planning à communiquer."}
              </div>

            </div>

          </div>

          <div>

            <div className="top-10 overflow-hidden rounded-[32px] border border-white/10 bg-[#0A0A0A] lg:sticky lg:rounded-[40px]">

              <div className="border-b border-white/10 p-6 sm:p-8">

                <p className="text-xs uppercase tracking-[0.25em] text-[#FF5A1F] sm:text-sm sm:tracking-[0.3em]">

                  Contact Organisateur

                </p>

              </div>

              <div className="p-6 sm:p-10">

                <p className="break-words text-lg text-zinc-300 sm:text-xl">

                  {event.organizer_contact || "Aucun contact disponible"}

                </p>

                <div className="mt-8">

                  <ApplyButton eventId={event.id} />
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}
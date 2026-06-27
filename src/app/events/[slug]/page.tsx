import Image from "next/image";
import { Suspense } from "react";
import type { Metadata } from "next";

import { supabaseAdmin as supabase } from "@/lib/supabase-admin";

import { formatDateRange } from "@/lib/formatDate";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";
import ApplyButton from "@/components/events/apply-button";
import ShareButton from "@/components/events/share-button";
import InviteButton from "@/components/events/invite-button";
import InviteBanner from "@/components/events/invite-banner";
import EventCounter from "@/components/events/event-counter";
import LiveApplyButton from "@/components/events/live-apply-button";

type EventPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const { data } = await supabase.from("events").select("slug");
  return (data || []).map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: event } = await supabase.from("events").select("title, briefing, location, country, discipline, image_url").eq("slug", slug).single();
  if (!event) return { title: "Événement introuvable" };
  const title = event.title;
  const description = event.briefing
    ? event.briefing.slice(0, 155)
    : `Événement ${event.discipline || "motorsport"} à ${event.location}${event.country ? `, ${event.country}` : ""} — Postulez comme commissaire de piste.`;
  return {
    title,
    description,
    openGraph: {
      title: `${title} | TrackMarshal`,
      description,
      url: `https://www.trackmarshal.app/events/${slug}`,
      images: event.image_url ? [{ url: event.image_url, width: 1200, height: 630, alt: title }] : [],
    },
    alternates: { canonical: `/events/${slug}` },
  };
}

export default async function EventPage({
  params,
}: EventPageProps) {

  const { slug } = await params;

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  const { count: acceptedCount } = await supabase
    .from("applications")
    .select("id", { count: "exact", head: true })
    .eq("event_id", event?.id)
    .eq("status", "accepted");

  const { data: organizerProfile } = event?.organizer_id
    ? await supabase.from("profiles").select("id, full_name, avatar_url, organizer_verified").eq("id", event.organizer_id).single()
    : { data: null };

  const isFull = event ? (acceptedCount || 0) >= (event.marshals_needed || 0) : false;

  if (!event) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 text-zinc-900">
        Événement introuvable
      </main>
    );
  }

  const imageUrl = event.image_url && event.image_url.length > 0 ? event.image_url : null;

  const formattedDate = event.event_date
    ? formatDateRange(event.event_date, event.event_end_date)
    : "Date à confirmer";

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.event_date,
    endDate: event.event_end_date || event.event_date,
    location: {
      "@type": "Place",
      name: event.location || event.title,
      address: { "@type": "PostalAddress", addressCountry: event.country || "FR" },
    },
    description: event.briefing || `Événement ${event.discipline || "motorsport"} — Postulez comme commissaire.`,
    image: imageUrl,
    organizer: { "@type": "Organization", name: "TrackMarshal", url: "https://www.trackmarshal.app" },
    url: `https://www.trackmarshal.app/events/${slug}`,
  };

  return (
    <main className="min-h-screen overflow-hidden bg-zinc-50 text-zinc-900">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />

      <PublicNavbar />

      {/* Hero section — keep dark overlay on the photo background */}
      <section className="relative min-h-[100svh] overflow-hidden">

        {imageUrl ? (
          <>
            <Image src={imageUrl} alt={event.title} fill priority className="object-cover" />
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
        )}

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

            <h1 className="max-w-6xl text-5xl font-black uppercase leading-[0.9] tracking-[-0.04em] text-white sm:text-6xl md:text-7xl lg:text-[120px]">

              {event.title}

            </h1>

            <div className="mt-10 grid gap-4 sm:mt-14 sm:flex sm:flex-wrap sm:gap-5">

              <div className="rounded-3xl border border-white/10 bg-black/40 px-6 py-5 backdrop-blur-2xl sm:px-7 sm:py-6">

                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 sm:text-xs">
                  Circuit / Lieu
                </p>

                <p className="mt-3 text-xl font-bold text-white sm:text-2xl">
                  {event.location}
                </p>

              </div>

              <div className="rounded-3xl border border-white/10 bg-black/40 px-6 py-5 backdrop-blur-2xl sm:px-7 sm:py-6">

                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 sm:text-xs">
                  Date
                </p>

                <p className="mt-3 text-xl font-bold text-white sm:text-2xl">
                  {formattedDate}
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Content section — light */}
      <section className="relative z-20 mx-auto max-w-[1600px] px-5 py-14 sm:px-8 sm:py-24">

        <Suspense>
          <InviteBanner />
        </Suspense>

        <div className="grid gap-8 lg:grid-cols-[1.5fr_420px] lg:gap-10">

          <div className="space-y-8 sm:space-y-10">

            <div className="overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-sm sm:rounded-[40px]">

              <div className="border-b border-zinc-200 p-6 sm:p-8">

                <p className="text-xs uppercase tracking-[0.25em] text-[#FF5A1F] sm:text-sm sm:tracking-[0.3em]">

                  Présentation de l'Événement

                </p>

              </div>

              <div className="p-6 sm:p-10">

                <p className="whitespace-pre-wrap text-base leading-relaxed text-zinc-600 sm:text-lg lg:text-xl">

                  {event.briefing || "Aucune description disponible."}

                </p>

              </div>

            </div>

            <div className="grid gap-6 md:grid-cols-2 md:gap-10">

              <div className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm sm:rounded-[40px] sm:p-10">

                <p className="text-xs uppercase tracking-[0.25em] text-[#FF5A1F] sm:text-sm sm:tracking-[0.3em]">
                  Hébergement
                </p>

                <p className="mt-6 text-base leading-relaxed text-zinc-600 sm:mt-8 sm:text-lg">
                  {event.hotel ? (event.hotel_detail || "Hébergement inclus") : "Non inclus"}
                </p>

              </div>

              <div className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm sm:rounded-[40px] sm:p-10">

                <p className="text-xs uppercase tracking-[0.25em] text-[#FF5A1F] sm:text-sm sm:tracking-[0.3em]">
                  Repas
                </p>

                <p className="mt-6 text-base leading-relaxed text-zinc-600 sm:mt-8 sm:text-lg">
                  {event.repas ? (event.repas_type || "Repas fournis") : "Non inclus"}
                </p>

              </div>

              <div className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm sm:rounded-[40px] sm:p-10">

                <p className="text-xs uppercase tracking-[0.25em] text-[#FF5A1F] sm:text-sm sm:tracking-[0.3em]">
                  Pass Accompagnant
                </p>

                <p className="mt-6 text-base leading-relaxed text-zinc-600 sm:mt-8 sm:text-lg">
                  {event.pass_accompagnant
                    ? `${event.pass_accompagnant_count || 1} pass accompagnant${(event.pass_accompagnant_count || 1) > 1 ? "s" : ""} inclus`
                    : "Non inclus"}
                </p>

              </div>

              <div className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm sm:rounded-[40px] sm:p-10">

                <p className="text-xs uppercase tracking-[0.25em] text-[#FF5A1F] sm:text-sm sm:tracking-[0.3em]">
                  Défraiement
                </p>

                <p className="mt-6 text-base leading-relaxed text-zinc-600 sm:mt-8 sm:text-lg">
                  {event.defraiement
                    ? (event.defraiement_amount || "Inclus (détails à confirmer)")
                    : "Non prévu"}
                </p>

              </div>

            </div>

            <div className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm sm:rounded-[40px] sm:p-10">

              <p className="text-xs uppercase tracking-[0.25em] text-[#FF5A1F] sm:text-sm sm:tracking-[0.3em]">
                Planning de l'Événement
              </p>

              <div className="mt-6 whitespace-pre-wrap text-base leading-relaxed text-zinc-600 sm:mt-8 sm:text-lg">
                {event.schedule || "Planning à communiquer."}
              </div>

            </div>

          </div>

          <div>

            <div className="mb-3 flex justify-end">
              <ShareButton title={event.title} slug={event.slug} />
            </div>

            <div className="top-10 overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-sm lg:sticky lg:rounded-[40px]">

              <div className="border-b border-zinc-200 p-6 sm:p-8">

                <p className="text-xs uppercase tracking-[0.25em] text-[#FF5A1F] sm:text-sm sm:tracking-[0.3em]">

                  Contact Organisateur

                </p>

                {organizerProfile && (
                  <a
                    href={`/organizer/${organizerProfile.id}`}
                    className="mt-4 flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 transition hover:border-[#FF5A1F]/40 hover:bg-[#FF5A1F]/5"
                  >
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-zinc-200">
                      {organizerProfile.avatar_url ? (
                        <img src={organizerProfile.avatar_url} className="h-full w-full object-cover" alt="" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-black text-[#FF5A1F]">
                          {organizerProfile.full_name?.charAt(0) || "O"}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-bold text-zinc-900">{organizerProfile.full_name}</p>
                      {organizerProfile.organizer_verified && (
                        <p className="text-xs text-green-600 font-medium">✔ Vérifié</p>
                      )}
                    </div>
                  </a>
                )}

              </div>

              <div className="p-6 sm:p-10">

                <p className="break-words text-lg text-zinc-700 sm:text-xl">

                  {event.organizer_contact || "Aucun contact disponible"}

                </p>

                <EventCounter
                  eventId={event.id}
                  marshalsNeeded={event.marshals_needed}
                  eventDiscipline={event.discipline}
                  staffRoles={event.staff_roles}
                />

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Bouton postuler fixe en bas sur mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-white/90 p-4 backdrop-blur-xl lg:hidden">
        <LiveApplyButton eventId={event.id} marshalsNeeded={event.marshals_needed} eventDiscipline={event.discipline} />
      </div>

      <div className="h-20 lg:hidden" />

      <PublicFooter />

    </main>
  );
}

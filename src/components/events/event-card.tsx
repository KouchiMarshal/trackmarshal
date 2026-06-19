import Image from "next/image";
import Link from "next/link";
import { formatDateRange } from "@/lib/formatDate";

type EventCardProps = {
  event: any;
};

export default function EventCard({
  event,
}: EventCardProps) {

  const imageUrl =
    event.image_url && event.image_url.length > 0
      ? event.image_url
      : "https://images.unsplash.com/photo-1541773367336-d14e5f0d8d2f?q=80&w=2070&auto=format&fit=crop";

  const formattedDate = formatDateRange(event.event_date, event.event_end_date);

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group block"
    >

      <div className="relative overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:border-[#FF5A1F]/40 hover:shadow-md sm:rounded-[40px]">

        <div className="relative h-[520px] overflow-hidden sm:h-[620px]">

          <Image
            src={imageUrl}
            alt={event.title}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />

          <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2 sm:left-7 sm:top-7 sm:gap-3">

            <div className="rounded-full bg-[#FF5A1F] px-4 py-2 shadow-lg sm:px-5 sm:py-3">

              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white sm:text-xs sm:tracking-[0.2em]">

                {event.discipline || "Motorsport"}

              </p>

            </div>

            <div className="rounded-full border border-white/10 bg-black/50 px-4 py-2 backdrop-blur-xl sm:px-5 sm:py-3">

              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white sm:text-xs sm:tracking-[0.2em]">

                Inscriptions Ouvertes

              </p>

            </div>

          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">

            <div className="rounded-[28px] border border-white/10 bg-black/60 p-5 backdrop-blur-2xl sm:rounded-[36px] sm:p-8">

              <div>

                <p className="text-xs uppercase tracking-[0.2em] text-zinc-300 sm:text-sm sm:tracking-[0.25em]">

                  {event.country || "France"}

                </p>

                <h2 className="mt-3 text-3xl font-black leading-none text-white sm:mt-4 sm:text-5xl">

                  {event.title}

                </h2>

                <p className="mt-4 line-clamp-3 max-w-xl text-sm leading-relaxed text-zinc-300 sm:mt-5 sm:text-base">

                  {event.briefing
                    ? event.briefing.slice(0, 110) + "..."
                    : "Découvrez les informations de l'événement et rejoignez les équipes commissaires."}

                </p>

              </div>

              <div className="mt-6 grid grid-cols-1 gap-5 border-t border-white/10 pt-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 sm:pt-6">

                <div>

                  <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-400 sm:text-[11px] sm:tracking-[0.2em]">

                    Circuit / Lieu

                  </p>

                  <p className="mt-2 text-base font-semibold text-white sm:mt-3 sm:text-lg">

                    {event.location}

                  </p>

                </div>

                <div>

                  <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-400 sm:text-[11px] sm:tracking-[0.2em]">

                    Date

                  </p>

                  <p className="mt-2 text-base font-semibold text-white sm:mt-3 sm:text-lg">

                    {formattedDate}

                  </p>

                </div>

              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5 sm:mt-8 sm:pt-6">

                <div className="flex items-center gap-2 sm:gap-3">

                  <div className="h-2 w-2 rounded-full bg-[#FF5A1F] sm:h-3 sm:w-3" />

                  <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-300 sm:text-sm sm:tracking-[0.2em]">

                    TrackMarshal France

                  </p>

                </div>

                <div className="flex items-center gap-2 text-[#FF5A1F] sm:gap-3">

                  <span className="text-sm font-black sm:text-lg">

                    Voir

                  </span>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 transition duration-300 group-hover:translate-x-1 sm:h-6 sm:w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </Link>
  );
}

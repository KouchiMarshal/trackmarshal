"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  CalendarDays,
  Heart,
  MapPin,
  Search,
  Users,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";
import { formatDate } from "@/lib/formatDate";
import { SkeletonEventCard } from "@/components/ui/skeleton";
import { useFavorites } from "@/hooks/useFavorites";

export default function EventsPage() {

  const [events, setEvents] =
    useState<any[]>([]);

  const [filteredEvents, setFilteredEvents] =
    useState<any[]>([]);

  const [search, setSearch] =
    useState("");

  const [disciplineFilter, setDisciplineFilter] =
    useState("");

  const [countryFilter, setCountryFilter] =
    useState("");

  const [dateFilter, setDateFilter] =
    useState<"upcoming" | "all" | "past">("upcoming");

  const [countries, setCountries] =
    useState<string[]>([]);

  const [loading, setLoading] =
    useState(true);

  const { toggle, isFavorite } = useFavorites();

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    const now = new Date();
    const filtered = events.filter((event) => {
      const matchSearch =
        event.title?.toLowerCase().includes(search.toLowerCase()) ||
        event.location?.toLowerCase().includes(search.toLowerCase());
      const matchDiscipline =
        !disciplineFilter || event.discipline === disciplineFilter;
      const matchCountry =
        !countryFilter || event.country === countryFilter;
      const eventDate = new Date(event.event_date);
      const matchDate =
        dateFilter === "all" ||
        (dateFilter === "upcoming" && eventDate >= now) ||
        (dateFilter === "past" && eventDate < now);
      return matchSearch && matchDiscipline && matchCountry && matchDate;
    });
    setFilteredEvents(filtered);
  }, [search, disciplineFilter, countryFilter, dateFilter, events]);

  async function loadEvents() {

    const { data } =
      await supabase
        .from("events")
        .select("*")
        .order("event_date", {
          ascending: true,
        });

    const eventsData = data || [];
    setEvents(eventsData);

    const uniqueCountries = [...new Set(eventsData.map((e: any) => e.country).filter(Boolean))] as string[];
    setCountries(uniqueCountries.sort());

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <PublicNavbar />

      <section className="relative overflow-hidden pt-32 lg:pt-40">

        <div className="absolute inset-0">

          <img
            src="https://images.unsplash.com/photo-1541773367336-d14e1d89924f?q=80&w=2070&auto=format&fit=crop"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/85" />

        </div>

        <div className="absolute left-0 top-0 h-[350px] w-[350px] rounded-full bg-[#FF5A1F]/10 blur-[120px] lg:h-[700px] lg:w-[700px] lg:blur-[220px]" />

        <div className="relative z-10 mx-auto max-w-[1600px] px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">

          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F] sm:text-sm">

            Événements Motorsport

          </p>

          <h1 className="mt-6 text-5xl font-black leading-[0.92] tracking-[-0.05em] sm:text-6xl lg:text-[8rem]">

            Trouvez votre
            <br />

            prochain
            <br />

            événement.

          </h1>

          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-zinc-300 lg:text-2xl">

            Découvrez les événements publiés
            par les organisateurs motorsport
            et postulez directement.

          </p>

          <div className="mt-10 max-w-2xl">

            <div className="flex h-16 items-center gap-4 rounded-[24px] border border-white/10 bg-white/[0.04] px-6 backdrop-blur-xl">

              <Search
                size={22}
                className="text-[#FF5A1F]"
              />

              <input
                type="text"
                placeholder="Rechercher un événement, une ville..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="w-full bg-transparent text-white outline-none placeholder:text-zinc-500"
              />

            </div>

            <div className="mt-5 space-y-2">
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center text-[10px] font-bold uppercase tracking-widest text-zinc-600 pr-1">Auto</span>
                {["Rallye", "Circuit", "Karting", "Drift", "Endurance"].map((disc) => (
                  <button
                    key={disc}
                    onClick={() => setDisciplineFilter(disciplineFilter === disc ? "" : disc)}
                    className={`rounded-full px-4 py-1.5 text-sm font-bold uppercase tracking-[0.15em] transition ${
                      disciplineFilter === disc
                        ? "bg-[#FF5A1F] text-white"
                        : "border border-white/10 bg-white/[0.04] text-zinc-400 hover:border-[#FF5A1F]/40 hover:text-white"
                    }`}
                  >
                    {disc}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center text-[10px] font-bold uppercase tracking-widest text-zinc-600 pr-1">Moto</span>
                {["Moto Cross", "Enduro", "Trial", "Road Racing", "Supermoto", "Rallye Moto"].map((disc) => (
                  <button
                    key={disc}
                    onClick={() => setDisciplineFilter(disciplineFilter === disc ? "" : disc)}
                    className={`rounded-full px-4 py-1.5 text-sm font-bold uppercase tracking-[0.15em] transition ${
                      disciplineFilter === disc
                        ? "bg-[#FF5A1F] text-white"
                        : "border border-white/10 bg-white/[0.04] text-zinc-400 hover:border-[#FF5A1F]/40 hover:text-white"
                    }`}
                  >
                    {disc}
                  </button>
                ))}
              </div>
              {disciplineFilter && (
                <button onClick={() => setDisciplineFilter("")} className="text-xs text-zinc-500 hover:text-white transition">
                  ✕ Effacer le filtre
                </button>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <div className="flex overflow-hidden rounded-2xl border border-white/10">
                {(["upcoming", "all", "past"] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDateFilter(d)}
                    className={`px-5 py-2 text-sm font-bold transition ${
                      dateFilter === d ? "bg-[#FF5A1F] text-white" : "bg-white/[0.04] text-zinc-400 hover:text-white"
                    }`}
                  >
                    {d === "upcoming" ? "À venir" : d === "all" ? "Tous" : "Passés"}
                  </button>
                ))}
              </div>

              {countries.length > 0 && (
                <select
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-2 text-sm font-bold text-zinc-400 outline-none focus:border-[#FF5A1F]"
                >
                  <option value="">Tous les pays</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              )}

              {(disciplineFilter || countryFilter || dateFilter !== "upcoming") && (
                <button
                  onClick={() => { setDisciplineFilter(""); setCountryFilter(""); setDateFilter("upcoming"); setSearch(""); }}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-2 text-sm font-bold text-zinc-400 hover:text-red-400 transition"
                >
                  Réinitialiser
                </button>
              )}
            </div>

          </div>

        </div>

      </section>

      <section className="bg-black py-10 lg:py-20">

        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">

          {loading && (
            <div className="grid gap-6 xl:grid-cols-2">
              {[1, 2, 3, 4].map((i) => <SkeletonEventCard key={i} />)}
            </div>
          )}

          <div className="grid gap-6 xl:grid-cols-2">

            {filteredEvents.map((event) => (

              <div
                key={event.slug}
                className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-xl transition hover:border-[#FF5A1F]/30"
              >

                <div className="relative h-[260px]">
                  <img
                    src={
                      event.image_url ||
                      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop"
                    }
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <button
                    onClick={(e) => { e.preventDefault(); toggle(event.slug); }}
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition hover:scale-110"
                  >
                    <Heart size={18} className={isFavorite(event.slug) ? "fill-[#FF5A1F] text-[#FF5A1F]" : "text-white"} />
                  </button>
                  <div className="absolute bottom-0 left-0 p-6">
                    <div className="rounded-full bg-[#FF5A1F] px-4 py-2 text-xs font-black uppercase tracking-[0.15em]">
                      Recrutement ouvert
                    </div>
                  </div>
                </div>

                <div className="p-6 lg:p-8">

                  <h2 className="text-3xl font-black lg:text-5xl">

                    {event.title}

                  </h2>

                  <div className="mt-8 space-y-4 text-zinc-300">

                    <div className="flex items-center gap-3">

                      <MapPin
                        size={18}
                      />

                      <p>

                        {
                          event.location ||
                          "Lieu non renseigné"
                        }

                      </p>

                    </div>

                    <div className="flex items-center gap-3">

                      <CalendarDays
                        size={18}
                      />

                      <p>
                        {formatDate(event.event_date)}
                      </p>

                    </div>

                    <div className="flex items-center gap-3">

                      <Users
                        size={18}
                      />

                      <p>

                        {
                          event.marshals_needed ||
                          0
                        } commissaires recherchés

                      </p>

                    </div>

                  </div>

                  <div className="mt-8">

                    <Link
                      href={`/events/${event.slug}`}
                      className="flex h-14 items-center justify-center rounded-2xl bg-[#FF5A1F] px-8 font-bold transition hover:scale-[1.01]"
                    >

                      Voir l’événement

                    </Link>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      <PublicFooter />

    </main>
  );
}
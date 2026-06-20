"use client";

import Link from "next/link";
import Image from "next/image";

import {
  useEffect,
  useState,
} from "react";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Heart,
  LayoutGrid,
  MapPin,
  Search,
  Users,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";
import { formatDateRange } from "@/lib/formatDate";
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

  const [view, setView] =
    useState<"grid" | "calendar">("grid");

  const [calendarMonth, setCalendarMonth] =
    useState(() => { const d = new Date(); d.setDate(1); return d; });

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
      const eventEnd = event.event_end_date ? new Date(event.event_end_date) : new Date(event.event_date);
      const matchDate =
        dateFilter === "all" ||
        (dateFilter === "upcoming" && eventEnd >= now) ||
        (dateFilter === "past" && eventEnd < now);
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
    <main className="min-h-screen bg-zinc-50 text-zinc-900">

      <PublicNavbar />

      <section className="relative overflow-hidden bg-zinc-50 pt-32 lg:pt-40">

        <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-[#FF5A1F]/6 blur-[160px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-[1600px] px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">

          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F] sm:text-sm">
            Événements Motorsport
          </p>

          <h1 className="mt-6 text-5xl font-black leading-[0.92] tracking-[-0.05em] text-zinc-900 sm:text-6xl lg:text-[8rem]">
            Trouvez votre<br />
            prochain<br />
            événement.
          </h1>

          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-zinc-600 lg:text-2xl">
            Découvrez les événements publiés par les organisateurs motorsport et postulez directement.
          </p>

          <div className="mt-10 max-w-2xl">

            <div className="flex h-16 items-center gap-4 rounded-[24px] border border-zinc-300 bg-white px-6 shadow-sm">
              <Search size={22} className="text-[#FF5A1F]" />
              <input
                type="text"
                placeholder="Rechercher un événement, une ville..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-zinc-900 outline-none placeholder:text-zinc-400"
              />
            </div>

            <div className="mt-5 space-y-2">
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center text-[10px] font-bold uppercase tracking-widest text-zinc-400 pr-1">Auto</span>
                {["Rallye", "Circuit", "Karting", "Drift", "Endurance", "Course de côtes", "Slalom", "Montée de démonstration", "Montée historique"].map((disc) => (
                  <button
                    key={disc}
                    onClick={() => setDisciplineFilter(disciplineFilter === disc ? "" : disc)}
                    className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
                      disciplineFilter === disc
                        ? "bg-[#FF5A1F] text-white"
                        : "border border-zinc-300 bg-white text-zinc-600 hover:border-[#FF5A1F]/50 hover:text-[#FF5A1F]"
                    }`}
                  >
                    {disc}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center text-[10px] font-bold uppercase tracking-widest text-zinc-400 pr-1">Moto</span>
                {["Moto Cross", "Enduro", "Trial", "Road Racing", "Supermoto", "Rallye Moto"].map((disc) => (
                  <button
                    key={disc}
                    onClick={() => setDisciplineFilter(disciplineFilter === disc ? "" : disc)}
                    className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
                      disciplineFilter === disc
                        ? "bg-[#FF5A1F] text-white"
                        : "border border-zinc-300 bg-white text-zinc-600 hover:border-[#FF5A1F]/50 hover:text-[#FF5A1F]"
                    }`}
                  >
                    {disc}
                  </button>
                ))}
              </div>
              {disciplineFilter && (
                <button onClick={() => setDisciplineFilter("")} className="text-xs text-zinc-500 hover:text-[#FF5A1F] transition">
                  ✕ Effacer le filtre
                </button>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <div className="flex overflow-hidden rounded-2xl border border-zinc-300 bg-white shadow-sm">
                {(["upcoming", "all", "past"] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDateFilter(d)}
                    className={`px-5 py-2 text-sm font-bold transition ${
                      dateFilter === d ? "bg-[#FF5A1F] text-white" : "text-zinc-600 hover:text-[#FF5A1F]"
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
                  className="rounded-2xl border border-zinc-300 bg-white px-5 py-2 text-sm font-bold text-zinc-700 outline-none focus:border-[#FF5A1F]"
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
                  className="rounded-2xl border border-zinc-300 bg-white px-5 py-2 text-sm font-bold text-zinc-600 hover:text-red-500 transition"
                >
                  Réinitialiser
                </button>
              )}
            </div>

          </div>

        </div>

      </section>

      <section className="bg-zinc-50 py-10 lg:py-20">

        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">

          <div className="mb-6 flex items-center justify-end gap-2">
            <button
              onClick={() => setView("grid")}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${view === "grid" ? "border-[#FF5A1F] bg-[#FF5A1F]/10 text-[#FF5A1F]" : "border-zinc-300 bg-white text-zinc-500 hover:text-[#FF5A1F]"}`}
              title="Vue grille"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setView("calendar")}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${view === "calendar" ? "border-[#FF5A1F] bg-[#FF5A1F]/10 text-[#FF5A1F]" : "border-zinc-300 bg-white text-zinc-500 hover:text-[#FF5A1F]"}`}
              title="Vue calendrier"
            >
              <CalendarDays size={18} />
            </button>
          </div>

          {loading && (
            <div className="grid gap-6 lg:grid-cols-2">
              {[1, 2, 3, 4].map((i) => <SkeletonEventCard key={i} />)}
            </div>
          )}

          {!loading && view === "calendar" && (
            <CalendarView
              events={filteredEvents}
              month={calendarMonth}
              onPrev={() => setCalendarMonth((m) => { const d = new Date(m); d.setMonth(d.getMonth() - 1); return d; })}
              onNext={() => setCalendarMonth((m) => { const d = new Date(m); d.setMonth(d.getMonth() + 1); return d; })}
            />
          )}

          <div className={view === "calendar" ? "hidden" : "grid gap-6 lg:grid-cols-2"}>

            {filteredEvents.map((event) => (

              <div
                key={event.slug}
                className="overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-sm transition hover:border-[#FF5A1F]/40 hover:shadow-md"
              >

                <div className="relative h-[260px]">
                  <Image
                    src={
                      event.image_url ||
                      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop"
                    }
                    alt={event.title || "Événement motorsport"}
                    fill
                    className="object-cover"
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

                  <h2 className="text-3xl font-black text-zinc-900 lg:text-5xl">

                    {event.title}

                  </h2>

                  <div className="mt-8 space-y-4 text-zinc-600">

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
                        {formatDateRange(event.event_date, event.event_end_date)}
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
                      className="flex h-14 items-center justify-center rounded-2xl bg-[#FF5A1F] px-8 font-bold text-white transition hover:scale-[1.01]"
                    >

                      Voir l'événement

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

function CalendarView({
  events,
  month,
  onPrev,
  onNext,
}: {
  events: any[];
  month: Date;
  onPrev: () => void;
  onNext: () => void;
}) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();

  const monthLabel = month.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  const firstDay = new Date(year, monthIndex, 1).getDay();
  const startOffset = (firstDay === 0 ? 6 : firstDay - 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  function eventsOnDay(day: number) {
    return events.filter((e) => {
      const start = new Date(e.event_date);
      const end = e.event_end_date ? new Date(e.event_end_date) : start;
      const d = new Date(year, monthIndex, day);
      return d >= new Date(start.getFullYear(), start.getMonth(), start.getDate()) &&
             d <= new Date(end.getFullYear(), end.getMonth(), end.getDate());
    });
  }

  const today = new Date();

  return (
    <div className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <button onClick={onPrev} className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-300 text-zinc-600 hover:text-[#FF5A1F] transition">
          <ChevronLeft size={18} />
        </button>
        <h2 className="text-xl font-black capitalize text-zinc-900">{monthLabel}</h2>
        <button onClick={onNext} className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-300 text-zinc-600 hover:text-[#FF5A1F] transition">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-200">
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
          <div key={d} className="bg-zinc-50 py-2 text-center text-xs font-bold uppercase tracking-widest text-zinc-400">{d}</div>
        ))}
        {cells.map((day, i) => {
          const dayEvents = day ? eventsOnDay(day) : [];
          const isToday = day !== null && today.getDate() === day && today.getMonth() === monthIndex && today.getFullYear() === year;
          return (
            <div
              key={i}
              className={`min-h-[80px] bg-white p-2 ${!day ? "bg-zinc-50/50" : ""}`}
            >
              {day && (
                <>
                  <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${isToday ? "bg-[#FF5A1F] text-white" : "text-zinc-700"}`}>
                    {day}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {dayEvents.slice(0, 2).map((e) => (
                      <Link
                        key={e.slug}
                        href={`/events/${e.slug}`}
                        className="block truncate rounded bg-[#FF5A1F]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#FF5A1F] hover:bg-[#FF5A1F]/20 transition"
                      >
                        {e.title}
                      </Link>
                    ))}
                    {dayEvents.length > 2 && (
                      <p className="text-[10px] font-bold text-zinc-400">+{dayEvents.length - 2}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

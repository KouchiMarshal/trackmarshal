"use client";

import { useMemo, useState } from "react";

import EventCard from "@/components/events/event-card";

type EventsListProps = {
  events: any[];
};

export default function EventsList({
  events,
}: EventsListProps) {

  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("Tous");

  const categories = [
    "Tous",
    "Formule",
    "Endurance",
    "Rallye",
    "Karting",
  ];

  const filteredEvents = useMemo(() => {

    return events.filter((event) => {

      const matchesSearch =
        event.title
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        event.location
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        event.country
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        event.discipline
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "Tous"
          ? true
          : event.discipline
              ?.toLowerCase()
              .includes(
                selectedCategory.toLowerCase()
              );

      return (
        matchesSearch && matchesCategory
      );
    });

  }, [events, search, selectedCategory]);

  return (
    <>
      <div className="mt-16 grid gap-4 lg:grid-cols-[1fr_220px]">

        <div className="flex h-16 items-center rounded-2xl border border-white/10 bg-white/5 px-6 backdrop-blur-xl">

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Rechercher un événement, un circuit..."
            className="w-full bg-transparent text-base text-white outline-none placeholder:text-zinc-500 sm:text-lg"
          />

        </div>

        <button className="h-16 rounded-2xl bg-[#FF5A1F] px-10 text-base font-black transition duration-300 hover:scale-[1.02] hover:opacity-90 sm:text-lg">

          {filteredEvents.length} résultat{filteredEvents.length > 1 ? "s" : ""}

        </button>

      </div>

      <div className="mt-16 flex flex-wrap items-center gap-4">

        {categories.map((category) => (

          <button
            key={category}
            onClick={() =>
              setSelectedCategory(category)
            }
            className={`rounded-full px-6 py-3 text-sm uppercase tracking-[0.15em] transition ${
              selectedCategory === category
                ? "bg-[#FF5A1F] font-bold text-white"
                : "border border-white/10 bg-white/5 text-zinc-300 backdrop-blur-xl hover:bg-white/10"
            }`}
          >

            {category}

          </button>

        ))}

      </div>

      <div className="mb-14 mt-16 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <p className="text-sm uppercase tracking-[0.3em] text-[#FF5A1F]">

            Marketplace Motorsport

          </p>

          <h2 className="mt-4 text-4xl font-black sm:text-5xl">

            Événements Disponibles

          </h2>

        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm uppercase tracking-[0.2em] text-zinc-400 backdrop-blur-xl">

          {filteredEvents.length} événement{filteredEvents.length > 1 ? "s" : ""} actif{filteredEvents.length > 1 ? "s" : ""}

        </div>

      </div>

      {filteredEvents.length === 0 && (

        <div className="rounded-[32px] border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">

          <p className="text-2xl font-black text-white">

            Aucun événement trouvé

          </p>

          <p className="mt-4 text-zinc-400">

            Essayez une autre recherche ou catégorie.

          </p>

        </div>

      )}

      <div className="grid gap-8 xl:grid-cols-3">

        {filteredEvents.map((event: any) => (

          <EventCard
            key={event.id}
            event={event}
          />

        ))}

      </div>

    </>
  );
}
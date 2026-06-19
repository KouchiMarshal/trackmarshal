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
    "Circuit",
    "Rallye",
    "Karting",
    "Endurance",
    "Drift",
    "Course de côtes",
    "Slalom",
    "Montée de démonstration",
    "Montée historique",
    "Moto Cross",
    "Enduro",
    "Road Racing",
    "Trial",
    "Supermoto",
    "Rallye Moto",
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
          : event.discipline?.toLowerCase() === selectedCategory.toLowerCase();

      return (
        matchesSearch && matchesCategory
      );
    });

  }, [events, search, selectedCategory]);

  return (
    <>
      <div className="mt-16 grid gap-4 lg:grid-cols-[1fr_220px]">

        <div className="flex h-16 items-center rounded-2xl border border-zinc-300 bg-white px-6 shadow-sm">

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Rechercher un événement, un circuit..."
            className="w-full bg-transparent text-base text-zinc-900 outline-none placeholder:text-zinc-400 sm:text-lg"
          />

        </div>

        <button className="h-16 rounded-2xl bg-[#FF5A1F] px-10 text-base font-black text-white transition duration-300 hover:scale-[1.02] hover:opacity-90 sm:text-lg">

          {filteredEvents.length} résultat{filteredEvents.length > 1 ? "s" : ""}

        </button>

      </div>

      <div className="mt-16 flex flex-wrap items-center gap-3">

        {categories.map((category) => (

          <button
            key={category}
            onClick={() =>
              setSelectedCategory(category)
            }
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
              selectedCategory === category
                ? "bg-[#FF5A1F] font-bold text-white"
                : "border border-zinc-300 bg-white text-zinc-600 hover:border-[#FF5A1F]/50 hover:text-[#FF5A1F]"
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

        <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-4 text-sm uppercase tracking-[0.2em] text-zinc-500 shadow-sm">

          {filteredEvents.length} événement{filteredEvents.length > 1 ? "s" : ""} actif{filteredEvents.length > 1 ? "s" : ""}

        </div>

      </div>

      {filteredEvents.length === 0 && (

        <div className="rounded-[32px] border border-zinc-200 bg-white p-10 text-center shadow-sm">

          <p className="text-2xl font-black text-zinc-900">

            Aucun événement trouvé

          </p>

          <p className="mt-4 text-zinc-500">

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
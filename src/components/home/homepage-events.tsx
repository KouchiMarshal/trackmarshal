import { supabase } from "@/lib/supabase";

import EventCard from "@/components/events/event-card";

export default async function HomepageEvents() {

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  return (
    <section className="relative overflow-hidden py-32">

      <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-[#FF5A1F]/10 blur-[180px]" />

      <div className="relative z-20 mx-auto max-w-[1600px] px-8">

        <div className="mb-20 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">

          <div className="max-w-4xl">

            <p className="text-sm uppercase tracking-[0.35em] text-[#FF5A1F]">

              Upcoming Events

            </p>

            <h2 className="mt-6 text-6xl font-black leading-[0.95] tracking-[-0.04em] md:text-8xl">

              Endurance.
              <br />

              Passion.
              <br />

              Community.

            </h2>

            <p className="mt-8 max-w-2xl text-xl leading-relaxed text-zinc-400">

              Join the world’s most iconic endurance races and connect with motorsport organizers worldwide.

            </p>

          </div>

          <button className="rounded-2xl border border-white/10 bg-white/5 px-8 py-5 text-lg backdrop-blur-xl transition hover:bg-white/10">

            View all events

          </button>

        </div>

        <div className="grid gap-8 xl:grid-cols-3">

          {events?.map((event: any) => (

            <EventCard
              key={event.id}
              event={event}
            />

          ))}

        </div>

      </div>

    </section>
  );
}
import EventCard from "@/components/events/event-card";
import { getEvents } from "@/lib/events";

export default async function UpcomingEvents() {

  const events = await getEvents();

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">

      <div className="mb-12 flex items-center justify-between">

        <div>
          <p className="mb-2 text-sm uppercase tracking-[0.3em] text-[#FF5A1F]">
            Upcoming Events
          </p>

          <h2 className="text-4xl font-black">
            Motorsport Events Worldwide
          </h2>
        </div>

      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

        {events.map((event) => (
          <EventCard
            key={event.id}
            title={event.title}
            location={`${event.location}, ${event.country}`}
            date={event.event_date}
            discipline={event.discipline}
            image={event.image_url}
            slug={event.slug}
          />
        ))}

      </div>

    </section>
  );
}
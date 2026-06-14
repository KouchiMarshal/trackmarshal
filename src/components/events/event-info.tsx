import ApplyButton from "./apply-button";

type EventInfoProps = {
  eventId: string;
};

export default function EventInfo({
  eventId,
}: EventInfoProps) {
  return (
    <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-3">

      <div className="lg:col-span-2">

        <h2 className="text-3xl font-black">
          Event Information
        </h2>

        <div className="mt-10 space-y-8">

          <div>
            <h3 className="mb-2 text-xl font-bold">
              Schedule
            </h3>

            <p className="text-zinc-400">
              Friday briefing at 18:00.
              Track positions distributed Saturday morning.
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-xl font-bold">
              Benefits
            </h3>

            <p className="text-zinc-400">
              Meals provided during the event.
              Official marshal equipment included.
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-xl font-bold">
              Expenses
            </h3>

            <p className="text-zinc-400">
              Fuel compensation available depending on travel distance.
            </p>
          </div>

        </div>
      </div>

      <div>

        <div className="rounded-3xl border border-[#232326] bg-[#131315] p-6">

          <h3 className="text-2xl font-black">
            Organizer Contact
          </h3>

          <div className="mt-6 space-y-4 text-zinc-300">

            <p>
              contact@trackmarshal.app
            </p>

            <p>
              Registration closes 10 July 2026
            </p>

          </div>

          <ApplyButton eventId={eventId} />

        </div>

      </div>

    </section>
  );
}
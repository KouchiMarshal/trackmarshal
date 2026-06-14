type EventRowProps = {
  title: string;
  location: string;
  date: string;
  discipline: string;
  image: string;
};

export default function EventRow({
  title,
  location,
  date,
  discipline,
  image,
}: EventRowProps) {
  return (
    <div className="group grid grid-cols-12 overflow-hidden rounded-3xl border border-white/10 bg-[#0D0D0D] transition hover:border-[#FF5A1F]/40">

      <div className="relative col-span-3 overflow-hidden">

        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />

        <div className="absolute left-4 top-4 rounded-full bg-[#FF5A1F] px-3 py-1 text-xs font-bold uppercase tracking-wide">

          {discipline}

        </div>

      </div>

      <div className="col-span-9 flex items-center justify-between p-6">

        <div>

          <h3 className="text-3xl font-black">
            {title}
          </h3>

          <p className="mt-2 text-zinc-400">
            {location}
          </p>

        </div>

        <div>

          <p className="text-sm text-zinc-500">
            Event Dates
          </p>

          <p className="mt-2 text-lg font-medium">
            {date}
          </p>

        </div>

        <div>

          <p className="text-sm text-green-400">
            Registration Open
          </p>

          <p className="mt-2 text-zinc-300">
            Until July 10
          </p>

        </div>

        <button className="rounded-xl border border-[#FF5A1F]/30 bg-[#FF5A1F]/10 px-6 py-3 font-bold text-[#FF5A1F] transition hover:bg-[#FF5A1F] hover:text-white">

          View Details

        </button>

      </div>

    </div>
  );
}
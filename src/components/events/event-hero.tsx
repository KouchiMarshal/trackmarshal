type EventHeroProps = {
  title: string;
  location: string;
  date: string;
  image: string;
  discipline: string;
};

export default function EventHero({
  title,
  location,
  date,
  image,
  discipline,
}: EventHeroProps) {
  return (
    <section className="relative h-[70vh] overflow-hidden">

      <img
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/70" />

      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-16">

        <div className="mb-5 inline-flex w-fit rounded-full bg-[#FF5A1F] px-4 py-2 text-sm font-bold uppercase tracking-wide">
          {discipline}
        </div>

        <h1 className="max-w-4xl text-6xl font-black leading-none">
          {title}
        </h1>

        <div className="mt-6 flex flex-wrap gap-6 text-zinc-300">
          <span>{location}</span>
          <span>{date}</span>
        </div>

      </div>
    </section>
  );
}
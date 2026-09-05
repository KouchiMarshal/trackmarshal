import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";
import { supabaseAdmin } from "@/lib/supabase-admin";

type Props = { params: Promise<{ slug: string }> };

function fmtDate(d?: string | null) {
  if (!d) return null;
  return new Date(d + "T00:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

async function getEvent(slug: string) {
  try {
    const { data } = await supabaseAdmin.from("calendar_events").select("*").eq("slug", slug).single();
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ev = await getEvent(slug);
  if (!ev) return { title: "Épreuve introuvable" };
  const place = [ev.location, ev.region].filter(Boolean).join(", ");
  const desc = ev.summary || `${ev.discipline || "Épreuve motorsport"}${place ? ` à ${place}` : ""} — dates, infos et inscription. Comment participer et lien officiel.`;
  return {
    title: `${ev.title} — dates, infos & inscription`,
    description: desc.slice(0, 160),
    alternates: { canonical: `/calendrier/${slug}` },
    openGraph: { title: `${ev.title} | TrackMarshal`, description: desc.slice(0, 160), url: `https://www.trackmarshal.app/calendrier/${slug}`, type: "article" },
  };
}

export default async function EpreuvePage({ params }: Props) {
  const { slug } = await params;
  const ev = await getEvent(slug);
  if (!ev) notFound();

  const startLabel = fmtDate(ev.start_date);
  const endLabel = ev.end_date && ev.end_date !== ev.start_date ? fmtDate(ev.end_date) : null;
  const place = [ev.location, ev.region].filter(Boolean).join(", ");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: ev.title,
    startDate: ev.start_date,
    ...(ev.end_date ? { endDate: ev.end_date } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    ...(place ? { location: { "@type": "Place", name: place, address: place } } : {}),
    ...(ev.summary ? { description: ev.summary } : {}),
    ...(ev.official_url ? { url: ev.official_url } : {}),
  };

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <PublicNavbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative overflow-hidden bg-zinc-50 pt-32 lg:pt-40">
        <div className="absolute right-0 top-0 h-[360px] w-[360px] rounded-full bg-[#FF5A1F]/6 blur-[120px] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-[900px] px-4 pb-8 sm:px-6 lg:px-8">
          <Link href="/calendrier" className="text-sm font-bold text-zinc-500 transition hover:text-[#FF5A1F]">← Calendrier</Link>
          {ev.discipline && (
            <span className="ml-3 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">{ev.discipline}</span>
          )}
          <h1 className="mt-5 text-4xl font-black leading-[1] tracking-[-0.03em] text-zinc-900 sm:text-5xl lg:text-6xl">{ev.title}</h1>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-lg text-zinc-600">
            {startLabel && <span>📅 {startLabel}{endLabel ? ` → ${endLabel}` : ""}</span>}
            {place && <span>📍 {place}</span>}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-[900px] px-4 sm:px-6 lg:px-8">

          {ev.summary && (
            <p className="text-lg leading-relaxed text-zinc-700">{ev.summary}</p>
          )}

          {/* Comment s'inscrire */}
          <div className="mt-10 rounded-[28px] border border-zinc-200 bg-zinc-50 p-6 lg:p-8">
            <h2 className="text-2xl font-black text-zinc-900">Comment s&apos;inscrire / participer</h2>

            {ev.registration_steps ? (
              <div className="mt-4 space-y-3 leading-relaxed text-zinc-700">
                {String(ev.registration_steps).split("\n").filter((l: string) => l.trim()).map((line: string, i: number) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            ) : (
              <div className="mt-4 space-y-3 leading-relaxed text-zinc-700">
                <p>Les inscriptions et engagements se font sur le <strong className="text-zinc-900">site officiel de l&apos;épreuve</strong>, qui fait foi : règlement particulier, formulaire d&apos;engagement, tarifs et dates limites y sont détaillés.</p>
                <p>Pour <strong className="text-zinc-900">officier comme commissaire</strong> sur cette épreuve, rapprochez-vous de l&apos;organisateur ou de l&apos;ASA / du club organisateur. Besoin de te former d&apos;abord ? Vois <Link href="/devenir-commissaire/devenir-commissaire" className="font-bold text-[#FF5A1F] hover:underline">comment devenir commissaire</Link>.</p>
              </div>
            )}

            {ev.official_url && (
              <a
                href={ev.official_url}
                target="_blank"
                rel="noopener nofollow"
                className="mt-6 inline-flex h-14 items-center rounded-2xl bg-[#FF5A1F] px-8 font-black text-white transition hover:scale-[1.02]"
              >
                S&apos;inscrire sur le site officiel →
              </a>
            )}
          </div>

          <p className="mt-8 text-xs leading-relaxed text-zinc-400">
            Informations fournies à titre indicatif et centralisées par TrackMarshal. Le site officiel de
            l&apos;épreuve et l&apos;organisateur font foi pour les inscriptions, dates et conditions.
          </p>

          <div className="mt-8">
            <Link href="/calendrier" className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-6 py-3 font-bold text-zinc-700 transition hover:bg-zinc-50">
              ← Voir tout le calendrier
            </Link>
          </div>

        </div>
      </section>

      <PublicFooter />
    </main>
  );
}

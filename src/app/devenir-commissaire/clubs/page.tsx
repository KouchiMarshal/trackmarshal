import type { Metadata } from "next";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";
import ClubsClient from "@/components/clubs/ClubsClient";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const metadata: Metadata = {
  title: "Où s'inscrire comme commissaire : circuits, clubs & ASA",
  description:
    "Le répertoire des circuits, organisateurs, ASA (auto) et clubs FFM (moto) où s'inscrire comme commissaire de piste : démarches, contacts et liens officiels, par région.",
  keywords: [
    "s'inscrire commissaire de piste",
    "devenir commissaire circuit",
    "ASA sport automobile",
    "club moto commissaire",
    "inscription commissaire Monaco Paul Ricard Le Mans",
  ],
  alternates: { canonical: "/devenir-commissaire/clubs" },
  openGraph: {
    title: "Où s'inscrire comme commissaire de piste | TrackMarshal",
    description: "Circuits, organisateurs, ASA et clubs : démarches et contacts pour s'inscrire comme commissaire, par région.",
    url: "https://www.trackmarshal.app/devenir-commissaire/clubs",
  },
};

export const dynamic = "force-dynamic";

// Balisage structuré : aide les moteurs et les IA à extraire proprement la
// procédure d'inscription (HowTo) et les questions fréquentes (FAQPage).
const PAGE_URL = "https://www.trackmarshal.app/devenir-commissaire/clubs";

// Source unique : sert à la fois à l'affichage (section visible) et au balisage
// FAQPage. Les deux DOIVENT rester synchronisés (exigence Google/IA).
const clubsFaqs = [
  {
    q: "Comment devenir commissaire de piste en France ?",
    a: "Il faut se rapprocher d'une ASA (Association Sportive Automobile) en auto ou d'un club FFM en moto, suivre une formation initiale de commissaire, obtenir une licence de commissaire, puis officier sur des épreuves. L'activité est bénévole et ouverte à tous, sans expérience préalable.",
  },
  {
    q: "Faut-il une licence pour être commissaire de piste ?",
    a: "Oui. Une licence de commissaire est nécessaire : licence FFSA pour le sport automobile, licence FFM pour la moto. Elle est généralement délivrée après la formation initiale, via la ligue régionale ou l'ASA / le club.",
  },
  {
    q: "Être commissaire de piste, est-ce payant ?",
    a: "L'activité est bénévole. La licence peut avoir un coût modéré selon la fédération et la ligue ; de nombreux clubs la prennent en charge et défraient les commissaires (repas, parfois déplacement).",
  },
  {
    q: "Où trouver une ASA ou un club pour s'inscrire ?",
    a: "Le répertoire ci-dessus recense les ASA, clubs, circuits et organisateurs par région, avec les démarches et les contacts officiels lorsqu'ils sont publics. Filtre par région pour trouver l'interlocuteur le plus proche.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Espace pédagogique", item: "https://www.trackmarshal.app/devenir-commissaire" },
        { "@type": "ListItem", position: 2, name: "Où s'inscrire", item: PAGE_URL },
      ],
    },
    {
      "@type": "HowTo",
      name: "Comment s'inscrire comme commissaire de piste en France",
      description:
        "Les étapes pour devenir commissaire de piste (marshal) en sport automobile ou moto : trouver une association, se former, obtenir sa licence et officier.",
      inLanguage: "fr",
      totalTime: "P1D",
      estimatedCost: { "@type": "MonetaryAmount", currency: "EUR", value: "0" },
      step: [
        { "@type": "HowToStep", position: 1, name: "Trouver une ASA ou un club", text: "Repérer une Association Sportive Automobile (ASA, en auto) ou un club affilié FFM (en moto) près de chez soi. C'est le point d'entrée pour se licencier et se former." },
        { "@type": "HowToStep", position: 2, name: "Contacter l'association", text: "Prendre contact avec l'ASA ou le club pour connaître les prochaines sessions de formation de commissaire et les modalités d'inscription." },
        { "@type": "HowToStep", position: 3, name: "Suivre la formation initiale", text: "Participer à la formation initiale de commissaire de piste, généralement organisée par la ligue régionale FFSA (auto) ou par la FFM (moto). Elle dure souvent une journée." },
        { "@type": "HowToStep", position: 4, name: "Obtenir sa licence", text: "Obtenir la licence de commissaire (licence FFSA en auto, licence FFM en moto), délivrée après la formation." },
        { "@type": "HowToStep", position: 5, name: "Officier sur ses premières épreuves", text: "Rejoindre des épreuves comme commissaire, aux côtés de commissaires expérimentés, pour consolider ses acquis sur le terrain." },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: clubsFaqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default async function ClubsPage() {
  let clubs: any[] = [];
  try {
    const { data } = await supabaseAdmin.from("clubs").select("*").order("region", { ascending: true }).order("name", { ascending: true });
    clubs = data || [];
  } catch {
    clubs = [];
  }

  return (
    <main className="min-h-screen overflow-hidden bg-zinc-50 text-zinc-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <PublicNavbar />

      <section className="relative overflow-hidden bg-zinc-50 pt-32 lg:pt-40">
        <div className="absolute right-0 top-0 h-[380px] w-[380px] rounded-full bg-[#FF5A1F]/6 blur-[120px] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-[1000px] px-4 pb-6 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F] sm:text-sm">Passer à l'action</p>
          <h1 className="mt-6 text-4xl font-black leading-[0.95] tracking-[-0.04em] text-zinc-900 sm:text-5xl lg:text-6xl">
            Où s'inscrire<br /><span className="text-[#FF5A1F]">comme commissaire</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600">
            Circuits, organisateurs, ASA (auto) et clubs FFM (moto) : retrouve <strong className="text-zinc-900">où et comment
            t'inscrire</strong> pour officier, avec les démarches et les liens officiels. Filtre par région et trouve le tien.
          </p>
          <a href="/grands-prix-f1" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#FF5A1F] hover:underline">
            🏎️ Tu vises la Formule 1 ? Vois le guide « Commissaire en F1 » →
          </a>
        </div>
      </section>

      <ClubsClient clubs={clubs} />

      {/* FAQ visible — synchronisée avec le balisage FAQPage ci-dessus */}
      <section className="border-t border-zinc-200 bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[900px] px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#FF5A1F]">Questions fréquentes</p>
          <h2 className="mt-4 text-3xl font-black text-zinc-900 lg:text-4xl">S&apos;inscrire comme commissaire</h2>
          <div className="mt-8 space-y-3">
            {clubsFaqs.map((faq) => (
              <details key={faq.q} className="group rounded-2xl border border-zinc-200 bg-zinc-50 p-5 open:bg-white">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-black text-zinc-900">
                  {faq.q}
                  <span className="shrink-0 text-[#FF5A1F] transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 leading-relaxed text-zinc-600">{faq.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-6 text-sm text-zinc-500">
            Tu débutes ?{" "}
            <a href="/devenir-commissaire/devenir-commissaire" className="font-bold text-[#FF5A1F] hover:underline">
              Vois le guide complet « Comment devenir commissaire de piste » →
            </a>
          </p>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}

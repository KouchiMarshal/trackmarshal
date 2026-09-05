import type { Metadata } from "next";
import Link from "next/link";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";

export const metadata: Metadata = {
  title: "Devenir partenaire — TrackMarshal",
  description:
    "Touchez une audience 100% motorsport en France : passionnés et futurs commissaires de piste. Affiliation, contenu sponsorisé, partenariats clubs et écoles. Parlons-en.",
  alternates: { canonical: "/partenaires" },
  openGraph: {
    title: "Devenir partenaire de TrackMarshal",
    description:
      "Une audience qualifiée de passionnés et de commissaires motorsport. Affiliation, visibilité, partenariats clubs et écoles.",
    url: "https://www.trackmarshal.app/partenaires",
  },
};

// 👉 À METTRE À JOUR avec tes vrais chiffres (Google Analytics) : ils sont
// l'argument principal pour convaincre un partenaire.
const STATS = [
  { value: "100%", label: "Audience motorsport" },
  { value: "France", label: "Cible géographique" },
  { value: "Auto · Moto", label: "Toutes disciplines" },
  { value: "Gratuit", label: "Accès sans inscription" },
];

const OFFERS = [
  {
    emoji: "🛒",
    title: "Affiliation équipement",
    text: "Vous vendez du matériel commissaire (combinaisons, gants, extincteurs, radios) ? Vos produits, recommandés au bon endroit, auprès d'une audience prête à s'équiper.",
  },
  {
    emoji: "📣",
    title: "Contenu sponsorisé",
    text: "Un article, un guide ou une vidéo mettant en avant votre marque, intégré nativement au contenu pédagogique du site.",
  },
  {
    emoji: "🎯",
    title: "Visibilité ciblée",
    text: "Encarts et mises en avant sur les pages à forte audience (drapeaux, quiz, guide de l'équipement). Une exposition auprès d'une niche impossible à toucher ailleurs.",
  },
  {
    emoji: "🏁",
    title: "Clubs, ASA & écoles",
    text: "Utilisez l'espace pédagogique pour former vos commissaires, avec une mise en avant réciproque. Un partenariat gagnant-gagnant, au service de la communauté.",
  },
  {
    emoji: "🤝",
    title: "Circuits & organisateurs",
    text: "Faites connaître vos épreuves et votre structure auprès des passionnés qui se forment pour officier.",
  },
  {
    emoji: "🔄",
    title: "Médias & créateurs",
    text: "Chaînes, podcasts, magazines motorsport : échangeons de la visibilité pour faire grandir nos audiences respectives.",
  },
];

export default function PartenairesPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-zinc-50 text-zinc-900">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-zinc-50 pt-32 lg:pt-40">
        <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-[#FF5A1F]/6 blur-[120px] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-[1600px] px-4 pb-16 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F] sm:text-sm">Partenariats</p>
          <h1 className="mt-6 text-5xl font-black leading-[0.92] tracking-[-0.05em] text-zinc-900 sm:text-6xl lg:text-[6rem]">
            Touchez une audience<br />
            <span className="text-[#FF5A1F]">100% motorsport.</span>
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-zinc-600 lg:text-2xl">
            TrackMarshal réunit des passionnés et de futurs commissaires de piste partout en France.
            Une niche précise, engagée et difficile à atteindre ailleurs — exactement votre cible.
          </p>
          <Link
            href="/contact"
            className="mt-10 inline-flex h-14 items-center rounded-2xl bg-[#FF5A1F] px-8 font-black text-white transition hover:scale-[1.02] lg:h-16 lg:text-lg"
          >
            Discuter d'un partenariat
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-6 text-center">
                <p className="text-4xl font-black text-[#FF5A1F]">{s.value}</p>
                <p className="mt-2 text-sm font-bold uppercase tracking-wide text-zinc-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pourquoi */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-20 lg:py-28">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.35em] text-[#FF5A1F]">Pourquoi TrackMarshal</p>
            <h2 className="mt-6 text-4xl font-black lg:text-5xl">Une niche qualifiée, pas de l'audience générique.</h2>
            <p className="mt-6 text-lg leading-relaxed text-zinc-600">
              Nos visiteurs viennent apprendre le métier de commissaire de piste : ils s'équipent,
              passent leur licence, suivent le sport auto et moto de près. Pour une marque
              spécialisée, mille visiteurs ultra-ciblés valent bien plus que cent mille visiteurs
              anonymes. C'est là toute la valeur d'un contenu de référence sur une communauté précise.
            </p>
          </div>
        </div>
      </section>

      {/* Offres */}
      <section className="border-t border-zinc-200 bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-xs uppercase tracking-[0.35em] text-[#FF5A1F]">Les formats</p>
            <h2 className="mt-4 text-4xl font-black lg:text-5xl">Comment on peut travailler ensemble</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {OFFERS.map((o) => (
              <div key={o.title} className="rounded-[28px] border border-zinc-200 bg-zinc-50 p-6">
                <span className="text-4xl">{o.emoji}</span>
                <h3 className="mt-4 text-lg font-black text-zinc-900">{o.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{o.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Indépendance + CTA */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-20 lg:py-28">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.35em] text-[#FF5A1F]">Parlons-en</p>
            <h2 className="mt-6 text-4xl font-black lg:text-5xl">Un projet à votre image ?</h2>
            <p className="mt-6 text-lg leading-relaxed text-zinc-600">
              TrackMarshal est un projet indépendant, sans lien officiel avec la FFSA ou la FFM.
              Chaque partenariat se construit sur mesure. Présentez-nous votre marque et vos objectifs —
              on trouvera le bon format.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex h-14 items-center rounded-2xl bg-[#FF5A1F] px-8 font-black text-white transition hover:scale-[1.02] lg:h-16 lg:text-lg"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}

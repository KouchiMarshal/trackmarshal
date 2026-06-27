import type { Metadata } from "next";
import Link from "next/link";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";

export const metadata: Metadata = {
  title: "Espace pédagogique — Devenir commissaire motorsport",
  description:
    "Toutes les ressources pour devenir commissaire de piste : drapeaux, procédures FFSA/FFM, licences, équipement, rôles et quiz interactifs. Gratuit et accessible à tous.",
  alternates: { canonical: "/devenir-commissaire" },
  openGraph: {
    title: "Espace pédagogique — Devenir commissaire motorsport",
    description:
      "Drapeaux, procédures, licences, équipement, rôles — toutes les ressources pour devenir commissaire de piste motorsport en France.",
    url: "https://www.trackmarshal.app/devenir-commissaire",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Devenir commissaire motorsport — TrackMarshal" }],
  },
};

const sections = [
  {
    href: "/devenir-commissaire/devenir-commissaire",
    emoji: "📋",
    title: "Devenir commissaire",
    description: "Les étapes pour obtenir votre licence FFSA ou FFM, les types de licences, le rôle de l'ASA et les formations disponibles.",
    badge: "Guide complet",
    color: "border-[#FF5A1F]/30 bg-orange-50 hover:border-[#FF5A1F]/50 hover:bg-orange-100",
    badgeColor: "bg-orange-100 text-orange-700",
  },
  {
    href: "/devenir-commissaire/drapeaux",
    emoji: "🚩",
    title: "Les drapeaux",
    description: "Signification de chaque drapeau utilisé en compétition motorsport — couleurs, situations, réactions attendues du commissaire.",
    badge: "Lexique visuel",
    color: "border-blue-200 bg-blue-50 hover:border-blue-300 hover:bg-blue-100",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  {
    href: "/devenir-commissaire/procedures",
    emoji: "📡",
    title: "Les procédures",
    description: "Safety Car, FCY, Code 60, drapeau rouge, départ arrêté, évacuation d'un véhicule — le déroulé étape par étape.",
    badge: "Sécurité",
    color: "border-red-200 bg-red-50 hover:border-red-300 hover:bg-red-100",
    badgeColor: "bg-red-100 text-red-700",
  },
  {
    href: "/devenir-commissaire/roles",
    emoji: "👥",
    title: "Les rôles",
    description: "Directeur de course, chef de poste, commissaire de piste, délégué technique — qui fait quoi sur une épreuve.",
    badge: "Organisation",
    color: "border-purple-200 bg-purple-50 hover:border-purple-300 hover:bg-purple-100",
    badgeColor: "bg-purple-100 text-purple-700",
  },
  {
    href: "/devenir-commissaire/epreuves",
    emoji: "🏁",
    title: "Les types d'épreuves",
    description: "Circuit, rallye, course de côte, karting, autocross, drift — les spécificités de chaque discipline pour le commissaire.",
    badge: "Disciplines",
    color: "border-green-200 bg-green-50 hover:border-green-300 hover:bg-green-100",
    badgeColor: "bg-green-100 text-green-700",
  },
  {
    href: "/devenir-commissaire/equipement",
    emoji: "🦺",
    title: "L'équipement",
    description: "Combinaison en coton, chaussures, gants, sifflet, coupe-sangle — tout ce qu'il faut prévoir avant de se présenter sur une épreuve.",
    badge: "Matériel",
    color: "border-yellow-200 bg-yellow-50 hover:border-yellow-300 hover:bg-yellow-100",
    badgeColor: "bg-yellow-100 text-yellow-700",
  },
  {
    href: "/devenir-commissaire/lexique",
    emoji: "📖",
    title: "Lexique motorsport",
    description: "Safety Car, FCY, Code 60, parc fermé, scratch, steward... Le glossaire de A à Z des termes indispensables pour comprendre les briefings.",
    badge: "Glossaire",
    color: "border-cyan-200 bg-cyan-50 hover:border-cyan-300 hover:bg-cyan-100",
    badgeColor: "bg-cyan-100 text-cyan-700",
  },
  {
    href: "/devenir-commissaire/quiz",
    emoji: "🎯",
    title: "Quiz",
    description: "Testez vos connaissances sur les drapeaux, les procédures de sécurité et le règlement sportif avant de passer votre licence.",
    badge: "Entraînement",
    color: "border-pink-200 bg-pink-50 hover:border-pink-300 hover:bg-pink-100",
    badgeColor: "bg-pink-100 text-pink-700",
  },
];

export default function ApprendrePage() {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <PublicNavbar />

      <section className="relative overflow-hidden pt-36 pb-24">
        <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-10">

          <div className="text-center mb-16 lg:mb-20">
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#FF5A1F]">
              Espace pédagogique
            </p>
            <h1 className="mt-6 text-5xl font-black leading-tight text-zinc-900 lg:text-7xl">
              Apprendre le<br />
              <span className="text-[#FF5A1F]">commissariat</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600 lg:text-xl">
              Tout ce qu'il faut savoir pour devenir commissaire de piste motorsport —
              licences, drapeaux, procédures, rôles, équipement et entraînement.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {sections.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className={`group rounded-[28px] border p-6 transition lg:p-8 ${s.color}`}
              >
                <span className="text-4xl">{s.emoji}</span>
                <div className="mt-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] ${s.badgeColor}`}>
                    {s.badge}
                  </span>
                </div>
                <h2 className="mt-3 text-lg font-black text-zinc-900 lg:text-xl">{s.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{s.description}</p>
                <p className="mt-6 text-sm font-bold text-zinc-600 transition group-hover:text-zinc-900">
                  Commencer →
                </p>
              </Link>
            ))}
          </div>

        </div>
      </section>

      <PublicFooter />
    </main>
  );
}

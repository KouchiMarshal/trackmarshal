import Link from "next/link";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";

const sections = [
  {
    href: "/apprendre/devenir-commissaire",
    emoji: "📋",
    title: "Devenir commissaire",
    description: "Les étapes pour obtenir votre licence FFSA ou FFM, les types de licences, le rôle de l'ASA et les formations disponibles.",
    badge: "Guide complet",
    color: "border-[#FF5A1F]/30 bg-[#FF5A1F]/5 hover:border-[#FF5A1F]/50 hover:bg-[#FF5A1F]/10",
    badgeColor: "bg-[#FF5A1F]/20 text-[#FF5A1F]",
  },
  {
    href: "/apprendre/drapeaux",
    emoji: "🚩",
    title: "Les drapeaux",
    description: "Signification de chaque drapeau utilisé en compétition motorsport — couleurs, situations, réactions attendues du commissaire.",
    badge: "Lexique visuel",
    color: "border-blue-500/30 bg-blue-500/5 hover:border-blue-500/50 hover:bg-blue-500/10",
    badgeColor: "bg-blue-500/20 text-blue-400",
  },
  {
    href: "/apprendre/quiz",
    emoji: "🎯",
    title: "Quiz",
    description: "Testez vos connaissances sur les drapeaux, les procédures de sécurité et le règlement sportif avant de passer votre licence.",
    badge: "Entraînement",
    color: "border-green-500/30 bg-green-500/5 hover:border-green-500/50 hover:bg-green-500/10",
    badgeColor: "bg-green-500/20 text-green-400",
  },
];

export default function ApprendrePage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <PublicNavbar />

      <section className="relative overflow-hidden pt-36 pb-24">
        <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-[#FF5A1F]/8 blur-[180px] pointer-events-none" />
        <div className="absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[150px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-10">

          <div className="text-center mb-16 lg:mb-20">
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#FF5A1F]">
              Espace pédagogique
            </p>
            <h1 className="mt-6 text-5xl font-black leading-tight lg:text-7xl">
              Apprendre le<br />
              <span className="text-[#FF5A1F]">commissariat</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400 lg:text-xl">
              Tout ce qu'il faut savoir pour devenir commissaire de piste motorsport —
              licences, drapeaux, procédures et entraînement.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {sections.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className={`group rounded-[32px] border p-8 transition lg:p-10 ${s.color}`}
              >
                <span className="text-5xl">{s.emoji}</span>
                <div className="mt-6">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] ${s.badgeColor}`}>
                    {s.badge}
                  </span>
                </div>
                <h2 className="mt-4 text-2xl font-black lg:text-3xl">{s.title}</h2>
                <p className="mt-3 leading-relaxed text-zinc-400">{s.description}</p>
                <p className="mt-8 text-sm font-bold text-zinc-300 group-hover:text-white transition">
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

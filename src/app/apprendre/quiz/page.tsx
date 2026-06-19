import Link from "next/link";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";

const quizzes = [
  {
    href: "/apprendre/quiz/drapeaux",
    emoji: "🚩",
    title: "Les drapeaux",
    description: "Signaux, couleurs, modes de présentation et spécificités par discipline.",
    questions: 20,
    difficulty: "Fondamental",
    difficultyColor: "bg-[#FF5A1F]/20 text-[#FF5A1F]",
    color: "border-[#FF5A1F]/30 hover:border-[#FF5A1F]/50",
  },
  {
    href: "/apprendre/quiz/procedures",
    emoji: "📡",
    title: "Les procédures",
    description: "Safety Car, FCY, Code 60, drapeau rouge, départs — les neutralisations étape par étape.",
    questions: 20,
    difficulty: "Intermédiaire",
    difficultyColor: "bg-red-500/20 text-red-400",
    color: "border-red-500/30 hover:border-red-500/50",
  },
  {
    href: "/apprendre/quiz/formation",
    emoji: "📋",
    title: "Licences & institutions",
    description: "FFSA, FIA, FFM, ASA, ENCOC, EICOB, tenue obligatoire, équipement et rôles.",
    questions: 20,
    difficulty: "Fondamental",
    difficultyColor: "bg-purple-500/20 text-purple-400",
    color: "border-purple-500/30 hover:border-purple-500/50",
  },
  {
    href: "/apprendre/quiz/epreuves",
    emoji: "🏁",
    title: "Épreuves & rôles",
    description: "Circuit, rallye, côte, karting, autocross, drift — spécificités de chaque discipline et lexique.",
    questions: 20,
    difficulty: "Intermédiaire",
    difficultyColor: "bg-green-500/20 text-green-400",
    color: "border-green-500/30 hover:border-green-500/50",
  },
  {
    href: "/apprendre/quiz/situations",
    emoji: "⚡",
    title: "Situations & réflexes",
    description: "Que faites-vous si… ? Des scénarios concrets de bord de piste pour tester vos réflexes.",
    questions: 20,
    difficulty: "Avancé",
    difficultyColor: "bg-yellow-500/20 text-yellow-400",
    color: "border-yellow-500/30 hover:border-yellow-500/50",
  },
  {
    href: "/apprendre/quiz/rallye",
    emoji: "🌲",
    title: "Spécial rallye",
    description: "ES, reconnaissances, pace notes, road book, liaisons, organisation des spéciales et signaux propres au rallye.",
    questions: 20,
    difficulty: "Intermédiaire",
    difficultyColor: "bg-emerald-500/20 text-emerald-400",
    color: "border-emerald-500/30 hover:border-emerald-500/50",
  },
  {
    href: "/apprendre/quiz/securite",
    emoji: "🛡️",
    title: "Sécurité & interventions",
    description: "Approche d'un véhicule accidenté, incendie, extraction, coupe-sangle, zone de sécurité, gestes qui sauvent.",
    questions: 20,
    difficulty: "Avancé",
    difficultyColor: "bg-orange-500/20 text-orange-400",
    color: "border-orange-500/30 hover:border-orange-500/50",
  },
  {
    href: "/apprendre/quiz/general",
    emoji: "🎯",
    title: "Quiz général",
    description: "Drapeaux, procédures, licences, institutions, épreuves, lexique — tout le programme en un seul quiz.",
    questions: 40,
    difficulty: "Complet",
    difficultyColor: "bg-blue-500/20 text-blue-400",
    color: "border-blue-500/30 hover:border-blue-500/50",
  },
];

export default function QuizPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <PublicNavbar />

      <section className="relative pt-36 pb-24">
        <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-[#FF5A1F]/5 blur-[160px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-[1000px] px-6 lg:px-10">

          <div className="mb-4">
            <Link href="/apprendre" className="text-sm text-zinc-500 transition hover:text-white">
              ← Espace pédagogique
            </Link>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#FF5A1F]">Entraînement</p>
          <h1 className="mt-4 text-4xl font-black lg:text-6xl">Quiz</h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-zinc-400">
            Testez vos connaissances avant de passer votre licence ou pour maintenir vos réflexes sur le terrain.
          </p>

          <div className="mt-12 space-y-4">
            {quizzes.map((q) => (
              <Link
                key={q.href}
                href={q.href}
                className={`group flex flex-col gap-4 rounded-[28px] border bg-white/[0.02] p-6 transition hover:bg-white/[0.04] sm:flex-row sm:items-center lg:p-8 ${q.color}`}
              >
                <span className="text-5xl shrink-0">{q.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-black">{q.title}</h2>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${q.difficultyColor}`}>{q.difficulty}</span>
                  </div>
                  <p className="mt-1 text-zinc-400">{q.description}</p>
                  <p className="mt-2 text-sm text-zinc-500">{q.questions} questions</p>
                </div>
                <span className="shrink-0 rounded-2xl bg-[#FF5A1F] px-5 py-3 text-sm font-bold transition group-hover:opacity-90 text-center sm:self-center">
                  Commencer →
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-16 rounded-[24px] border border-white/10 bg-white/[0.02] p-6 lg:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Parcours recommandé</p>
            <p className="mt-3 leading-relaxed text-zinc-400">
              Commencez par <span className="font-bold text-white">Drapeaux</span> et <span className="font-bold text-white">Licences & institutions</span> pour les bases,
              puis <span className="font-bold text-white">Procédures</span>, <span className="font-bold text-white">Épreuves & rôles</span> et <span className="font-bold text-white">Rallye</span> pour approfondir.
              Les quiz <span className="font-bold text-white">Situations & réflexes</span> et <span className="font-bold text-white">Sécurité</span> sont les plus proches des questions
              posées lors des épreuves de licence. Finissez par le <span className="font-bold text-white">Quiz général (40Q)</span> pour valider l&apos;ensemble.
            </p>
          </div>

        </div>
      </section>

      <PublicFooter />
    </main>
  );
}

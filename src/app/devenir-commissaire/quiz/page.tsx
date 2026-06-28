import Link from "next/link";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";

const quizzes = [
  {
    href: "/devenir-commissaire/quiz/drapeaux",
    emoji: "🚩",
    title: "Les drapeaux",
    description: "Signaux, couleurs, modes de présentation et spécificités par discipline.",
    questions: 20,
    difficulty: "Fondamental",
    difficultyColor: "bg-orange-100 text-orange-700",
    color: "border-[#FF5A1F]/30 hover:border-[#FF5A1F]/50",
  },
  {
    href: "/devenir-commissaire/quiz/procedures",
    emoji: "📡",
    title: "Les procédures",
    description: "Safety Car, FCY, Code 60, drapeau rouge, départs — les neutralisations étape par étape.",
    questions: 20,
    difficulty: "Intermédiaire",
    difficultyColor: "bg-red-100 text-red-700",
    color: "border-red-200 hover:border-red-300",
  },
  {
    href: "/devenir-commissaire/quiz/formation",
    emoji: "📋",
    title: "Licences & institutions",
    description: "FFSA, FIA, FFM, ASA, ENCOC, EICOB, tenue obligatoire, équipement et rôles.",
    questions: 20,
    difficulty: "Fondamental",
    difficultyColor: "bg-purple-100 text-purple-700",
    color: "border-purple-200 hover:border-purple-300",
  },
  {
    href: "/devenir-commissaire/quiz/epreuves",
    emoji: "🏁",
    title: "Épreuves & rôles",
    description: "Circuit, rallye, côte, karting, autocross, drift — spécificités de chaque discipline et lexique.",
    questions: 20,
    difficulty: "Intermédiaire",
    difficultyColor: "bg-green-100 text-green-700",
    color: "border-green-200 hover:border-green-300",
  },
  {
    href: "/devenir-commissaire/quiz/situations",
    emoji: "⚡",
    title: "Situations & réflexes",
    description: "Que faites-vous si… ? Des scénarios concrets de bord de piste pour tester vos réflexes.",
    questions: 20,
    difficulty: "Avancé",
    difficultyColor: "bg-yellow-100 text-yellow-700",
    color: "border-yellow-200 hover:border-yellow-300",
  },
  {
    href: "/devenir-commissaire/quiz/rallye",
    emoji: "🌲",
    title: "Spécial rallye",
    description: "ES, reconnaissances, pace notes, road book, liaisons, organisation des spéciales et signaux propres au rallye.",
    questions: 20,
    difficulty: "Intermédiaire",
    difficultyColor: "bg-emerald-100 text-emerald-700",
    color: "border-emerald-200 hover:border-emerald-300",
  },
  {
    href: "/devenir-commissaire/quiz/securite",
    emoji: "🛡️",
    title: "Sécurité & interventions",
    description: "Approche d'un véhicule accidenté, incendie, extraction, coupe-sangle, zone de sécurité, gestes qui sauvent.",
    questions: 20,
    difficulty: "Avancé",
    difficultyColor: "bg-orange-100 text-orange-700",
    color: "border-orange-200 hover:border-orange-300",
  },
  {
    href: "/devenir-commissaire/quiz/general",
    emoji: "🎯",
    title: "Quiz général",
    description: "Drapeaux, procédures, licences, institutions, épreuves, lexique — tout le programme en un seul quiz.",
    questions: 40,
    difficulty: "Complet",
    difficultyColor: "bg-blue-100 text-blue-700",
    color: "border-blue-200 hover:border-blue-300",
  },
];

export default function QuizPage() {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <PublicNavbar />

      <section className="relative pt-36 pb-24">
        <div className="relative z-10 mx-auto max-w-[1000px] px-6 lg:px-10">

          <div className="mb-4">
            <Link href="/devenir-commissaire" className="text-sm text-zinc-500 transition hover:text-zinc-900">
              ← Espace pédagogique
            </Link>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#FF5A1F]">Entraînement</p>
          <h1 className="mt-4 text-4xl font-black text-zinc-900 lg:text-6xl">Quiz</h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-zinc-600">
            Testez vos connaissances avant de passer votre licence ou pour maintenir vos réflexes sur le terrain.
          </p>

          {/* Quiz adaptatif IA — mis en avant */}
          <Link
            href="/devenir-commissaire/quiz/adaptatif"
            className="group mt-12 flex flex-col gap-4 rounded-[28px] border-2 border-[#FF5A1F]/40 bg-gradient-to-br from-orange-50 to-white p-6 shadow-sm transition hover:border-[#FF5A1F]/70 sm:flex-row sm:items-center lg:p-8"
          >
            <span className="text-5xl shrink-0">🤖</span>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-black text-zinc-900">Quiz adaptatif</h2>
                <span className="rounded-full bg-[#FF5A1F] px-3 py-1 text-xs font-bold text-white">Nouveau · IA</span>
              </div>
              <p className="mt-1 text-zinc-600">
                Des questions générées par l&apos;IA qui s&apos;adaptent à tes erreurs : chaque manche cible tes points faibles.
              </p>
              <p className="mt-2 text-sm text-zinc-500">Entraînement personnalisé · illimité</p>
            </div>
            <span className="shrink-0 rounded-2xl bg-[#FF5A1F] px-5 py-3 text-center text-sm font-bold text-white transition group-hover:opacity-90 sm:self-center">
              Commencer →
            </span>
          </Link>

          <div className="mt-4 space-y-4">
            {quizzes.map((q) => (
              <Link
                key={q.href}
                href={q.href}
                className={`group flex flex-col gap-4 rounded-[28px] border bg-white shadow-sm p-6 transition hover:bg-zinc-50 sm:flex-row sm:items-center lg:p-8 ${q.color}`}
              >
                <span className="text-5xl shrink-0">{q.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-black text-zinc-900">{q.title}</h2>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${q.difficultyColor}`}>{q.difficulty}</span>
                  </div>
                  <p className="mt-1 text-zinc-600">{q.description}</p>
                  <p className="mt-2 text-sm text-zinc-500">{q.questions} questions</p>
                </div>
                <span className="shrink-0 rounded-2xl bg-[#FF5A1F] px-5 py-3 text-sm font-bold text-white transition group-hover:opacity-90 text-center sm:self-center">
                  Commencer →
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-16 rounded-[24px] border border-zinc-200 bg-white shadow-sm p-6 lg:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Parcours recommandé</p>
            <p className="mt-3 leading-relaxed text-zinc-600">
              Commencez par <span className="font-bold text-zinc-900">Drapeaux</span> et <span className="font-bold text-zinc-900">Licences & institutions</span> pour les bases,
              puis <span className="font-bold text-zinc-900">Procédures</span>, <span className="font-bold text-zinc-900">Épreuves & rôles</span> et <span className="font-bold text-zinc-900">Rallye</span> pour approfondir.
              Les quiz <span className="font-bold text-zinc-900">Situations & réflexes</span> et <span className="font-bold text-zinc-900">Sécurité</span> sont les plus proches des questions
              posées lors des épreuves de licence. Finissez par le <span className="font-bold text-zinc-900">Quiz général (40Q)</span> pour valider l&apos;ensemble.
            </p>
          </div>

        </div>
      </section>

      <PublicFooter />
    </main>
  );
}

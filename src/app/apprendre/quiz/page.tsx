import Link from "next/link";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";

const quizzes = [
  {
    href: "/apprendre/quiz/drapeaux",
    emoji: "🚩",
    title: "Les drapeaux",
    description: "Identifiez les drapeaux et leur signification. 10 questions pour tester vos réflexes.",
    questions: 10,
    difficulty: "Fondamental",
    difficultyColor: "bg-green-500/20 text-green-400",
    color: "border-[#FF5A1F]/30 hover:border-[#FF5A1F]/50",
  },
];

const comingSoon = [
  { emoji: "⚠️", title: "Procédures de sécurité", description: "Scénarios d'accident, évacuation, intervention médicale.", difficulty: "Intermédiaire" },
  { emoji: "📋", title: "Règlement sportif", description: "Infractions, pénalités, rôle du commissaire en cas de litige.", difficulty: "Avancé" },
  { emoji: "🏎️", title: "Signaux de départ", description: "Procédures de formation grille, départ lancé, Safety Car.", difficulty: "Intermédiaire" },
];

export default function QuizPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <PublicNavbar />

      <section className="relative pt-36 pb-24">
        <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-green-500/5 blur-[160px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-[1000px] px-6 lg:px-10">

          <div className="mb-4">
            <Link href="/apprendre" className="text-sm text-zinc-500 transition hover:text-white">
              ← Espace pédagogique
            </Link>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#FF5A1F]">Entraînement</p>
          <h1 className="mt-4 text-4xl font-black lg:text-6xl">Quiz</h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-zinc-400">
            Testez vos connaissances avant de passer votre licence ou pour maintenir vos réflexes.
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
                <span className="shrink-0 rounded-2xl bg-[#FF5A1F] px-5 py-3 text-sm font-bold transition group-hover:opacity-90">
                  Commencer →
                </span>
              </Link>
            ))}
          </div>

          <h2 className="mt-14 text-xl font-black text-zinc-500">Prochainement</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {comingSoon.map((q) => (
              <div key={q.title} className="rounded-[24px] border border-dashed border-white/10 p-6 opacity-50">
                <span className="text-3xl">{q.emoji}</span>
                <h3 className="mt-3 font-black">{q.title}</h3>
                <p className="mt-1 text-sm text-zinc-500">{q.description}</p>
                <p className="mt-3 text-xs font-bold text-zinc-600 uppercase tracking-[0.15em]">{q.difficulty}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      <PublicFooter />
    </main>
  );
}

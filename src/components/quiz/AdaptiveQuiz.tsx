"use client";

import { useState } from "react";
import Link from "next/link";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";

type GenQuestion = {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  topic: string;
};

const THEMES = [
  "Tout le programme",
  "Les drapeaux",
  "Les procédures et neutralisations",
  "Licences et institutions",
  "Épreuves et rôles",
  "Situations et réflexes",
  "Spécial rallye",
  "Sécurité et interventions",
];

type Phase = "setup" | "loading" | "playing" | "result";

export default function AdaptiveQuiz() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [theme, setTheme] = useState(THEMES[0]);
  const [error, setError] = useState("");

  const [questions, setQuestions] = useState<GenQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);

  // Mémoire adaptative entre les manches.
  const [round, setRound] = useState(0);
  const [weakTopics, setWeakTopics] = useState<string[]>([]);
  const [askedQuestions, setAskedQuestions] = useState<string[]>([]);

  async function generate(opts: { weak: string[]; asked: string[] }) {
    setPhase("loading");
    setError("");
    try {
      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme, count: 5, weakTopics: opts.weak, previousQuestions: opts.asked }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur de génération.");
      const qs: GenQuestion[] = data.questions;
      setQuestions(qs);
      setAnswers(Array(qs.length).fill(null));
      setCurrent(0);
      setSelected(null);
      setAskedQuestions((prev) => [...prev, ...qs.map((q) => q.question)]);
      setPhase("playing");
    } catch (e: any) {
      setError(e?.message || "Une erreur est survenue.");
      setPhase("setup");
    }
  }

  function start() {
    setRound(1);
    setWeakTopics([]);
    setAskedQuestions([]);
    generate({ weak: [], asked: [] });
  }

  function handleSelect(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    const next = [...answers];
    next[current] = idx;
    setAnswers(next);
  }

  function handleNext() {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setSelected(answers[current + 1] ?? null);
    } else {
      // Fin de manche : on collecte les thèmes ratés.
      const missed = questions
        .filter((q, i) => answers[i] !== q.correct)
        .map((q) => q.topic);
      setWeakTopics((prev) => Array.from(new Set([...prev, ...missed])));
      setPhase("result");
    }
  }

  function nextRound() {
    setRound((r) => r + 1);
    generate({ weak: weakTopics, asked: askedQuestions });
  }

  const score = questions.filter((q, i) => answers[i] === q.correct).length;

  // ---- Écran de configuration ----
  if (phase === "setup" || phase === "loading") {
    return (
      <Shell>
        <div className="mb-6">
          <Link href="/devenir-commissaire/quiz" className="text-sm text-zinc-500 transition hover:text-zinc-900">
            ← Retour aux quiz
          </Link>
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#FF5A1F]">Entraînement IA</p>
        <h1 className="mt-4 text-4xl font-black text-zinc-900 lg:text-5xl">Quiz adaptatif</h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-zinc-600">
          Des questions générées par l'IA, qui s'adaptent à tes erreurs : à chaque manche, l'entraînement cible
          tes points faibles pour te faire progresser plus vite.
        </p>

        <div className="mt-10 rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm lg:p-8">
          <label className="text-sm font-bold text-zinc-700">Choisis un thème</label>
          <div className="mt-4 flex flex-wrap gap-2">
            {THEMES.map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                disabled={phase === "loading"}
                className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                  theme === t
                    ? "border-[#FF5A1F] bg-[#FF5A1F] text-white"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {error && <p className="mt-5 rounded-xl bg-red-100 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

          <button
            onClick={start}
            disabled={phase === "loading"}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF5A1F] px-8 py-4 font-bold text-white transition hover:opacity-90 disabled:opacity-60 sm:w-auto"
          >
            {phase === "loading" ? "Génération en cours…" : "Démarrer l'entraînement →"}
          </button>
          <p className="mt-3 text-xs text-zinc-400">
            Questions générées par IA à titre pédagogique — vérifie toujours les règles officielles auprès de la FFSA / FFM.
          </p>
        </div>
      </Shell>
    );
  }

  // ---- Écran de résultat de manche ----
  if (phase === "result") {
    const perfect = score === questions.length;
    return (
      <Shell>
        <div className="rounded-[32px] border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <span className="text-6xl">{perfect ? "🏆" : score / questions.length >= 0.5 ? "👍" : "📚"}</span>
          <h1 className="mt-5 text-3xl font-black text-zinc-900">Manche {round}</h1>
          <p className="mt-2 text-2xl font-black text-[#FF5A1F]">{score} / {questions.length}</p>
          {weakTopics.length > 0 ? (
            <p className="mt-4 text-zinc-600">
              À retravailler : <span className="font-bold text-zinc-900">{weakTopics.join(", ")}</span>.
              La prochaine manche ciblera ces thèmes.
            </p>
          ) : (
            <p className="mt-4 text-zinc-600">Sans faute sur tes points faibles — continue comme ça !</p>
          )}
        </div>

        <div className="mt-8 space-y-3">
          {questions.map((q, i) => {
            const ok = answers[i] === q.correct;
            return (
              <div key={q.id} className={`rounded-[20px] border p-4 ${ok ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"}`}>
                <p className="text-sm font-bold text-zinc-800">{q.question}</p>
                {!ok && (
                  <p className="mt-1 text-sm text-red-700">
                    Ta réponse : {answers[i] !== null ? q.options[answers[i] as number] : "—"}
                  </p>
                )}
                <p className="mt-1 text-sm font-bold text-green-700">Bonne réponse : {q.options[q.correct]}</p>
                {!ok && <p className="mt-2 text-xs leading-relaxed text-zinc-600">{q.explanation}</p>}
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button onClick={nextRound} className="rounded-2xl bg-[#FF5A1F] px-8 py-4 font-bold text-white transition hover:opacity-90">
            {weakTopics.length > 0 ? "Manche suivante (mes points faibles) →" : "Nouvelle manche →"}
          </button>
          <Link href="/devenir-commissaire/quiz" className="rounded-2xl border border-zinc-200 bg-white px-8 py-4 text-center font-bold text-zinc-700 transition hover:bg-zinc-50">
            ← Retour aux quiz
          </Link>
        </div>
      </Shell>
    );
  }

  // ---- Écran de jeu ----
  const q = questions[current];
  const answered = selected !== null;
  return (
    <Shell>
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#FF5A1F]">Manche {round} · {theme}</p>
          <p className="text-sm text-zinc-500">{current + 1} / {questions.length}</p>
        </div>
        <div className="h-1.5 w-full rounded-full bg-zinc-200">
          <div className="h-1.5 rounded-full bg-[#FF5A1F] transition-all duration-300" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
        </div>
      </div>

      <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm lg:p-8">
        <span className="rounded-full bg-orange-100 px-3 py-1 text-[11px] font-bold text-orange-700">{q.topic}</span>
        <h2 className="mt-4 text-xl font-black text-zinc-900 lg:text-2xl">{q.question}</h2>

        <div className="mt-6 space-y-3">
          {q.options.map((option, idx) => {
            let style = "border-zinc-200 bg-white text-zinc-900 hover:border-zinc-400";
            if (answered) {
              if (idx === q.correct) style = "border-green-400 bg-green-100 text-green-800";
              else if (idx === selected) style = "border-red-400 bg-red-100 text-red-800";
              else style = "border-zinc-200 bg-zinc-50 text-zinc-500 opacity-60";
            } else if (idx === selected) {
              style = "border-[#FF5A1F] bg-orange-50 text-zinc-900";
            }
            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={answered}
                className={`w-full rounded-2xl border px-5 py-4 text-left text-sm font-medium transition ${style} ${!answered ? "cursor-pointer" : "cursor-default"}`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className={`mt-5 rounded-2xl border px-4 py-3 ${selected === q.correct ? "border-green-400 bg-green-100" : "border-red-400 bg-red-100"}`}>
            <p className={`text-sm font-bold ${selected === q.correct ? "text-green-700" : "text-red-700"}`}>
              {selected === q.correct ? "✓ Correct !" : "✗ Incorrect"}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-zinc-600">{q.explanation}</p>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleNext}
          disabled={!answered}
          className="rounded-2xl bg-[#FF5A1F] px-6 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
        >
          {current === questions.length - 1 ? "Voir le résultat →" : "Suivant →"}
        </button>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <PublicNavbar />
      <section className="relative pt-36 pb-24">
        <div className="relative z-10 mx-auto max-w-[700px] px-6 lg:px-10">{children}</div>
      </section>
      <PublicFooter />
    </main>
  );
}

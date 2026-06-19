"use client";

import { useState } from "react";
import Link from "next/link";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";

export interface QuizQuestion {
  id: number;
  question: string;
  flagImg?: string;
  flagAlt?: string;
  options: string[];
  correct: number;
  explanation: string;
}

function shuffleQuestion(q: QuizQuestion): QuizQuestion {
  const order = [0, 1, 2, 3].slice(0, q.options.length);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return {
    ...q,
    options: order.map((i) => q.options[i]),
    correct: order.indexOf(q.correct),
  };
}

interface QuizEngineProps {
  title: string;
  questions: QuizQuestion[];
  backHref: string;
  backLabel: string;
  reviewHref?: string;
  reviewLabel?: string;
  glowColor?: string;
}

function getScoreInfo(score: number, total: number) {
  const pct = score / total;
  if (score === total) return { label: "Parfait !", color: "text-green-400", emoji: "🏆" };
  if (pct >= 0.85) return { label: "Excellent !", color: "text-green-400", emoji: "🎯" };
  if (pct >= 0.70) return { label: "Bien joué", color: "text-yellow-400", emoji: "👍" };
  if (pct >= 0.50) return { label: "À retravailler", color: "text-orange-400", emoji: "📚" };
  return { label: "Insuffisant", color: "text-red-400", emoji: "🚩" };
}

export default function QuizEngine({
  title,
  questions,
  backHref,
  backLabel,
  reviewHref,
  reviewLabel,
  glowColor = "bg-green-500/5",
}: QuizEngineProps) {
  const [shuffled] = useState<QuizQuestion[]>(() => questions.map(shuffleQuestion));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [showResult, setShowResult] = useState(false);

  const question = shuffled[current];
  const isAnswered = selected !== null;
  const score = answers.filter((a, i) => a === shuffled[i].correct).length;

  function handleSelect(idx: number) {
    if (isAnswered) return;
    setSelected(idx);
    const next = [...answers];
    next[current] = idx;
    setAnswers(next);
  }

  function handleNext() {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setSelected(answers[current + 1]);
    } else {
      setShowResult(true);
    }
  }

  function handlePrev() {
    if (current > 0) {
      setCurrent(current - 1);
      setSelected(answers[current - 1]);
    }
  }

  function handleRestart() {
    setCurrent(0);
    setSelected(null);
    setAnswers(Array(questions.length).fill(null));
    setShowResult(false);
  }

  if (showResult) {
    const { label, color, emoji } = getScoreInfo(score, questions.length);
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <PublicNavbar />
        <section className="relative pt-36 pb-24">
          <div className={`absolute right-0 top-0 h-[400px] w-[400px] rounded-full ${glowColor} blur-[160px] pointer-events-none`} />
          <div className="relative z-10 mx-auto max-w-[700px] px-6 lg:px-10">

            <div className="text-center">
              <span className="text-7xl">{emoji}</span>
              <h1 className="mt-6 text-4xl font-black lg:text-5xl">{label}</h1>
              <p className={`mt-3 text-2xl font-black ${color}`}>{score} / {questions.length}</p>
              <p className="mt-3 text-zinc-400">
                {score === questions.length
                  ? "Résultat parfait ! Vous maîtrisez totalement ce sujet."
                  : "Relisez les points que vous avez manqués et réessayez."}
              </p>
            </div>

            <div className="mt-12 space-y-4">
              {shuffled.map((q, i) => {
                const userAnswer = answers[i];
                const correct = userAnswer === q.correct;
                return (
                  <div
                    key={q.id}
                    className={`rounded-[24px] border p-5 ${correct ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5"}`}
                  >
                    <div className="flex items-start gap-3">
                      {q.flagImg && (
                        <img
                          src={q.flagImg}
                          alt={q.flagAlt ?? ""}
                          className="mt-0.5 h-10 w-16 shrink-0 rounded-lg border border-white/10 object-cover"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-zinc-300">{q.question}</p>
                        {!correct && (
                          <p className="mt-1 text-sm text-red-400">
                            Votre réponse : {userAnswer !== null ? q.options[userAnswer] : "Pas de réponse"}
                          </p>
                        )}
                        <p className="mt-1 text-sm font-bold text-green-400">
                          Bonne réponse : {q.options[q.correct]}
                        </p>
                        {!correct && (
                          <p className="mt-2 text-xs text-zinc-500 leading-relaxed">{q.explanation}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={handleRestart}
                className="rounded-2xl bg-[#FF5A1F] px-8 py-4 font-bold transition hover:opacity-90"
              >
                Recommencer
              </button>
              {reviewHref && reviewLabel && (
                <Link
                  href={reviewHref}
                  className="rounded-2xl border border-white/10 px-8 py-4 font-bold text-center transition hover:bg-white/5"
                >
                  {reviewLabel}
                </Link>
              )}
              <Link
                href="/apprendre/quiz"
                className="rounded-2xl border border-white/10 px-8 py-4 font-bold text-center transition hover:bg-white/5"
              >
                ← Retour aux quiz
              </Link>
            </div>
          </div>
        </section>
        <PublicFooter />
      </main>
    );
  }

  const dotSize = questions.length > 20 ? "h-2 w-2" : "h-2.5 w-2.5";

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <PublicNavbar />
      <section className="relative pt-36 pb-24">
        <div className={`absolute right-0 top-0 h-[400px] w-[400px] rounded-full ${glowColor} blur-[160px] pointer-events-none`} />

        <div className="relative z-10 mx-auto max-w-[700px] px-6 lg:px-10">

          <div className="mb-6">
            <Link href={backHref} className="text-sm text-zinc-500 transition hover:text-white">
              ← {backLabel}
            </Link>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#FF5A1F]">{title}</p>
              <p className="text-sm text-zinc-500">{current + 1} / {questions.length}</p>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/10">
              <div
                className="h-1.5 rounded-full bg-[#FF5A1F] transition-all duration-300"
                style={{ width: `${((current + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question card */}
          <div className="rounded-[28px] border border-white/10 bg-white/[0.02] p-6 lg:p-8">

            {question.flagImg && (
              <div className="flex justify-center mb-6">
                <img
                  src={question.flagImg}
                  alt={question.flagAlt ?? ""}
                  className="h-28 w-44 rounded-2xl border border-white/10 object-cover shadow-lg sm:h-36 sm:w-56"
                />
              </div>
            )}

            <h2 className="text-xl font-black text-center lg:text-2xl">{question.question}</h2>

            <div className="mt-6 space-y-3">
              {question.options.map((option, idx) => {
                let style = "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]";
                if (isAnswered) {
                  if (idx === question.correct) style = "border-green-500/50 bg-green-500/10";
                  else if (idx === selected) style = "border-red-500/50 bg-red-500/10";
                  else style = "border-white/5 bg-white/[0.01] opacity-50";
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={isAnswered}
                    className={`w-full rounded-2xl border px-5 py-4 text-left font-medium transition ${style} ${!isAnswered ? "cursor-pointer" : "cursor-default"}`}
                  >
                    <span className="text-sm text-zinc-300">{option}</span>
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className={`mt-5 rounded-2xl border px-4 py-3 ${selected === question.correct ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5"}`}>
                <p className={`text-sm font-bold ${selected === question.correct ? "text-green-400" : "text-red-400"}`}>
                  {selected === question.correct ? "✓ Correct !" : "✗ Incorrect"}
                </p>
                <p className="mt-1 text-sm text-zinc-400 leading-relaxed">{question.explanation}</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              onClick={handlePrev}
              disabled={current === 0}
              className="shrink-0 rounded-2xl border border-white/10 px-4 py-3 text-sm font-bold transition hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed sm:px-5"
            >
              ← Précédent
            </button>

            <div className="flex flex-wrap gap-1 justify-center">
              {shuffled.map((q, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrent(i); setSelected(answers[i]); }}
                  className={`rounded-full transition ${dotSize} ${
                    i === current
                      ? "bg-[#FF5A1F]"
                      : answers[i] !== null
                        ? answers[i] === q.correct
                          ? "bg-green-500"
                          : "bg-red-500"
                        : "bg-white/20"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className="shrink-0 rounded-2xl bg-[#FF5A1F] px-4 py-3 text-sm font-bold transition hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed sm:px-5"
            >
              {current === questions.length - 1 ? "Résultat →" : "Suivant →"}
            </button>
          </div>

        </div>
      </section>
      <PublicFooter />
    </main>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";

const questions = [
  {
    id: 1,
    question: "Que signifie le drapeau rouge ?",
    flag: { visual: "bg-red-600" },
    options: [
      "Arrêt immédiat de la séance",
      "Danger — ralentir sans dépasser",
      "Véhicule lent sur la piste",
      "Avertissement pour conduite antisportive",
    ],
    correct: 0,
    explanation: "Le drapeau rouge ordonne l'arrêt immédiat de la séance. Tous les concurrents doivent ralentir et rejoindre les stands ou la grille.",
  },
  {
    id: 2,
    question: "Comment agite-t-on le drapeau jaune en cas de danger immédiat ?",
    flag: { visual: "bg-yellow-400" },
    options: [
      "Tenu fixe, bras tendu",
      "Agité vigoureusement",
      "Agité lentement",
      "Posé au sol",
    ],
    correct: 1,
    explanation: "Le drapeau jaune agité (vigoureusement) signale un danger immédiat. Le jaune fixe annonce un danger moins immédiat en amont.",
  },
  {
    id: 3,
    question: "Que signifie le drapeau vert ?",
    flag: { visual: "bg-green-500" },
    options: [
      "Départ de la course",
      "Zone de danger dégagée — reprendre le rythme normal",
      "Voiture de sécurité rentrée aux stands",
      "Autorisation de doubler",
    ],
    correct: 1,
    explanation: "Le drapeau vert indique que la zone de danger est dégagée. Les concurrents peuvent reprendre leur vitesse de course après une zone de drapeaux jaunes.",
  },
  {
    id: 4,
    question: "À quel concurrent présente-t-on le drapeau bleu ?",
    flag: { visual: "bg-blue-600" },
    options: [
      "Au leader en tête de course",
      "À un concurrent en difficulté mécanique",
      "À un concurrent sur le point d'être doublé par un pilote plus rapide",
      "Au dernier concurrent de la course",
    ],
    correct: 2,
    explanation: "Le drapeau bleu est présenté au concurrent qui va être doublé par un pilote plus rapide. Il doit laisser passer sans retarder.",
  },
  {
    id: 5,
    question: "Que signifie le drapeau noir et orange (« meatball ») ?",
    flag: { visual: "from-black to-orange-500 bg-gradient-to-r" },
    options: [
      "Exclusion immédiate du concurrent",
      "Piste contaminée par de l'huile",
      "Problème mécanique — le concurrent doit rejoindre les stands",
      "Avertissement pour conduite antisportive",
    ],
    correct: 2,
    explanation: "Le drapeau noir et orange (meatball) est présenté avec le numéro du concurrent dont le véhicule présente un problème mécanique dangereux. Il doit rentrer aux stands.",
  },
  {
    id: 6,
    question: "Que signifie le drapeau jaune et rouge rayé ?",
    flag: { visual: "from-yellow-400 to-red-600 bg-gradient-to-b" },
    options: [
      "Fin de session sur piste mouillée",
      "Piste glissante ou contaminée",
      "Danger immédiat — arrêt de séance",
      "Véhicule lent, piste glissante",
    ],
    correct: 1,
    explanation: "Le drapeau jaune et rouge rayé indique que la piste est rendue glissante par de l'huile, de l'eau ou des débris. Les concurrents doivent adapter leur conduite.",
  },
  {
    id: 7,
    question: "Avec quoi accompagne-t-on toujours le drapeau noir (exclusion) ?",
    flag: { visual: "bg-black border border-white/20" },
    options: [
      "Un drapeau rouge simultané",
      "Un panneau indiquant le numéro du concurrent exclu",
      "Un panneau « STOP »",
      "Un signal sonore",
    ],
    correct: 1,
    explanation: "Le drapeau noir est toujours présenté avec un panneau indiquant le numéro du concurrent exclu. Il ne concerne qu'un seul pilote, qui doit rejoindre immédiatement les stands.",
  },
  {
    id: 8,
    question: "Que signifie le drapeau blanc ?",
    flag: { visual: "bg-white" },
    options: [
      "Fin de session",
      "Reddition / abandon",
      "Véhicule lent sur la piste (SC, ambulance...)",
      "Piste dégagée",
    ],
    correct: 2,
    explanation: "Le drapeau blanc signale la présence d'un véhicule lent sur la piste : voiture de sécurité, ambulance, véhicule de service ou concurrent en grande difficulté.",
  },
  {
    id: 9,
    question: "Le drapeau noir et blanc diagonal signifie :",
    flag: { visual: "from-white to-black bg-gradient-to-br" },
    options: [
      "Exclusion définitive du concurrent",
      "Avertissement unique pour conduite antisportive",
      "Problème mécanique détecté",
      "Piste partiellement bloquée",
    ],
    correct: 1,
    explanation: "Le drapeau noir et blanc diagonal est un avertissement (présenté avec numéro). Il n'est présenté qu'une seule fois. La récidive entraîne le drapeau noir (exclusion).",
  },
  {
    id: 10,
    question: "À quel moment agite-t-on le drapeau damier ?",
    flag: { visual: "bg-[conic-gradient(#000_90deg,#fff_90deg_180deg,#000_180deg_270deg,#fff_270deg)] bg-[length:20px_20px]" },
    options: [
      "Au moment du départ de la course",
      "Au passage de la voiture de sécurité",
      "Au passage du vainqueur puis des concurrents suivants",
      "Uniquement au vainqueur",
    ],
    correct: 2,
    explanation: "Le drapeau damier est agité vigoureusement au passage du vainqueur, puis présenté à tous les concurrents suivants. Il marque la fin officielle de l'épreuve.",
  },
];

export default function QuizDrapeauxPage() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [showResult, setShowResult] = useState(false);

  const question = questions[current];
  const isAnswered = selected !== null;
  const score = answers.filter((a, i) => a === questions[i].correct).length;

  function handleSelect(idx: number) {
    if (isAnswered) return;
    setSelected(idx);
    const newAnswers = [...answers];
    newAnswers[current] = idx;
    setAnswers(newAnswers);
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

  function getScoreLabel() {
    if (score === questions.length) return { label: "Parfait !", color: "text-green-400", emoji: "🏆" };
    if (score >= 8) return { label: "Excellent !", color: "text-green-400", emoji: "🎯" };
    if (score >= 6) return { label: "Bien joué", color: "text-yellow-400", emoji: "👍" };
    if (score >= 4) return { label: "À retravailler", color: "text-orange-400", emoji: "📚" };
    return { label: "Insuffisant", color: "text-red-400", emoji: "🚩" };
  }

  if (showResult) {
    const { label, color, emoji } = getScoreLabel();
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <PublicNavbar />
        <section className="relative pt-36 pb-24">
          <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-green-500/5 blur-[160px] pointer-events-none" />
          <div className="relative z-10 mx-auto max-w-[700px] px-6 lg:px-10">

            <div className="text-center">
              <span className="text-7xl">{emoji}</span>
              <h1 className="mt-6 text-4xl font-black lg:text-5xl">{label}</h1>
              <p className={`mt-3 text-2xl font-black ${color}`}>{score} / {questions.length}</p>
              <p className="mt-3 text-zinc-400">
                {score === questions.length
                  ? "Vous connaissez tous les drapeaux sur le bout des doigts."
                  : "Relisez les drapeaux que vous avez manqués et réessayez."}
              </p>
            </div>

            {/* Review des réponses */}
            <div className="mt-12 space-y-4">
              {questions.map((q, i) => {
                const userAnswer = answers[i];
                const correct = userAnswer === q.correct;
                return (
                  <div
                    key={q.id}
                    className={`rounded-[24px] border p-5 ${correct ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5"}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 shrink-0 text-lg">{correct ? "✅" : "❌"}</span>
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-zinc-300">{q.question}</p>
                        {!correct && (
                          <p className="mt-1 text-sm text-red-400">
                            Votre réponse : {userAnswer !== null ? q.options[userAnswer] : "Pas de réponse"}
                          </p>
                        )}
                        <p className={`mt-1 text-sm font-bold ${correct ? "text-green-400" : "text-green-400"}`}>
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
              <Link
                href="/apprendre/drapeaux"
                className="rounded-2xl border border-white/10 px-8 py-4 font-bold text-center transition hover:bg-white/5"
              >
                Revoir les drapeaux
              </Link>
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

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <PublicNavbar />

      <section className="relative pt-36 pb-24">
        <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-green-500/5 blur-[160px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-[700px] px-6 lg:px-10">

          <div className="mb-6">
            <Link href="/apprendre/quiz" className="text-sm text-zinc-500 transition hover:text-white">
              ← Retour aux quiz
            </Link>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#FF5A1F]">Quiz drapeaux</p>
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

            {/* Flag visual */}
            <div className="flex justify-center mb-6">
              <div className={`h-20 w-32 rounded-2xl border border-white/10 ${question.flag.visual} sm:h-24 sm:w-40`} />
            </div>

            <h2 className="text-xl font-black text-center lg:text-2xl">{question.question}</h2>

            <div className="mt-6 space-y-3">
              {question.options.map((option, idx) => {
                let style = "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]";
                if (isAnswered) {
                  if (idx === question.correct) {
                    style = "border-green-500/50 bg-green-500/10";
                  } else if (idx === selected && idx !== question.correct) {
                    style = "border-red-500/50 bg-red-500/10";
                  } else {
                    style = "border-white/5 bg-white/[0.01] opacity-50";
                  }
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

            {/* Explanation */}
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
          <div className="mt-6 flex items-center justify-between gap-4">
            <button
              onClick={handlePrev}
              disabled={current === 0}
              className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-bold transition hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Précédent
            </button>

            <div className="flex gap-1.5 flex-wrap justify-center">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrent(i); setSelected(answers[i]); }}
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    i === current
                      ? "bg-[#FF5A1F]"
                      : answers[i] !== null
                        ? answers[i] === questions[i].correct
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
              className="rounded-2xl bg-[#FF5A1F] px-5 py-3 text-sm font-bold transition hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {current === questions.length - 1 ? "Voir le résultat" : "Suivant →"}
            </button>
          </div>

        </div>
      </section>

      <PublicFooter />
    </main>
  );
}

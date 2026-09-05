"use client";

import Link from "next/link";
import Image from "next/image";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";
import { BookOpen, MessageSquare, Sparkles, Target } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && (hash.includes("access_token") || hash.includes("error_code") || hash.includes("type=email"))) {
      router.replace(`/auth/confirm${hash}`);
    }
  }, []);

  const steps = [
    {
      icon: BookOpen,
      step: "01",
      title: "Apprends les bases",
      desc: "Drapeaux, procédures, rôles, équipement, sécurité — tout le métier de commissaire de piste expliqué simplement, avec des fiches claires.",
    },
    {
      icon: Target,
      step: "02",
      title: "Entraîne-toi",
      desc: "Des quiz par thème pour tester tes connaissances, plus un quiz adaptatif propulsé par l'IA qui cible tes points faibles à chaque manche.",
    },
    {
      icon: MessageSquare,
      step: "03",
      title: "Pose tes questions",
      desc: "Un assistant IA disponible 24/7 répond à toutes tes questions sur le commissariat, en s'appuyant sur le contenu du site.",
    },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-zinc-50 text-zinc-900">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-zinc-50 pt-28 pb-16 lg:flex lg:min-h-screen lg:items-center lg:pt-32 lg:pb-0">
        <div className="absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-[#FF5A1F]/8 blur-[120px] pointer-events-none" />
        <div className="absolute left-0 bottom-0 h-[300px] w-[300px] rounded-full bg-[#FF5A1F]/5 blur-[100px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl">
            <div className="flex items-center gap-5">
              <Image
                src="/logo.png"
                alt="TrackMarshal"
                width={112}
                height={112}
                className="h-20 w-20 rounded-full object-cover shadow-xl shadow-[#FF5A1F]/20 ring-2 ring-[#FF5A1F]/30 lg:h-28 lg:w-28"
                priority
              />
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F] sm:text-sm">
                Devenir commissaire de piste · 100% Gratuit
              </p>
            </div>

            <h1 className="mt-6 text-5xl font-black uppercase leading-[0.92] tracking-[-0.05em] text-zinc-900 sm:text-6xl lg:text-[7rem]">
              Apprends.<br />
              Entraîne-toi.<br />
              <span className="text-[#FF5A1F]">Deviens commissaire de piste.</span>
            </h1>

            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-zinc-600 sm:text-xl lg:text-2xl">
              La plateforme pour apprendre le métier de commissaire de piste et s'entraîner : drapeaux, procédures, sécurité, quiz et un assistant IA — gratuitement et sans inscription.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/devenir-commissaire" className="flex h-14 items-center justify-center rounded-2xl bg-[#FF5A1F] px-8 text-base font-black text-white transition hover:scale-[1.02] lg:h-16 lg:px-10 lg:text-lg">
                Commencer à me former
              </Link>
              <Link href="/devenir-commissaire/quiz" className="flex h-14 items-center justify-center rounded-2xl border border-zinc-300 bg-white px-8 text-base font-black text-zinc-900 transition hover:border-[#FF5A1F]/50 hover:text-[#FF5A1F] lg:h-16 lg:px-10 lg:text-lg">
                Tester mes connaissances
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                { label: "100% gratuit", color: "bg-green-50 text-green-700 border-green-200" },
                { label: "Sans inscription", color: "bg-blue-50 text-blue-700 border-blue-200" },
                { label: "Auto · Moto · Karting", color: "bg-orange-50 text-orange-700 border-orange-200" },
                { label: "Assistant IA 24/7", color: "bg-purple-50 text-purple-700 border-purple-200" },
              ].map((b) => (
                <span key={b.label} className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold ${b.color}`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                  {b.label}
                </span>
              ))}
            </div>

            <Link
              href="/devenir-commissaire/devenir-commissaire"
              className="mt-6 inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-[#FF5A1F]"
            >
              <span>Tu débutes ?</span>
              <span className="font-bold text-[#FF5A1F]">Comment devenir commissaire de piste →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Ton parcours */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-20 lg:py-32">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F]">Simple et progressif</p>
            <h2 className="mt-4 text-4xl font-black lg:text-6xl">Ton parcours de commissaire de piste</h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {steps.map((s) => (
              <div key={s.step} className="relative rounded-[32px] border border-zinc-200 bg-white shadow-sm p-8 lg:p-10">
                <span className="text-8xl font-black text-zinc-200 absolute top-6 right-8 leading-none">{s.step}</span>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF5A1F]/10">
                  <s.icon size={24} className="text-[#FF5A1F]" />
                </div>
                <h3 className="mt-6 text-2xl font-black lg:text-3xl">{s.title}</h3>
                <p className="mt-4 text-lg leading-relaxed text-zinc-600">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/devenir-commissaire" className="inline-flex h-16 items-center rounded-2xl bg-[#FF5A1F] px-10 text-lg font-black text-white transition hover:scale-[1.02]">
              Accéder à l'espace pédagogique
            </Link>
          </div>
        </div>
      </section>

      {/* Espace pédagogique — les thèmes */}
      <section className="border-t border-zinc-200 bg-white py-20 lg:py-32">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-end lg:justify-between mb-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F]">Gratuit &amp; accessible à tous</p>
              <h2 className="mt-4 text-4xl font-black lg:text-6xl">Ce que tu vas apprendre</h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-zinc-600">
                Drapeaux, procédures, disciplines, équipement — toutes les ressources pour devenir ou progresser en tant que commissaire motorsport.
              </p>
            </div>
            <Link
              href="/devenir-commissaire"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-zinc-300 bg-zinc-50 px-6 py-3 text-sm font-bold text-zinc-700 transition hover:border-[#FF5A1F]/50 hover:text-[#FF5A1F] lg:mt-0 lg:shrink-0"
            >
              Tout l&apos;espace pédagogique →
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                href: "/devenir-commissaire/drapeaux",
                emoji: "🚩",
                title: "Les drapeaux",
                desc: "Signification de chaque drapeau — auto et moto. Avec filtres par discipline.",
                badge: "Lexique visuel",
              },
              {
                href: "/devenir-commissaire/procedures",
                emoji: "📡",
                title: "Les procédures",
                desc: "Safety Car, FCY, Code 60, drapeau rouge, évacuation — étape par étape.",
                badge: "Sécurité",
              },
              {
                href: "/devenir-commissaire/epreuves",
                emoji: "🏁",
                title: "Types d'épreuves",
                desc: "Circuit, rallye, côte, karting, motocross — les spécificités de chaque discipline.",
                badge: "Disciplines",
              },
              {
                href: "/devenir-commissaire/quiz",
                emoji: "🎯",
                title: "Quiz",
                desc: "Teste tes connaissances par thème, ou lance le quiz adaptatif propulsé par l'IA.",
                badge: "Entraînement",
              },
            ].map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group rounded-[28px] border border-zinc-200 bg-zinc-50 p-6 transition hover:border-[#FF5A1F]/40 hover:bg-orange-50"
              >
                <span className="text-4xl">{card.emoji}</span>
                <span className="mt-4 inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                  {card.badge}
                </span>
                <h3 className="mt-3 text-lg font-black text-zinc-900">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{card.desc}</p>
                <p className="mt-5 text-sm font-bold text-zinc-500 transition group-hover:text-[#FF5A1F]">
                  Commencer →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* L'IA à ton service */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-20 lg:py-32">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:gap-20">

            <div className="lg:w-1/2">
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F]">
                <Sparkles size={16} /> Propulsé par l'IA
              </p>
              <h2 className="mt-4 text-4xl font-black leading-tight lg:text-6xl">
                Un formateur<br />dans ta poche
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-zinc-600">
                Une question sur un drapeau, une procédure, la sécurité ? L'assistant IA te répond à toute heure. Et le quiz adaptatif s'ajuste à tes erreurs pour te faire progresser plus vite — comme un coach personnel.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link href="/devenir-commissaire" className="flex h-14 items-center justify-center rounded-2xl bg-[#FF5A1F] px-8 font-black text-white transition hover:scale-[1.02] lg:h-16 lg:text-lg">
                  Discuter avec l'assistant
                </Link>
                <Link href="/devenir-commissaire/quiz/adaptatif" className="flex h-14 items-center justify-center rounded-2xl border border-zinc-300 bg-white px-8 font-black text-zinc-700 transition hover:border-[#FF5A1F]/40 lg:h-16 lg:text-lg">
                  Lancer le quiz adaptatif →
                </Link>
              </div>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-0 lg:w-1/2">
              {[
                { emoji: "💬", title: "Assistant commissaire", desc: "Pose n'importe quelle question sur le métier : drapeaux, procédures, licences, sécurité. Réponses claires, en français, instantanées." },
                { emoji: "🧠", title: "Quiz adaptatif", desc: "L'IA génère des questions et cible tes points faibles à chaque manche pour un entraînement sur mesure." },
                { emoji: "🚩", title: "Fiches complètes", desc: "Drapeaux, procédures de neutralisation, rôles, équipement, lexique — un référentiel pédagogique complet." },
                { emoji: "🆓", title: "Gratuit et ouvert", desc: "Tout le contenu est accessible librement, sans compte. Un projet indépendant au service de la communauté motorsport." },
              ].map((item) => (
                <div key={item.title} className="rounded-[28px] border border-zinc-200 bg-white p-6">
                  <span className="text-3xl">{item.emoji}</span>
                  <h3 className="mt-4 text-lg font-black text-zinc-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="border-t border-zinc-200 bg-white py-20 lg:py-32">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 text-center">
          <Image src="/logo.png" alt="TrackMarshal" width={80} height={80} className="mx-auto mb-8 h-20 w-20 rounded-full object-cover shadow-xl shadow-[#FF5A1F]/20 ring-2 ring-[#FF5A1F]/30" />
          <h2 className="text-4xl font-black lg:text-7xl">Prêt à te lancer ?</h2>
          <p className="mt-6 mx-auto max-w-2xl text-lg text-zinc-600">
            Commence à apprendre le métier de commissaire de piste dès maintenant — gratuitement, à ton rythme.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row justify-center">
            <Link href="/devenir-commissaire" className="flex h-16 items-center justify-center rounded-2xl bg-[#FF5A1F] px-10 text-lg font-black text-white transition hover:scale-[1.02]">
              Commencer à me former
            </Link>
            <Link href="/devenir-commissaire/quiz" className="flex h-16 items-center justify-center rounded-2xl border border-zinc-300 bg-white text-zinc-700 px-10 text-lg font-black transition hover:border-[#FF5A1F]/40">
              Faire un quiz
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}

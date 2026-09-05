"use client";

import Link from "next/link";
import { BookOpen, MessageSquare, Sparkles, Target } from "lucide-react";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-zinc-50 text-zinc-900">

      <PublicNavbar />

      <section className="relative overflow-hidden bg-zinc-50 pt-32 lg:pt-40">
        <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-[#FF5A1F]/6 blur-[120px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-[1600px] px-4 pb-20 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F] sm:text-sm">À propos</p>
          <h1 className="mt-6 text-5xl font-black leading-[0.92] tracking-[-0.05em] text-zinc-900 sm:text-6xl lg:text-[7rem]">
            Notre<br />
            <span className="text-[#FF5A1F]">mission.</span>
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-zinc-600 lg:text-2xl">
            Rendre l'apprentissage du métier de commissaire de piste accessible à tous —
            gratuitement, simplement, et pour toutes les disciplines du sport automobile et moto.
          </p>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-32">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">

          <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
            <div className="rounded-[32px] border border-zinc-200 bg-white shadow-sm p-8 lg:p-12">
              <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Le problème</p>
              <h2 className="mt-6 text-4xl font-black lg:text-5xl">Apprendre le métier était compliqué.</h2>
              <p className="mt-6 text-lg leading-relaxed text-zinc-600">
                Drapeaux, procédures de sécurité, rôles, licences… Les informations sont
                dispersées, souvent techniques et difficiles d'accès pour un débutant. Beaucoup
                de passionnés renoncent faute d'un point d'entrée clair pour se former.
              </p>
            </div>

            <div className="rounded-[32px] border border-zinc-200 bg-white shadow-sm p-8 lg:p-12">
              <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">La solution</p>
              <h2 className="mt-6 text-4xl font-black lg:text-5xl">Un espace pour se former, gratuit.</h2>
              <p className="mt-6 text-lg leading-relaxed text-zinc-600">
                TrackMarshal réunit tout au même endroit : des fiches claires sur les drapeaux,
                les procédures et la sécurité, des quiz pour s'entraîner, et un assistant IA qui
                répond à toutes tes questions. Du circuit au rallye, à ton rythme.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: BookOpen, title: "Fiches pédagogiques", text: "Drapeaux, procédures, rôles, équipement, lexique — expliqués simplement." },
              { icon: Target, title: "Quiz d'entraînement", text: "Des quiz par thème et un quiz adaptatif qui cible tes points faibles." },
              { icon: MessageSquare, title: "Assistant IA", text: "Une question ? L'assistant répond à toute heure, en français." },
              { icon: Sparkles, title: "Gratuit & ouvert", text: "Tout le contenu est accessible librement, sans inscription." },
            ].map((item) => (
              <div key={item.title} className="rounded-[28px] border border-zinc-200 bg-white shadow-sm p-6 lg:p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF5A1F]/10">
                  <item.icon size={24} className="text-[#FF5A1F]" />
                </div>
                <h3 className="mt-6 text-xl font-black">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-zinc-600">{item.text}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Origine du projet */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-20 lg:py-32">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#FF5A1F]">Né du terrain</p>
              <h2 className="mt-6 text-4xl font-black leading-tight lg:text-5xl">
                Créé par un commissaire.<br />
                <span className="text-[#FF5A1F]">Pour les commissaires.</span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-zinc-600">
                TrackMarshal est né de l'expérience d'un commissaire confronté à la réalité du
                terrain : des connaissances essentielles, mais éparpillées et intimidantes pour
                qui débute. L'idée est simple — regrouper l'essentiel du métier dans un espace
                pédagogique clair, moderne et accessible à tous.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-zinc-600">
                Le contenu est entièrement <strong className="text-zinc-900">gratuit</strong> et
                ouvert, pensé pour aider chacun à apprendre, réviser et progresser, du premier
                drapeau jusqu'aux procédures les plus techniques.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { value: "Auto", label: "Rallye, circuit, karting, côte, endurance, drift, slalom…" },
                { value: "Moto", label: "Motocross, enduro, trial, road racing, supermoto, rallye moto…" },
                { value: "Fiches", label: "Drapeaux, procédures, rôles, équipement et lexique du sport auto" },
                { value: "IA", label: "Quiz adaptatif et assistant pour un entraînement personnalisé" },
              ].map((item) => (
                <div key={item.value} className="rounded-[24px] border border-zinc-200 bg-white p-6 shadow-sm">
                  <p className="text-3xl font-black text-[#FF5A1F]">{item.value}</p>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projet indépendant */}
      <section className="border-t border-zinc-200 bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.35em] text-[#FF5A1F]">Projet indépendant</p>
            <h2 className="mt-6 text-4xl font-black lg:text-5xl">Un projet libre, au service de la communauté.</h2>
            <p className="mt-6 text-lg leading-relaxed text-zinc-600">
              TrackMarshal est un projet <strong className="text-zinc-900">indépendant</strong>,
              créé <strong className="text-zinc-900">sans lien officiel avec la FFSA ou la FFM</strong>.
              Le contenu est fourni à titre pédagogique : pour toute démarche officielle (licence,
              formation homologuée), rapprochez-vous de votre club, de votre ASA ou de la fédération concernée.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-zinc-600">
              Vous représentez une ligue, une ASA, un club ou une école et souhaitez utiliser cet
              espace pour former vos commissaires ? Écrivez-nous, nous serions ravis d'échanger.
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

      {/* CTA final */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-20 lg:py-28">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.35em] text-[#FF5A1F]">Commence maintenant</p>
            <h2 className="mt-6 text-4xl font-black lg:text-6xl">Prêt à apprendre le métier ?</h2>
            <p className="mt-6 text-xl text-zinc-600">Gratuit, sans inscription, à ton rythme.</p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/devenir-commissaire" className="flex h-14 items-center justify-center rounded-2xl bg-[#FF5A1F] px-8 font-black text-white transition hover:scale-[1.02] lg:h-16 lg:text-lg">
                Commencer à me former
              </Link>
              <Link href="/devenir-commissaire/quiz" className="flex h-14 items-center justify-center rounded-2xl border border-zinc-300 bg-white text-zinc-700 px-8 font-black transition hover:border-[#FF5A1F]/40 lg:h-16 lg:text-lg">
                Faire un quiz
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />

    </main>
  );
}

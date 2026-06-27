"use client";

import Link from "next/link";
import { Award, CalendarDays, Shield, Users } from "lucide-react";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";
import FranceMap from "@/components/about/FranceMap";

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-zinc-50 text-zinc-900">

      <PublicNavbar />

      <section className="relative overflow-hidden bg-zinc-50 pt-32 lg:pt-40">
        <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-[#FF5A1F]/6 blur-[160px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-[1600px] px-4 pb-20 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F] sm:text-sm">À propos</p>
          <h1 className="mt-6 text-5xl font-black leading-[0.92] tracking-[-0.05em] text-zinc-900 sm:text-6xl lg:text-[7rem]">
            Notre<br />
            <span className="text-[#FF5A1F]">mission.</span>
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-zinc-600 lg:text-2xl">
            TrackMarshal connecte organisateurs et commissaires motorsport
            à travers une plateforme moderne, fiable et pensée pour le terrain.
          </p>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-32">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">

          <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
            <div className="rounded-[32px] border border-zinc-200 bg-white shadow-sm p-8 lg:p-12">
              <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Le problème</p>
              <h2 className="mt-6 text-4xl font-black lg:text-5xl">Recruter des commissaires était compliqué.</h2>
              <p className="mt-6 text-lg leading-relaxed text-zinc-600">
                Appels téléphoniques, emails éparpillés, tableurs Excel,
                groupes WhatsApp… Les organisateurs perdaient un temps précieux
                à trouver et gérer leurs équipes. Les commissaires ne savaient
                pas quels événements étaient ouverts ni comment postuler.
              </p>
            </div>

            <div className="rounded-[32px] border border-zinc-200 bg-white shadow-sm p-8 lg:p-12">
              <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">La solution</p>
              <h2 className="mt-6 text-4xl font-black lg:text-5xl">Une plateforme dédiée au motorsport.</h2>
              <p className="mt-6 text-lg leading-relaxed text-zinc-600">
                TrackMarshal centralise tout : publication d'événements,
                candidatures, gestion des profils et licences, messagerie
                intégrée. Du rallye au circuit, de la première prise de
                contact à la validation finale.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: CalendarDays, title: "Événements publiés", text: "Les organisateurs publient leurs besoins en quelques minutes." },
              { icon: Users, title: "Profils vérifiés", text: "Licences, expériences et disciplines centralisées pour chaque commissaire." },
              { icon: Shield, title: "Candidatures suivies", text: "Statut en temps réel : en attente, accepté ou refusé." },
              { icon: Award, title: "Communication directe", text: "Messagerie intégrée entre organisateurs et commissaires acceptés." },
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
                TrackMarshal est né de la frustration d'un commissaire FFSA confronté à la réalité du terrain : événements impossibles à trouver, inscriptions par email, licences vérifiées à la main, groupes WhatsApp… Le projet a été lancé avec une conviction simple — le bénévolat motorsport mérite des outils modernes.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-zinc-600">
                La plateforme est entièrement <strong className="text-zinc-900">gratuite</strong>, conçue pour aider les ASA et les organisateurs à recruter plus facilement, et pour rendre la communauté des commissaires plus visible et plus accessible.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { value: "Auto", label: "Rallye, circuit, karting, côte, endurance, drift, slalom…" },
                { value: "Moto", label: "Motocross, enduro, trial, road racing, supermoto, rallye moto…" },
                { value: "FFSA", label: "Les commissaires peuvent renseigner et faire vérifier leur licence FFSA" },
                { value: "FFM", label: "Les commissaires moto renseignent leur licence FFM sur leur profil" },
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

      {/* Pour les institutions */}
      <section className="border-t border-zinc-200 bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.35em] text-[#FF5A1F]">Ligues & Institutions</p>
            <h2 className="mt-6 text-4xl font-black lg:text-5xl">Vous représentez une ligue ou une ASA&nbsp;?</h2>
            <p className="mt-6 text-lg leading-relaxed text-zinc-600">
              TrackMarshal est un projet indépendant, créé sans lien officiel avec la FFSA ou la FFM. Si vous représentez une ligue régionale, une ASA ou une fédération et souhaitez explorer comment la plateforme peut aider vos clubs à recruter leurs commissaires, nous serions ravis d'échanger.
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

      <section className="border-t border-zinc-200 bg-zinc-50 py-20 lg:py-28">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.35em] text-[#FF5A1F]">Rejoignez-nous</p>
            <h2 className="mt-6 text-4xl font-black lg:text-6xl">Prêt à rejoindre la communauté ?</h2>
            <p className="mt-6 text-xl text-zinc-600">Commissaire ou organisateur, TrackMarshal est fait pour vous.</p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/register" className="flex h-14 items-center justify-center rounded-2xl bg-[#FF5A1F] px-8 font-black transition hover:scale-[1.02] lg:h-16 lg:text-lg">
                Créer un compte
              </Link>
              <Link href="/events" className="flex h-14 items-center justify-center rounded-2xl border border-zinc-300 bg-white text-zinc-700 px-8 font-black transition hover:border-[#FF5A1F]/40 lg:h-16 lg:text-lg">
                Voir les événements
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Carte du vivier */}
      <section className="bg-zinc-50 py-20 lg:py-32">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F] sm:text-sm">France</p>
            <h2 className="mt-4 text-4xl font-black lg:text-6xl">Le vivier commissaires</h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-600">
              Des commissaires TrackMarshal présents dans toutes les régions de France, toutes disciplines confondues.
            </p>
          </div>
          <FranceMap />
        </div>
      </section>

      <PublicFooter />

    </main>
  );
}

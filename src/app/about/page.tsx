"use client";

import Link from "next/link";
import { Award, CalendarDays, Shield, Users } from "lucide-react";
import PublicNavbar from "@/components/layout/public-navbar";

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">

      <PublicNavbar />

      <section className="relative flex min-h-[60vh] items-center overflow-hidden pt-32 lg:pt-40">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/85" />
        </div>
        <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-[#FF5A1F]/10 blur-[180px]" />

        <div className="relative z-10 mx-auto max-w-[1600px] px-4 pb-20 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F] sm:text-sm">À propos</p>
          <h1 className="mt-6 text-5xl font-black leading-[0.92] tracking-[-0.05em] sm:text-6xl lg:text-[7rem]">
            Notre<br />
            <span className="text-[#FF5A1F]">mission.</span>
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-zinc-300 lg:text-2xl">
            TrackMarshal connecte organisateurs et commissaires motorsport
            à travers une plateforme moderne, fiable et pensée pour le terrain.
          </p>
        </div>
      </section>

      <section className="bg-black py-20 lg:py-32">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">

          <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
            <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8 lg:p-12">
              <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Le problème</p>
              <h2 className="mt-6 text-4xl font-black lg:text-5xl">Recruter des commissaires était compliqué.</h2>
              <p className="mt-6 text-lg leading-relaxed text-zinc-400">
                Appels téléphoniques, emails éparpillés, tableurs Excel,
                groupes WhatsApp… Les organisateurs perdaient un temps précieux
                à trouver et gérer leurs équipes. Les commissaires ne savaient
                pas quels événements étaient ouverts ni comment postuler.
              </p>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8 lg:p-12">
              <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">La solution</p>
              <h2 className="mt-6 text-4xl font-black lg:text-5xl">Une plateforme dédiée au motorsport.</h2>
              <p className="mt-6 text-lg leading-relaxed text-zinc-400">
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
              <div key={item.title} className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 lg:p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF5A1F]/10">
                  <item.icon size={24} className="text-[#FF5A1F]" />
                </div>
                <h3 className="mt-6 text-xl font-black">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-zinc-400">{item.text}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      <section className="border-t border-white/10 bg-black py-20 lg:py-28">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.35em] text-[#FF5A1F]">Rejoignez-nous</p>
            <h2 className="mt-6 text-4xl font-black lg:text-6xl">Prêt à rejoindre la communauté ?</h2>
            <p className="mt-6 text-xl text-zinc-400">Commissaire ou organisateur, TrackMarshal est fait pour vous.</p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/register" className="flex h-14 items-center justify-center rounded-2xl bg-[#FF5A1F] px-8 font-black transition hover:scale-[1.02] lg:h-16 lg:text-lg">
                Créer un compte
              </Link>
              <Link href="/events" className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-8 font-black transition hover:border-[#FF5A1F]/40 lg:h-16 lg:text-lg">
                Voir les événements
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black py-8">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-4 px-4 text-center sm:px-6 lg:flex-row lg:px-8">
          <p className="text-sm text-zinc-600">© 2026 TrackMarshal — Tous droits réservés.</p>
          <div className="flex items-center gap-6 text-sm text-zinc-600">
            <Link href="/about" className="transition hover:text-[#FF5A1F]">À propos</Link>
            <Link href="/events" className="transition hover:text-[#FF5A1F]">Événements</Link>
          </div>
        </div>
      </footer>

    </main>
  );
}

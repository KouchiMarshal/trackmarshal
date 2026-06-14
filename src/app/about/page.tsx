"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

export default function AboutPage() {

  const [user, setUser] =
    useState<any>(null);

  useEffect(() => {

    checkUser();

  }, []);

  async function checkUser() {

    const {
      data: { session },
    } = await supabase.auth.getSession();

    setUser(session?.user || null);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">

      <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur-2xl">

        <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:h-24 lg:px-8">

          <Link
            href="/"
            className="flex items-center gap-3"
          >

            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FF5A1F]/10 lg:h-12 lg:w-12">

              <div className="h-3 w-3 rounded-full bg-[#FF5A1F] lg:h-4 lg:w-4" />

            </div>

            <h1 className="text-2xl font-black lg:text-3xl">

              Track
              <span className="text-[#FF5A1F]">

                Marshal

              </span>

            </h1>

          </Link>

          <nav className="hidden items-center gap-10 lg:flex">

            <Link
              href="/"
              className="text-sm font-bold uppercase tracking-[0.15em] text-white transition hover:text-[#FF5A1F]"
            >
              Accueil
            </Link>

            <Link
              href="/events"
              className="text-sm font-bold uppercase tracking-[0.15em] text-white transition hover:text-[#FF5A1F]"
            >
              Événements
            </Link>

            <Link
              href="/about"
              className="text-sm font-bold uppercase tracking-[0.15em] text-[#FF5A1F]"
            >
              À propos
            </Link>

          </nav>

          <div className="flex items-center gap-3">

            {user ? (

              <Link
                href="/dashboard"
                className="flex h-12 items-center rounded-2xl bg-[#FF5A1F] px-5 text-sm font-bold transition hover:scale-105 lg:h-14 lg:px-8 lg:text-base"
              >

                Dashboard

              </Link>

            ) : (

              <>

                <Link
                  href="/login"
                  className="hidden h-12 items-center rounded-2xl border border-white/10 px-6 text-sm font-bold transition hover:border-[#FF5A1F]/40 hover:bg-[#FF5A1F]/10 lg:flex"
                >

                  Se connecter

                </Link>

                <Link
                  href="/register"
                  className="flex h-12 items-center rounded-2xl bg-[#FF5A1F] px-5 text-sm font-bold transition hover:scale-105 lg:h-14 lg:px-8 lg:text-base"
                >

                  S'inscrire

                </Link>

              </>

            )}

          </div>

        </div>

      </header>

      <section className="relative flex min-h-screen items-center overflow-hidden pt-28 lg:pt-32">

        <div className="absolute inset-0">

          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/85" />

          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />

        </div>

        <div className="absolute right-0 top-0 h-[350px] w-[350px] rounded-full bg-[#FF5A1F]/10 blur-[120px] lg:h-[700px] lg:w-[700px] lg:blur-[220px]" />

        <div className="relative z-10 mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">

          <div className="max-w-5xl">

            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F] sm:text-sm">

              À propos de TrackMarshal

            </p>

            <h1 className="mt-6 text-5xl font-black uppercase leading-[0.92] tracking-[-0.05em] sm:text-6xl lg:text-[8rem]">

              Réinventer
              <br />

              le recrutement
              <br />

              motorsport.

            </h1>

            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-zinc-300 lg:text-2xl">

              TrackMarshal modernise la relation entre
              organisateurs et commissaires motorsport
              avec une plateforme pensée pour la rapidité,
              la sécurité et l’efficacité terrain.

            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">

              <Link
                href="/events"
                className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-[#FF5A1F] px-8 text-base font-black transition hover:scale-[1.02] lg:h-16 lg:px-10 lg:text-lg"
              >

                Voir les événements

                <ArrowRight size={20} />

              </Link>

              {!user && (

                <Link
                  href="/register"
                  className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-8 text-base font-black transition hover:border-[#FF5A1F]/40 hover:bg-[#FF5A1F]/10 lg:h-16 lg:px-10 lg:text-lg"
                >

                  Rejoindre la plateforme

                </Link>

              )}

            </div>

          </div>

        </div>

      </section>

      <section className="border-t border-white/10 bg-black py-20 lg:py-32">

        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">

          <div className="max-w-4xl">

            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F]">

              Pourquoi TrackMarshal ?

            </p>

            <h2 className="mt-5 text-4xl font-black leading-tight lg:text-6xl">

              Une plateforme créée pour
              les besoins réels du terrain.

            </h2>

          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">

            {[
              {
                icon: Users,
                title:
                  "Connexion rapide",
                text:
                  "Les organisateurs trouvent rapidement des commissaires qualifiés.",
              },
              {
                icon: ShieldCheck,
                title:
                  "Profils vérifiés",
                text:
                  "Licences et expériences centralisées pour un recrutement sécurisé.",
              },
              {
                icon: Trophy,
                title:
                  "Écosystème premium",
                text:
                  "Une expérience moderne adaptée au niveau du sport automobile.",
              },
            ].map((item) => (

              <div
                key={item.title}
                className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl lg:p-10"
              >

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF5A1F]/10">

                  <item.icon
                    size={30}
                    className="text-[#FF5A1F]"
                  />

                </div>

                <h3 className="mt-8 text-3xl font-black">

                  {item.title}

                </h3>

                <p className="mt-5 text-lg leading-relaxed text-zinc-400">

                  {item.text}

                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      <section className="border-t border-white/10 bg-[#050505] py-20 lg:py-32">

        <div className="mx-auto grid max-w-[1600px] gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">

          <div className="rounded-[40px] border border-white/10 bg-white/[0.03] p-8 lg:p-12">

            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#FF5A1F]">

              Pour les commissaires

            </p>

            <h2 className="mt-6 text-4xl font-black lg:text-5xl">

              Trouvez des missions
              plus facilement.

            </h2>

            <div className="mt-10 space-y-5">

              {[
                "Postuler rapidement aux événements",
                "Centraliser licences et expérience",
                "Créer un profil professionnel",
                "Suivre ses candidatures",
              ].map((item) => (

                <div
                  key={item}
                  className="flex items-center gap-4"
                >

                  <CheckCircle2
                    className="text-[#FF5A1F]"
                    size={22}
                  />

                  <p className="text-lg text-zinc-300">

                    {item}

                  </p>

                </div>

              ))}

            </div>

          </div>

          <div className="rounded-[40px] border border-white/10 bg-white/[0.03] p-8 lg:p-12">

            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#FF5A1F]">

              Pour les organisateurs

            </p>

            <h2 className="mt-6 text-4xl font-black lg:text-5xl">

              Recrutez les bons
              profils plus vite.

            </h2>

            <div className="mt-10 space-y-5">

              {[
                "Publier des événements facilement",
                "Recevoir des candidatures qualifiées",
                "Gérer les équipes commissaires",
                "Sécuriser les recrutements",
              ].map((item) => (

                <div
                  key={item}
                  className="flex items-center gap-4"
                >

                  <CheckCircle2
                    className="text-[#FF5A1F]"
                    size={22}
                  />

                  <p className="text-lg text-zinc-300">

                    {item}

                  </p>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>

      <section className="border-t border-white/10 bg-black py-20 lg:py-32">

        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">

          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F]">

            Rejoindre TrackMarshal

          </p>

          <h2 className="mt-6 text-5xl font-black leading-tight lg:text-7xl">

            Passez au niveau supérieur
            dans le motorsport.

          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-zinc-400 lg:text-2xl">

            Une plateforme moderne conçue
            pour les exigences du terrain.

          </p>

          <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">

            <Link
              href="/events"
              className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-8 font-bold transition hover:border-[#FF5A1F]/40"
            >

              Voir les événements

            </Link>

            {!user && (

              <Link
                href="/register"
                className="flex h-14 items-center justify-center rounded-2xl bg-[#FF5A1F] px-8 font-bold transition hover:scale-[1.02]"
              >

                Créer un compte

              </Link>

            )}

          </div>

        </div>

      </section>

      <footer className="border-t border-white/10 bg-black py-8">

        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-4 px-4 text-center sm:px-6 lg:flex-row lg:px-8">

          <p className="text-sm text-zinc-600">

            © 2026 TrackMarshal — Tous droits réservés.

          </p>

          <div className="flex items-center gap-6 text-sm text-zinc-600">

            <Link
              href="/about"
              className="transition hover:text-[#FF5A1F]"
            >
              À propos
            </Link>

            <Link
              href="/events"
              className="transition hover:text-[#FF5A1F]"
            >
              Événements
            </Link>

          </div>

        </div>

      </footer>

    </main>
  );
}
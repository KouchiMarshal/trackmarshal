"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

export default function HomePage() {

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
              className="text-sm font-bold uppercase tracking-[0.15em] text-[#FF5A1F]"
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
              className="text-sm font-bold uppercase tracking-[0.15em] text-white transition hover:text-[#FF5A1F]"
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
            src="https://images.unsplash.com/photo-1541773367336-d14e1d89924f?q=80&w=2070&auto=format&fit=crop"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/80" />

          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />

        </div>

        <div className="absolute left-0 top-0 h-[350px] w-[350px] rounded-full bg-[#FF5A1F]/10 blur-[120px] lg:h-[700px] lg:w-[700px] lg:blur-[220px]" />

        <div className="relative z-10 mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">

          <div className="max-w-5xl">

            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F] sm:text-sm">

              Plateforme Motorsport Premium

            </p>

            <h1 className="mt-6 text-5xl font-black uppercase leading-[0.92] tracking-[-0.05em] sm:text-6xl lg:text-[9rem]">

              Connecter.
              <br />

              Recruter.
              <br />

              <span className="text-[#FF5A1F]">

                Sécuriser.

              </span>

            </h1>

            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-zinc-300 sm:text-xl lg:text-2xl">

              La plateforme moderne qui connecte
              organisateurs et commissaires motorsport
              partout en France.

            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">

              <Link
                href="/events"
                className="flex h-14 items-center justify-center rounded-2xl bg-[#FF5A1F] px-8 text-base font-black transition hover:scale-[1.02] lg:h-16 lg:px-10 lg:text-lg"
              >

                Voir les événements

              </Link>

              {!user && (

                <Link
                  href="/register"
                  className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-8 text-base font-black transition hover:border-[#FF5A1F]/40 hover:bg-[#FF5A1F]/10 lg:h-16 lg:px-10 lg:text-lg"
                >

                  Créer un compte

                </Link>

              )}

            </div>

          </div>

        </div>

      </section>

      <section className="border-t border-white/10 bg-black py-20 lg:py-32">

        <div className="mx-auto grid max-w-[1600px] gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">

          {[
            {
              title:
                "Organisation simplifiée",
              text:
                "Publiez et gérez vos événements motorsport depuis une seule plateforme.",
            },
            {
              title:
                "Profils vérifiés",
              text:
                "Licences, expérience et profils centralisés pour un recrutement sécurisé.",
            },
            {
              title:
                "Communication moderne",
              text:
                "Échangez rapidement entre organisateurs et commissaires.",
            },
          ].map((item) => (

            <div
              key={item.title}
              className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl lg:p-12"
            >

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF5A1F]/10">

                <div className="h-4 w-4 rounded-full bg-[#FF5A1F]" />

              </div>

              <h2 className="mt-8 text-3xl font-black lg:text-4xl">

                {item.title}

              </h2>

              <p className="mt-5 text-lg leading-relaxed text-zinc-400">

                {item.text}

              </p>

            </div>

          ))}

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
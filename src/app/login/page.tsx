"use client";

import React, { useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

async function handleLogin(
  e: React.FormEvent<HTMLFormElement>
) {
  e.preventDefault();

  setLoading(true);

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });


  if (error) {
    alert(error.message);
    setLoading(false);
    return;
  }

  const user = data.user;

  if (!user) {
    alert("Utilisateur introuvable");
    setLoading(false);
    return;
  }

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();


  if (profileError) {
    alert("Impossible de charger le profil.");
    setLoading(false);
    return;
  }

  if (profile?.role === "organizer") {
    window.location.href =
      "/organizer/dashboard";
  } else {
    window.location.href =
      "/dashboard";
  }
}

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">

      <div className="absolute inset-0">

        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop"
          alt="Motorsport"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/80" />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/40" />

      </div>

      <div className="absolute left-0 top-0 h-[350px] w-[350px] rounded-full bg-[#FF5A1F]/10 blur-[120px] lg:h-[700px] lg:w-[700px] lg:blur-[220px]" />

      <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-2xl">

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

          <nav className="hidden items-center gap-12 lg:flex">

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
              className="text-sm font-bold uppercase tracking-[0.15em] text-white transition hover:text-[#FF5A1F]"
            >
              À propos
            </Link>

          </nav>

          <Link
            href="/register"
            className="flex h-12 items-center rounded-2xl bg-[#FF5A1F] px-5 text-sm font-bold transition hover:scale-105 lg:h-14 lg:px-8 lg:text-base"
          >

            S'inscrire

          </Link>

        </div>

      </header>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 pt-28 pb-10 sm:px-6 lg:px-8 lg:pt-32">

        <div className="grid w-full max-w-[1400px] gap-10 lg:grid-cols-2 lg:gap-20">

          <div className="hidden flex-col justify-center lg:flex">

            <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#FF5A1F]">

              Plateforme Motorsport Premium

            </p>

            <h1 className="mt-8 text-7xl font-black uppercase leading-[0.9] tracking-[-0.05em]">

              Bon
              <br />

              retour.

            </h1>

            <p className="mt-10 max-w-2xl text-2xl leading-relaxed text-zinc-300">

              Connectez-vous pour accéder
              à votre espace organisateur
              ou commissaire.

            </p>

          </div>

          <div className="flex items-center justify-center">

            <div className="w-full max-w-xl rounded-[32px] border border-white/10 bg-black/40 p-6 backdrop-blur-2xl sm:p-8 lg:rounded-[40px] lg:p-10">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F] sm:text-sm">

                  Connexion

                </p>

                <h2 className="mt-4 text-4xl font-black sm:text-5xl">

                  Se connecter

                </h2>

                <p className="mt-5 text-base leading-relaxed text-zinc-400 lg:text-lg">

                  Accédez à votre dashboard
                  et gérez vos événements motorsport.

                </p>

              </div>

              <form
                onSubmit={handleLogin}
                className="mt-8 space-y-5 lg:mt-10 lg:space-y-6"
              >

                <div>

                  <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-400 sm:text-sm">

                    Adresse Email

                  </p>

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-5 text-white outline-none backdrop-blur-xl placeholder:text-zinc-500 focus:border-[#FF5A1F] lg:h-16 lg:px-6"
                    placeholder="contact@email.com"
                  />

                </div>

                <div>

                  <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-400 sm:text-sm">

                    Mot de Passe

                  </p>

                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-5 text-white outline-none backdrop-blur-xl placeholder:text-zinc-500 focus:border-[#FF5A1F] lg:h-16 lg:px-6"
                    placeholder="••••••••"
                  />

                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="h-14 w-full rounded-2xl bg-[#FF5A1F] text-base font-black transition hover:scale-[1.01] hover:opacity-90 lg:h-16 lg:text-lg"
                >

                  {loading
                    ? "Connexion..."
                    : "Accéder au Dashboard"}

                </button>

              </form>

              <p className="mt-8 text-center text-sm text-zinc-400 lg:text-base">

                Vous n’avez pas encore de compte ?{" "}

                <Link
                  href="/register"
                  className="font-semibold text-[#FF5A1F]"
                >
                  Créer un compte
                </Link>

              </p>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}
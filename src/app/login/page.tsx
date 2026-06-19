"use client";

import React, { useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";
import { Toast, type ToastData } from "@/components/ui/toast";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [toast, setToast] =
    useState<ToastData>(null);

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
    setToast({ message: error.message, type: "error" });
    setLoading(false);
    return;
  }

  const user = data.user;

  if (!user) {
    setToast({ message: "Utilisateur introuvable.", type: "error" });
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
    setToast({ message: "Impossible de charger le profil.", type: "error" });
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
    <main className="relative min-h-screen overflow-hidden bg-black">

      <Toast toast={toast} onClose={() => setToast(null)} />

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

      <PublicNavbar />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 pt-28 pb-10 sm:px-6 lg:px-8 lg:pt-32">

        <div className="grid w-full max-w-[1400px] gap-10 lg:grid-cols-2 lg:gap-20">

          <div className="hidden flex-col justify-center lg:flex">

            <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#FF5A1F]">

              Plateforme Motorsport Premium

            </p>

            <h1 className="mt-8 text-7xl font-black uppercase leading-[0.9] tracking-[-0.05em] text-white">

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

            <div className="w-full max-w-xl rounded-[32px] border border-zinc-200 bg-white shadow-xl p-6 sm:p-8 lg:rounded-[40px] lg:p-10">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F] sm:text-sm">

                  Connexion

                </p>

                <h2 className="mt-4 text-4xl font-black text-zinc-900 sm:text-5xl">

                  Se connecter

                </h2>

                <p className="mt-5 text-base leading-relaxed text-zinc-600 lg:text-lg">

                  Accédez à votre dashboard
                  et gérez vos événements motorsport.

                </p>

              </div>

              <form
                onSubmit={handleLogin}
                className="mt-8 space-y-5 lg:mt-10 lg:space-y-6"
              >

                <div>

                  <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-600 sm:text-sm">

                    Adresse Email

                  </p>

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    className="h-14 w-full rounded-2xl border border-zinc-300 bg-zinc-50 px-5 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#FF5A1F] lg:h-16 lg:px-6"
                    placeholder="contact@email.com"
                  />

                </div>

                <div>

                  <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-600 sm:text-sm">

                    Mot de Passe

                  </p>

                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    className="h-14 w-full rounded-2xl border border-zinc-300 bg-zinc-50 px-5 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#FF5A1F] lg:h-16 lg:px-6"
                    placeholder="••••••••"
                  />

                </div>

                <div className="flex justify-end">
                  <Link href="/forgot-password" className="text-sm text-zinc-500 hover:text-[#FF5A1F] transition">
                    Mot de passe oublié ?
                  </Link>
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

              <p className="mt-8 text-center text-sm text-zinc-600 lg:text-base">

                Vous n'avez pas encore de compte ?{" "}

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

      <PublicFooter />

    </main>
  );
}

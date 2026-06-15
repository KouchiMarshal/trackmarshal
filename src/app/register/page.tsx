"use client";

import { useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";
import PublicNavbar from "@/components/layout/public-navbar";
import { Toast, type ToastData } from "@/components/ui/toast";

export default function RegisterPage() {

  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [fullName, setFullName] =
    useState("");

  const [role, setRole] =
    useState("marshal");

  const [licenseType, setLicenseType] =
    useState("");

  const [licenseNumber, setLicenseNumber] =
    useState("");

  const [toast, setToast] =
    useState<ToastData>(null);

  async function handleRegister(
    e: React.FormEvent
  ) {

    e.preventDefault();

    if (role === "marshal" && !licenseType) {
      setToast({ message: "Veuillez sélectionner votre type de licence.", type: "error" });
      return;
    }

    if (role === "marshal" && !licenseNumber.trim()) {
      setToast({ message: "Veuillez renseigner votre numéro de licence.", type: "error" });
      return;
    }

    setLoading(true);

    const {
      data,
      error,
    } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {

      setLoading(false);

      setToast({ message: error.message, type: "error" });

      return;
    }

    const user = data.user;

    if (!user) {

      setLoading(false);

      setToast({ message: "Erreur lors de la création du compte.", type: "error" });

      return;
    }

    const profileData: any = {
      id: user.id,
      role,
      full_name: fullName,
    };

    if (role === "marshal") {
      profileData.license_type = licenseType;
      profileData.license_number = licenseNumber.trim();
    }

    await supabase
      .from("profiles")
      .insert(profileData);

    setLoading(false);

    if (role === "organizer") {
      router.push("/organizer/dashboard");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">

      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="absolute inset-0">

        <img
          src="https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=2070&auto=format&fit=crop"
          alt="Motorsport"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/80" />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/40" />

      </div>

      <div className="absolute right-0 top-0 h-[350px] w-[350px] rounded-full bg-[#FF5A1F]/10 blur-[120px] lg:h-[700px] lg:w-[700px] lg:blur-[220px]" />

      <PublicNavbar />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 pt-28 pb-10 sm:px-6 lg:px-8 lg:pt-32">

        <div className="grid w-full max-w-[1400px] gap-10 lg:grid-cols-2 lg:gap-20">

          <div className="hidden flex-col justify-center lg:flex">

            <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#FF5A1F]">

              Rejoindre la plateforme

            </p>

            <h1 className="mt-8 text-7xl font-black uppercase leading-[0.9] tracking-[-0.05em]">

              Commencez
              <br />

              votre
              <br />

              aventure.

            </h1>

            <p className="mt-10 max-w-2xl text-2xl leading-relaxed text-zinc-300">

              Rejoignez une plateforme moderne
              dédiée aux organisateurs et commissaires motorsport.

            </p>

          </div>

          <div className="flex items-center justify-center">

            <div className="w-full max-w-xl rounded-[32px] border border-white/10 bg-black/40 p-6 backdrop-blur-2xl sm:p-8 lg:rounded-[40px] lg:p-10">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F] sm:text-sm">

                  Inscription

                </p>

                <h2 className="mt-4 text-4xl font-black sm:text-5xl">

                  Créer un compte

                </h2>

                <p className="mt-5 text-base leading-relaxed text-zinc-400 lg:text-lg">

                  Rejoignez TrackMarshal et accédez
                  aux événements motorsport.

                </p>

              </div>

              <form
                onSubmit={handleRegister}
                className="mt-8 space-y-5 lg:mt-10 lg:space-y-6"
              >

                <div>

                  <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-400 sm:text-sm">

                    Nom complet

                  </p>

                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) =>
                      setFullName(
                        e.target.value
                      )
                    }
                    className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-5 text-white outline-none backdrop-blur-xl placeholder:text-zinc-500 focus:border-[#FF5A1F] lg:h-16 lg:px-6"
                    placeholder="Jean Dupont"
                  />

                </div>

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
                      setPassword(
                        e.target.value
                      )
                    }
                    className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-5 text-white outline-none backdrop-blur-xl placeholder:text-zinc-500 focus:border-[#FF5A1F] lg:h-16 lg:px-6"
                    placeholder="••••••••"
                  />

                </div>

                <div>

                  <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-400 sm:text-sm">

                    Type de compte

                  </p>

                  <select
                    value={role}
                    onChange={(e) =>
                      setRole(e.target.value)
                    }
                    className="h-14 w-full rounded-2xl border border-white/10 bg-[#111111] px-5 text-white outline-none focus:border-[#FF5A1F] lg:h-16 lg:px-6"
                  >

                    <option value="marshal">Commissaire</option>

                    <option value="organizer">Organisateur</option>

                  </select>

                </div>

                {role === "marshal" && (
                  <>
                    <div>
                      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-400 sm:text-sm">
                        Type de licence <span className="text-[#FF5A1F]">*</span>
                      </p>
                      <select
                        required
                        value={licenseType}
                        onChange={(e) => setLicenseType(e.target.value)}
                        className="h-14 w-full rounded-2xl border border-white/10 bg-[#111111] px-5 text-white outline-none focus:border-[#FF5A1F] lg:h-16 lg:px-6"
                      >
                        <option value="">Sélectionner un type</option>
                        <option value="ENCOC - Commissaire C">ENCOC - Commissaire C</option>
                        <option value="EICOB - Commissaire B">EICOB - Commissaire B</option>
                        <option value="EICOACPC - Commissaire">EICOACPC - Commissaire</option>
                      </select>
                    </div>

                    <div>
                      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-400 sm:text-sm">
                        Numéro de licence <span className="text-[#FF5A1F]">*</span>
                      </p>
                      <input
                        type="text"
                        required
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        placeholder="ex : 2024-FFSA-00123"
                        className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-5 text-white outline-none placeholder:text-zinc-500 focus:border-[#FF5A1F] lg:h-16 lg:px-6"
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="h-14 w-full rounded-2xl bg-[#FF5A1F] text-base font-black transition hover:scale-[1.01] hover:opacity-90 lg:h-16 lg:text-lg"
                >

                  {loading
                    ? "Création..."
                    : "Créer mon compte"}

                </button>

              </form>

              <p className="mt-8 text-center text-sm text-zinc-400 lg:text-base">

                Vous avez déjà un compte ?{" "}

                <Link
                  href="/login"
                  className="font-semibold text-[#FF5A1F]"
                >
                  Se connecter
                </Link>

              </p>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}
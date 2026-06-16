"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";
import { Toast, type ToastData } from "@/components/ui/toast";

export default function RegisterPage() {

  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace("/dashboard");
    });
  }, [router]);

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

  const [organizerOrgName, setOrganizerOrgName] =
    useState("");

  const [organizerDocFile, setOrganizerDocFile] =
    useState<File | null>(null);

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

    if (role === "organizer" && !organizerOrgName.trim()) {
      setToast({ message: "Veuillez renseigner le nom de votre ASA / ASK.", type: "error" });
      return;
    }

    if (role === "organizer" && !organizerDocFile) {
      setToast({ message: "Veuillez uploader un justificatif (document ASA / ASK).", type: "error" });
      return;
    }

    setLoading(true);

    // 1. Création du compte auth
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });

    if (authError || !authData.user) {
      setLoading(false);
      setToast({ message: authError?.message || "Erreur lors de la création du compte.", type: "error" });
      return;
    }

    const user = authData.user;

    // 2. Upload du justificatif organisateur via route admin (pas de session requise)
    let organizerDocUrl = "";
    if (role === "organizer" && organizerDocFile) {
      const formData = new FormData();
      formData.append("file", organizerDocFile);
      const res = await fetch("/api/upload-org-doc", { method: "POST", body: formData });
      const result = await res.json();
      if (!res.ok) {
        setLoading(false);
        setToast({ message: result.error || "Erreur lors de l'upload du justificatif.", type: "error" });
        return;
      }
      organizerDocUrl = result.publicUrl;
    }

    // 3. Création du profil
    const profileData: any = {
      id: user.id,
      role,
      full_name: fullName,
      email,
    };

    if (role === "marshal") {
      profileData.license_type = licenseType;
      profileData.license_number = licenseNumber.trim();
      profileData.license_verified = false;
      profileData.available = true;
    }

    if (role === "organizer") {
      profileData.organization_name = organizerOrgName.trim();
      profileData.organizer_doc_url = organizerDocUrl;
      profileData.organizer_verified = false;
    }

    const { error: profileError } = await supabase.from("profiles").insert(profileData);

    if (profileError) {
      setLoading(false);
      setToast({ message: "Erreur lors de la création du profil : " + profileError.message, type: "error" });
      return;
    }

    setLoading(false);

    router.push(role === "organizer" ? "/organizer/dashboard" : "/dashboard");
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
                        <option value="EICOB - Commissaire international B">EICOB - Commissaire international B</option>
                        <option value="EICOACPC - Chef de poste">EICOACPC - Chef de poste</option>
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

                {role === "organizer" && (
                  <>
                    <div className="rounded-2xl border border-[#FF5A1F]/20 bg-[#FF5A1F]/5 p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#FF5A1F]">Vérification organisateur</p>
                      <p className="mt-1.5 text-xs text-zinc-400">
                        Pour publier des événements, nous devons vérifier que vous représentez bien une ASA ou ASK agréée.
                        Votre compte sera validé par notre équipe sous 24h.
                      </p>
                    </div>

                    <div>
                      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-400 sm:text-sm">
                        Nom de votre ASA / ASK <span className="text-[#FF5A1F]">*</span>
                      </p>
                      <input
                        type="text"
                        required
                        value={organizerOrgName}
                        onChange={(e) => setOrganizerOrgName(e.target.value)}
                        placeholder="ex : ASA du Val de Loire"
                        className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-5 text-white outline-none placeholder:text-zinc-500 focus:border-[#FF5A1F] lg:h-16 lg:px-6"
                      />
                    </div>

                    <div>
                      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-400 sm:text-sm">
                        Justificatif officiel (agrément ASA/ASK) <span className="text-[#FF5A1F]">*</span>
                      </p>
                      <p className="mb-3 text-xs text-zinc-500">PDF, image — lettre d'agrément, statuts, ou carte de membre officielle.</p>
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        onChange={(e) => setOrganizerDocFile(e.target.files?.[0] || null)}
                        required
                        className="block w-full text-sm text-zinc-400 file:mr-4 file:rounded-xl file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-xs file:font-bold file:text-white"
                      />
                      {organizerDocFile && <p className="mt-2 text-xs text-green-400">✔ {organizerDocFile.name} sélectionné</p>}
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

      <PublicFooter />

    </main>
  );
}
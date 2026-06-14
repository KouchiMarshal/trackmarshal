"use client";

import {
  Camera,
  CheckCircle2,
  Save,
  Upload,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";
import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import { Toast, type ToastData } from "@/components/ui/toast";

export default function ProfilePage() {

  const [loading, setLoading] =
    useState(false);

  const [profile, setProfile] =
    useState<any>(null);

  const [toast, setToast] =
    useState<ToastData>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const licenseInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } =
      await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    setProfile(data);
  }

  async function uploadAvatar(file: File) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const ext = file.name.split(".").pop();
    const path = `${user.id}.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) { setToast({ message: error.message, type: "error" }); return; }
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
    await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", user.id);
    setProfile((p: any) => ({ ...p, avatar_url: publicUrl }));
    setToast({ message: "Photo de profil mise à jour !", type: "success" });
  }

  async function uploadLicense(file: File) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const ext = file.name.split(".").pop();
    const path = `${user.id}-license.${ext}`;
    const { error } = await supabase.storage.from("licenses").upload(path, file, { upsert: true });
    if (error) { setToast({ message: error.message, type: "error" }); return; }
    const { data: { publicUrl } } = supabase.storage.from("licenses").getPublicUrl(path);
    await supabase.from("profiles").update({ license_url: publicUrl }).eq("id", user.id);
    setToast({ message: "Licence envoyée, en attente de vérification.", type: "success" });
  }

  async function updateProfile() {

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
      .from("profiles")
      .update(profile)
      .eq("id", user.id);

    setLoading(false);

    setToast({ message: "Profil mis à jour avec succès !", type: "success" });
  }

  if (!profile) {

    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">

        Chargement...

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="flex min-h-screen">

        <DashboardSidebar />

        <div className="flex-1">

          <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur-2xl">

            <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-10">

              <div>

                <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">

                  Dashboard Commissaire

                </p>

                <h1 className="mt-2 text-2xl font-black lg:text-4xl">

                  Modifier mon profil

                </h1>

              </div>

              <button
                onClick={updateProfile}
                disabled={loading}
                className="flex h-12 items-center gap-3 rounded-2xl bg-[#FF5A1F] px-6 font-bold transition hover:scale-[1.02]"
              >

                <Save size={18} />

                {loading
                  ? "Sauvegarde..."
                  : "Sauvegarder"}

              </button>

            </div>

          </header>

          <div className="mx-auto max-w-[1600px] p-4 pb-24 sm:p-6 lg:p-10 lg:pb-10">

            <div className="grid gap-6 xl:grid-cols-[380px_1fr]">

              <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:p-8">

                <div className="flex flex-col items-center">

                  <div className="relative">

                    <img
                      src={
                        profile.avatar_url ||
                        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop"
                      }
                      className="h-40 w-40 rounded-[32px] object-cover"
                    />

                    <button
                      onClick={() => avatarInputRef.current?.click()}
                      className="absolute bottom-3 right-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF5A1F]"
                    >
                      <Camera size={20} />
                    </button>

                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) uploadAvatar(f);
                      }}
                    />

                  </div>

                  <h2 className="mt-6 text-3xl font-black">

                    {profile.full_name}

                  </h2>

                  <p className="mt-2 text-zinc-400">

                    Commissaire Motorsport

                  </p>

                  <div className={`mt-6 flex items-center gap-3 rounded-2xl border px-5 py-3 ${profile.license_verified ? "border-green-500/20 bg-green-500/10 text-green-400" : "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"}`}>

                    <CheckCircle2 size={18} />

                    <p className="font-semibold">

                      {profile.license_verified ? "Licence vérifiée" : "Vérification en attente"}

                    </p>

                  </div>

                </div>

                <div className="mt-10 space-y-5">

                  <div>

                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">

                      Expérience

                    </p>

                    <p className="mt-2 text-lg font-semibold">

                      {profile.experience ||
                        "Non renseigné"}

                    </p>

                  </div>

                  <div>

                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">

                      Pays

                    </p>

                    <p className="mt-2 text-lg font-semibold">

                      {profile.country ||
                        "Non renseigné"}

                    </p>

                  </div>

                  <div>

                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">

                      Langues

                    </p>

                    <p className="mt-2 text-lg font-semibold">

                      {profile.languages ||
                        "Non renseigné"}

                    </p>

                  </div>

                </div>

              </div>

              <div className="space-y-6">

                <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:p-8">

                  <h2 className="text-3xl font-black">

                    Informations personnelles

                  </h2>

                  <div className="mt-8 grid gap-5 md:grid-cols-2">

                    <div>

                      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">

                        Nom complet

                      </p>

                      <input
                        value={
                          profile.full_name || ""
                        }
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            full_name:
                              e.target.value,
                          })
                        }
                        className="h-14 w-full rounded-2xl border border-white/10 bg-black/40 px-5 outline-none focus:border-[#FF5A1F]"
                      />

                    </div>

                    <div>

                      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">

                        Téléphone

                      </p>

                      <input
                        value={
                          profile.phone || ""
                        }
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            phone:
                              e.target.value,
                          })
                        }
                        className="h-14 w-full rounded-2xl border border-white/10 bg-black/40 px-5 outline-none focus:border-[#FF5A1F]"
                      />

                    </div>

                    <div>

                      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">

                        Ville

                      </p>

                      <input
                        value={
                          profile.city || ""
                        }
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            city:
                              e.target.value,
                          })
                        }
                        className="h-14 w-full rounded-2xl border border-white/10 bg-black/40 px-5 outline-none focus:border-[#FF5A1F]"
                      />

                    </div>

                    <div>

                      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">

                        Pays

                      </p>

                      <input
                        value={
                          profile.country || ""
                        }
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            country:
                              e.target.value,
                          })
                        }
                        className="h-14 w-full rounded-2xl border border-white/10 bg-black/40 px-5 outline-none focus:border-[#FF5A1F]"
                      />

                    </div>

                  </div>

                </div>

                <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:p-8">

                  <h2 className="text-3xl font-black">

                    Motorsport

                  </h2>

                  <div className="mt-8 grid gap-5 md:grid-cols-2">

                    <div>

                      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">

                        Expérience

                      </p>

                      <input
                        value={
                          profile.experience || ""
                        }
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            experience:
                              e.target.value,
                          })
                        }
                        className="h-14 w-full rounded-2xl border border-white/10 bg-black/40 px-5 outline-none focus:border-[#FF5A1F]"
                      />

                    </div>

                    <div>

                      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">

                        Disciplines

                      </p>

                      <input
                        value={
                          profile.disciplines || ""
                        }
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            disciplines:
                              e.target.value,
                          })
                        }
                        className="h-14 w-full rounded-2xl border border-white/10 bg-black/40 px-5 outline-none focus:border-[#FF5A1F]"
                      />

                    </div>

                    <div>

                      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">

                        Spécialités

                      </p>

                      <input
                        value={
                          profile.specialties || ""
                        }
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            specialties:
                              e.target.value,
                          })
                        }
                        className="h-14 w-full rounded-2xl border border-white/10 bg-black/40 px-5 outline-none focus:border-[#FF5A1F]"
                      />

                    </div>

                    <div>

                      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">

                        Langues

                      </p>

                      <input
                        value={
                          profile.languages || ""
                        }
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            languages:
                              e.target.value,
                          })
                        }
                        className="h-14 w-full rounded-2xl border border-white/10 bg-black/40 px-5 outline-none focus:border-[#FF5A1F]"
                      />

                    </div>

                  </div>

                  <div className="mt-5">

                    <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">

                      Bio

                    </p>

                    <textarea
                      rows={6}
                      value={profile.bio || ""}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          bio: e.target.value,
                        })
                      }
                      className="w-full rounded-2xl border border-white/10 bg-black/40 p-5 outline-none focus:border-[#FF5A1F]"
                    />

                  </div>

                </div>

                <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:p-8">

                  <div className="flex items-center justify-between">

                    <div>

                      <h2 className="text-3xl font-black">

                        Licence

                      </h2>

                      <p className="mt-2 text-zinc-400">

                        Upload et validation administrateur

                      </p>

                    </div>

                    <button
                      onClick={() => licenseInputRef.current?.click()}
                      className="flex h-14 items-center gap-3 rounded-2xl bg-[#FF5A1F] px-6 font-bold transition hover:scale-[1.02]"
                    >
                      <Upload size={18} />
                      Upload
                    </button>

                    <input
                      ref={licenseInputRef}
                      type="file"
                      accept=".pdf,image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) uploadLicense(f);
                      }}
                    />

                  </div>

                  <div className="mt-8 rounded-[28px] border border-white/10 bg-black/30 p-6">

                    <p className="text-lg font-semibold">

                      {
                        profile.license_type ||
                        "Aucune licence"
                      }

                    </p>

                    <p className="mt-3 text-zinc-500">

                      Statut :
                      {" "}
                      {profile.license_verified
                        ? "Vérifiée"
                        : "En attente"}

                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}

"use client";

import {
  CheckCircle2,
  Clock,
  Upload,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

export default function MarshalProfileForm() {

  const [loading, setLoading] =
    useState(false);

  const [uploadingAvatar, setUploadingAvatar] =
    useState(false);

  const [uploadingLicense, setUploadingLicense] =
    useState(false);

  const [available, setAvailable] = useState(true);

  const [formData, setFormData] =
    useState({
      full_name: "",
      phone: "",
      country: "",
      city: "",
      bio: "",
      disciplines: "",
      specialties: "",
      experience: "",
      years_experience: "",
      languages: "",
      avatar_url: "",
      license_type: "",
      license_number: "",
      asa: "",
      license_url: "",
      license_type_2: "",
      license_number_2: "",
    });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setAvailable(data.available !== false);
      setFormData({
        full_name:
          data.full_name || "",
        phone:
          data.phone || "",
        country:
          data.country || "",
        city:
          data.city || "",
        bio:
          data.bio || "",
        disciplines:
          data.disciplines || "",
        specialties:
          data.specialties || "",
        experience:
          data.experience || "",
        years_experience:
          data.years_experience || "",
        languages:
          data.languages || "",
        avatar_url:
          data.avatar_url || "",
        license_type:
          data.license_type || "",
        license_number:
          data.license_number || "",
        asa:
          data.asa || "",
        license_url:
          data.license_url || "",
        license_type_2:
          data.license_type_2 || "",
        license_number_2:
          data.license_number_2 || "",
      });

    }
  }

  async function uploadAvatar(
    e: any
  ) {

    const file =
      e.target.files?.[0];

    if (!file) return;

    setUploadingAvatar(true);

    const fileExt =
      file.name.split(".").pop();

    const fileName =
      `${Date.now()}.${fileExt}`;

    const { error } =
      await supabase.storage
        .from("avatars")
        .upload(fileName, file);

    if (error) {

      alert(error.message);

      setUploadingAvatar(false);

      return;
    }

    const { data } =
      supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

    setFormData((prev) => ({
      ...prev,
      avatar_url:
        data.publicUrl,
    }));

    setUploadingAvatar(false);
  }

  async function uploadLicense(
    e: any
  ) {

    const file =
      e.target.files?.[0];

    if (!file) return;

    setUploadingLicense(true);

    const { data: { session } } =
      await supabase.auth.getSession();

    if (!session) {
      alert("Session expirée, veuillez vous reconnecter.");
      setUploadingLicense(false);
      return;
    }

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    const res = await fetch("/api/upload-license", {
      method: "POST",
      headers: { Authorization: `Bearer ${session.access_token}` },
      body: formDataUpload,
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.error || "Erreur lors de l'upload de la licence.");
      setUploadingLicense(false);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      license_url: result.publicUrl,
    }));

    setUploadingLicense(false);
  }

  async function handleSubmit(
    e: any
  ) {

    e.preventDefault();

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } =
      await supabase
        .from("profiles")
        .update({
          full_name:
            formData.full_name,
          phone:
            formData.phone,
          country:
            formData.country,
          city:
            formData.city,
          bio:
            formData.bio,
          disciplines:
            formData.disciplines,
          specialties:
            formData.specialties,
          experience:
            formData.experience,
          years_experience:
            formData.years_experience,
          languages:
            formData.languages,
          avatar_url:
            formData.avatar_url,
          license_type:
            formData.license_type,
          license_number:
            formData.license_number,
          asa:
            formData.asa || null,
          license_url:
            formData.license_url,
          license_type_2:
            formData.license_type_2 || null,
          license_number_2:
            formData.license_number_2 || null,
          available,
        })
        .eq("id", user.id);

    setLoading(false);

    if (error) {

      alert(error.message);

      return;
    }

    alert(
      "Profil mis à jour."
    );
  }

  return (
    <section className="rounded-[40px] border border-zinc-200 bg-white p-6 shadow-sm md:p-10">

      <div>

        <p className="text-sm uppercase tracking-[0.3em] text-[#FF5A1F]">

          Profil Commissaire

        </p>

        <h2 className="mt-4 text-4xl font-black text-zinc-900 md:text-5xl">

          Mon Profil

        </h2>

        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-zinc-600">

          Complétez votre profil professionnel motorsport
          afin d'être visible et recruté par les organisateurs.

        </p>

      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-10 space-y-10"
      >

        <div className="grid gap-10 lg:grid-cols-[320px_1fr]">

          <div className="rounded-[32px] border border-zinc-200 bg-zinc-50 p-8">

            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">

              Photo de Profil

            </p>

            <div className="mt-8 flex justify-center">

              <img
                src={
                  formData.avatar_url ||
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop"
                }
                alt="Avatar"
                className="h-52 w-52 rounded-[32px] border border-zinc-200 object-cover"
              />

            </div>

            <input
              type="file"
              accept="image/*"
              onChange={uploadAvatar}
              className="mt-8 block w-full text-sm text-zinc-500"
            />

            {uploadingAvatar && (

              <p className="mt-4 text-sm text-[#FF5A1F]">

                Upload photo...

              </p>

            )}

          </div>

          <div className="space-y-8">

            <div className="grid gap-6 md:grid-cols-2">

              <div>

                <label className="mb-3 block text-sm uppercase tracking-[0.2em] text-zinc-500">

                  Nom complet

                </label>

                <input
                  type="text"
                  value={
                    formData.full_name
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      full_name:
                        e.target.value,
                    })
                  }
                  className="h-16 w-full rounded-2xl border border-zinc-300 bg-zinc-50 px-6 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#FF5A1F]"
                />

              </div>

              <div>

                <label className="mb-3 block text-sm uppercase tracking-[0.2em] text-zinc-500">

                  Téléphone

                </label>

                <input
                  type="text"
                  value={
                    formData.phone
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone:
                        e.target.value,
                    })
                  }
                  placeholder="+33 6 00 00 00 00"
                  className="h-16 w-full rounded-2xl border border-zinc-300 bg-zinc-50 px-6 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#FF5A1F]"
                />

              </div>

            </div>

            <div className="grid gap-6 md:grid-cols-2">

              <div>

                <label className="mb-3 block text-sm uppercase tracking-[0.2em] text-zinc-500">

                  Pays

                </label>

                <input
                  type="text"
                  value={
                    formData.country
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      country:
                        e.target.value,
                    })
                  }
                  placeholder="France"
                  className="h-16 w-full rounded-2xl border border-zinc-300 bg-zinc-50 px-6 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#FF5A1F]"
                />

              </div>

              <div>

                <label className="mb-3 block text-sm uppercase tracking-[0.2em] text-zinc-500">

                  Ville

                </label>

                <input
                  type="text"
                  value={
                    formData.city
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      city:
                        e.target.value,
                    })
                  }
                  placeholder="Le Mans"
                  className="h-16 w-full rounded-2xl border border-zinc-300 bg-zinc-50 px-6 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#FF5A1F]"
                />

              </div>

            </div>

            <div>

              <label className="mb-3 block text-sm uppercase tracking-[0.2em] text-zinc-500">

                Biographie

              </label>

              <textarea
                value={
                  formData.bio
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bio:
                      e.target.value,
                  })
                }
                rows={6}
                className="w-full rounded-2xl border border-zinc-300 bg-zinc-50 p-6 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#FF5A1F]"
              />

            </div>

          </div>

        </div>

        <div className="grid gap-6 md:grid-cols-2">

          <div>

            <label className="mb-3 block text-sm uppercase tracking-[0.2em] text-zinc-500">

              Disciplines

            </label>

            <input
              type="text"
              value={
                formData.disciplines
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  disciplines:
                    e.target.value,
                })
              }
              placeholder="Ex: Rallye, Circuit, Moto Cross, Enduro..."
              className="h-16 w-full rounded-2xl border border-zinc-300 bg-zinc-50 px-6 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#FF5A1F]"
            />

          </div>

          <div>

            <label className="mb-3 block text-sm uppercase tracking-[0.2em] text-zinc-500">

              Langues

            </label>

            <input
              type="text"
              value={
                formData.languages
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  languages:
                    e.target.value,
                })
              }
              placeholder="Français, Anglais"
              className="h-16 w-full rounded-2xl border border-zinc-300 bg-zinc-50 px-6 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#FF5A1F]"
            />

          </div>

        </div>

        <div className="grid gap-6 md:grid-cols-2">

          <div>

            <label className="mb-3 block text-sm uppercase tracking-[0.2em] text-zinc-500">

              Expérience

            </label>

            <textarea
              value={
                formData.experience
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  experience:
                    e.target.value,
                })
              }
              rows={5}
              className="w-full rounded-2xl border border-zinc-300 bg-zinc-50 p-6 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#FF5A1F]"
            />

          </div>

          <div>

            <label className="mb-3 block text-sm uppercase tracking-[0.2em] text-zinc-500">

              Années d'expérience

            </label>

            <input
              type="text"
              value={
                formData.years_experience
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  years_experience:
                    e.target.value,
                })
              }
              placeholder="8 ans"
              className="h-16 w-full rounded-2xl border border-zinc-300 bg-zinc-50 px-6 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#FF5A1F]"
            />

            <label className="mb-3 mt-8 block text-sm uppercase tracking-[0.2em] text-zinc-500">

              Spécialités

            </label>

            <input
              type="text"
              value={
                formData.specialties
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  specialties:
                    e.target.value,
                })
              }
              placeholder="FFSA, FIA, Endurance..."
              className="h-16 w-full rounded-2xl border border-zinc-300 bg-zinc-50 px-6 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#FF5A1F]"
            />

          </div>

        </div>

        <div className="rounded-[32px] border border-[#FF5A1F]/20 bg-[#FF5A1F]/5 p-8">

          <p className="text-sm uppercase tracking-[0.3em] text-[#FF5A1F]">

            Licence (FFSA / FFM)

          </p>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">

            <div className="space-y-6">

              <div>

                <label className="mb-3 block text-sm uppercase tracking-[0.2em] text-zinc-500">
                  Type de Licence <span className="text-[#FF5A1F]">*</span>
                </label>

                <select
                  required
                  value={formData.license_type}
                  onChange={(e) =>
                    setFormData({ ...formData, license_type: e.target.value })
                  }
                  className="h-16 w-full rounded-2xl border border-zinc-300 bg-zinc-50 px-6 text-zinc-900 outline-none focus:border-[#FF5A1F]"
                >
                  <option value="">Sélectionner un type</option>
                  <optgroup label="FFSA — Auto">
                    <option value="ENCOC - Commissaire C">ENCOC - Commissaire C</option>
                    <option value="EICOB - Commissaire international B">EICOB - Commissaire international B</option>
                    <option value="EICOACPC - CHEF DE POSTE CIRCUIT">EICOACPC - CHEF DE POSTE CIRCUIT</option>
                    <option value="EICOACPR - CHEF DE POSTE ROUTE">EICOACPR - CHEF DE POSTE ROUTE</option>
                  </optgroup>
                  <optgroup label="FFM — Moto">
                    <option value="OFS - Officiel Stagiaire">OFS - Officiel Stagiaire</option>
                    <option value="OFF - Officiel">OFF - Officiel</option>
                  </optgroup>
                </select>

              </div>

              <div>

                <label className="mb-3 block text-sm uppercase tracking-[0.2em] text-zinc-500">
                  Numéro de Licence <span className="text-[#FF5A1F]">*</span>
                </label>

                <input
                  type="text"
                  required
                  value={formData.license_number}
                  onChange={(e) =>
                    setFormData({ ...formData, license_number: e.target.value })
                  }
                  placeholder="ex : 2024-FFSA-00123"
                  className="h-16 w-full rounded-2xl border border-zinc-300 bg-zinc-50 px-6 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#FF5A1F]"
                />

              </div>

              <div>

                <label className="mb-3 block text-sm uppercase tracking-[0.2em] text-zinc-500">
                  ASA (Association Sportive Automobile)
                </label>

                <input
                  type="text"
                  value={formData.asa}
                  onChange={(e) => setFormData({ ...formData, asa: e.target.value })}
                  placeholder="ex : ASA Lyon, ASA Côte d'Azur..."
                  className="h-16 w-full rounded-2xl border border-zinc-300 bg-zinc-50 px-6 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#FF5A1F]"
                />

              </div>

            </div>

            <div>

              <label className="mb-3 block text-sm uppercase tracking-[0.2em] text-zinc-500">
                Upload Licence
              </label>

              {/* Aucune licence */}
              {!formData.license_url && !uploadingLicense && (
                <label className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center hover:border-[#FF5A1F]/40 transition">
                  <Upload size={24} className="text-zinc-400" />
                  <span className="text-sm text-zinc-600">Cliquez pour uploader votre licence</span>
                  <span className="text-xs text-zinc-400">PDF ou image acceptés</span>
                  <input type="file" accept=".pdf,image/*" onChange={uploadLicense} className="hidden" />
                </label>
              )}

              {/* Upload en cours */}
              {uploadingLicense && (
                <div className="flex items-center justify-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-8">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#FF5A1F] border-t-transparent" />
                  <span className="text-sm text-zinc-600">Envoi en cours...</span>
                </div>
              )}

              {/* En attente de validation */}
              {formData.license_url && !uploadingLicense && (
                <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-yellow-600" />
                    <p className="font-bold text-yellow-700">En attente de validation</p>
                  </div>
                  <p className="mt-1 text-xs text-zinc-600">
                    Votre licence a bien été reçue et sera vérifiée par notre équipe.
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <a href={formData.license_url} target="_blank" className="text-xs font-bold text-[#FF5A1F] underline underline-offset-2">
                      Voir le fichier envoyé
                    </a>
                    <label className="cursor-pointer text-xs text-zinc-500 hover:text-zinc-900 transition">
                      Remplacer
                      <input type="file" accept=".pdf,image/*" onChange={uploadLicense} className="hidden" />
                    </label>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

        {/* Deuxième licence (optionnelle) */}
        <div className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm lg:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">2ème Licence (optionnelle)</p>
              <p className="mt-1 text-xs text-zinc-400">Si vous avez une licence auto ET moto, ajoutez la seconde ici.</p>
            </div>
            {formData.license_type_2 && (
              <button
                type="button"
                onClick={() => setFormData({ ...formData, license_type_2: "", license_number_2: "" })}
                className="text-xs text-zinc-500 hover:text-red-500 transition"
              >
                Supprimer
              </button>
            )}
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-3 block text-sm uppercase tracking-[0.2em] text-zinc-500">Type de licence</label>
              <select
                value={formData.license_type_2}
                onChange={(e) => setFormData({ ...formData, license_type_2: e.target.value })}
                className="h-16 w-full rounded-2xl border border-zinc-300 bg-zinc-50 px-6 text-zinc-900 outline-none focus:border-[#FF5A1F]"
              >
                <option value="">— Aucune 2ème licence —</option>
                <optgroup label="FFSA — Auto">
                  <option value="ENCOC - Commissaire C">ENCOC - Commissaire C</option>
                  <option value="EICOB - Commissaire international B">EICOB - Commissaire international B</option>
                  <option value="EICOACPC - Chef de poste">EICOACPC - Chef de poste</option>
                </optgroup>
                <optgroup label="FFM — Moto">
                  <option value="OFS - Officiel Stagiaire">OFS - Officiel Stagiaire</option>
                  <option value="OFF - Officiel">OFF - Officiel</option>
                </optgroup>
              </select>
            </div>
            <div>
              <label className="mb-3 block text-sm uppercase tracking-[0.2em] text-zinc-500">Numéro de licence</label>
              <input
                type="text"
                value={formData.license_number_2}
                onChange={(e) => setFormData({ ...formData, license_number_2: e.target.value })}
                placeholder="ex : 2024-FFM-00456"
                className="h-16 w-full rounded-2xl border border-zinc-300 bg-zinc-50 px-6 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#FF5A1F]"
              />
            </div>
          </div>
          {formData.license_type_2 && (
            <p className="mt-4 text-xs text-zinc-500">
              Le document de la 2ème licence se soumet depuis votre page Profil → section "2ème Licence".
            </p>
          )}
        </div>

        <div className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm lg:p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Statut de disponibilité</p>
          <p className="mt-2 text-xs text-zinc-400">Visible sur votre profil public. Les organisateurs filtrent par disponibilité.</p>
          <div className="mt-5 flex items-center gap-5">
            <button
              type="button"
              onClick={() => setAvailable(true)}
              className={`flex h-14 flex-1 items-center justify-center gap-3 rounded-2xl font-bold transition ${
                available
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "border border-zinc-200 text-zinc-500 hover:text-zinc-900"
              }`}
            >
              <span className={`h-3 w-3 rounded-full ${available ? "bg-green-500" : "bg-zinc-300"}`} />
              Disponible
            </button>
            <button
              type="button"
              onClick={() => setAvailable(false)}
              className={`flex h-14 flex-1 items-center justify-center gap-3 rounded-2xl font-bold transition ${
                !available
                  ? "bg-red-100 text-red-700 border border-red-200"
                  : "border border-zinc-200 text-zinc-500 hover:text-zinc-900"
              }`}
            >
              <span className={`h-3 w-3 rounded-full ${!available ? "bg-red-500" : "bg-zinc-300"}`} />
              Indisponible
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-16 w-full rounded-2xl bg-[#FF5A1F] text-lg font-black text-white transition hover:scale-[1.01]"
        >

          {loading
            ? "Sauvegarde..."
            : "Sauvegarder Mon Profil"}

        </button>

      </form>

    </section>
  );
}

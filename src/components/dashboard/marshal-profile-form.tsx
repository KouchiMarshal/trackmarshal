"use client";

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
      license_url: "",
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
        license_url:
          data.license_url || "",
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

    const fileExt =
      file.name.split(".").pop();

    const fileName =
      `${Date.now()}.${fileExt}`;

    const { error } =
      await supabase.storage
        .from("licenses")
        .upload(fileName, file);

    if (error) {

      alert(error.message);

      setUploadingLicense(false);

      return;
    }

    const { data } =
      supabase.storage
        .from("licenses")
        .getPublicUrl(fileName);

    setFormData((prev) => ({
      ...prev,
      license_url:
        data.publicUrl,
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
          license_url:
            formData.license_url,
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
    <section className="rounded-[40px] border border-white/10 bg-[#0A0A0A] p-6 md:p-10">

      <div>

        <p className="text-sm uppercase tracking-[0.3em] text-[#FF5A1F]">

          Profil Commissaire

        </p>

        <h2 className="mt-4 text-4xl font-black md:text-5xl">

          Mon Profil

        </h2>

        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-zinc-400">

          Complétez votre profil professionnel motorsport
          afin d’être visible et recruté par les organisateurs.

        </p>

      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-10 space-y-10"
      >

        <div className="grid gap-10 lg:grid-cols-[320px_1fr]">

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8">

            <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">

              Photo de Profil

            </p>

            <div className="mt-8 flex justify-center">

              <img
                src={
                  formData.avatar_url ||
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop"
                }
                alt="Avatar"
                className="h-52 w-52 rounded-[32px] border border-white/10 object-cover"
              />

            </div>

            <input
              type="file"
              accept="image/*"
              onChange={uploadAvatar}
              className="mt-8 block w-full text-sm text-zinc-400"
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

                <label className="mb-3 block text-sm uppercase tracking-[0.2em] text-zinc-400">

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
                  className="h-16 w-full rounded-2xl border border-white/10 bg-white/5 px-6 text-white outline-none"
                />

              </div>

              <div>

                <label className="mb-3 block text-sm uppercase tracking-[0.2em] text-zinc-400">

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
                  className="h-16 w-full rounded-2xl border border-white/10 bg-white/5 px-6 text-white outline-none"
                />

              </div>

            </div>

            <div className="grid gap-6 md:grid-cols-2">

              <div>

                <label className="mb-3 block text-sm uppercase tracking-[0.2em] text-zinc-400">

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
                  className="h-16 w-full rounded-2xl border border-white/10 bg-white/5 px-6 text-white outline-none"
                />

              </div>

              <div>

                <label className="mb-3 block text-sm uppercase tracking-[0.2em] text-zinc-400">

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
                  className="h-16 w-full rounded-2xl border border-white/10 bg-white/5 px-6 text-white outline-none"
                />

              </div>

            </div>

            <div>

              <label className="mb-3 block text-sm uppercase tracking-[0.2em] text-zinc-400">

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
                className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 text-white outline-none"
              />

            </div>

          </div>

        </div>

        <div className="grid gap-6 md:grid-cols-2">

          <div>

            <label className="mb-3 block text-sm uppercase tracking-[0.2em] text-zinc-400">

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
              placeholder="Endurance, Rallye, Drift..."
              className="h-16 w-full rounded-2xl border border-white/10 bg-white/5 px-6 text-white outline-none"
            />

          </div>

          <div>

            <label className="mb-3 block text-sm uppercase tracking-[0.2em] text-zinc-400">

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
              className="h-16 w-full rounded-2xl border border-white/10 bg-white/5 px-6 text-white outline-none"
            />

          </div>

        </div>

        <div className="grid gap-6 md:grid-cols-2">

          <div>

            <label className="mb-3 block text-sm uppercase tracking-[0.2em] text-zinc-400">

              Expérience Motorsport

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
              className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 text-white outline-none"
            />

          </div>

          <div>

            <label className="mb-3 block text-sm uppercase tracking-[0.2em] text-zinc-400">

              Années d’expérience

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
              className="h-16 w-full rounded-2xl border border-white/10 bg-white/5 px-6 text-white outline-none"
            />

            <label className="mb-3 mt-8 block text-sm uppercase tracking-[0.2em] text-zinc-400">

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
              className="h-16 w-full rounded-2xl border border-white/10 bg-white/5 px-6 text-white outline-none"
            />

          </div>

        </div>

        <div className="rounded-[32px] border border-[#FF5A1F]/20 bg-[#FF5A1F]/5 p-8">

          <p className="text-sm uppercase tracking-[0.3em] text-[#FF5A1F]">

            Licence Motorsport

          </p>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">

            <div className="space-y-6">

              <div>

                <label className="mb-3 block text-sm uppercase tracking-[0.2em] text-zinc-400">
                  Type de Licence <span className="text-[#FF5A1F]">*</span>
                </label>

                <select
                  required
                  value={formData.license_type}
                  onChange={(e) =>
                    setFormData({ ...formData, license_type: e.target.value })
                  }
                  className="h-16 w-full rounded-2xl border border-white/10 bg-[#111111] px-6 text-white outline-none focus:border-[#FF5A1F]"
                >
                  <option value="">Sélectionner un type</option>
                  <option value="ENCOC - Commissaire C">ENCOC - Commissaire C</option>
                  <option value="EICOB - Commissaire international B">EICOB - Commissaire international B</option>
                  <option value="EICOACPC - Chef de poste">EICOACPC - Chef de poste</option>
                </select>

              </div>

              <div>

                <label className="mb-3 block text-sm uppercase tracking-[0.2em] text-zinc-400">
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
                  className="h-16 w-full rounded-2xl border border-white/10 bg-white/5 px-6 text-white outline-none placeholder:text-zinc-600 focus:border-[#FF5A1F]"
                />

              </div>

            </div>

            <div>

              <label className="mb-3 block text-sm uppercase tracking-[0.2em] text-zinc-400">

                Upload Licence

              </label>

              <input
                type="file"
                accept=".pdf,image/*"
                onChange={
                  uploadLicense
                }
                className="block w-full text-sm text-zinc-400"
              />

              {uploadingLicense && (

                <p className="mt-4 text-sm text-[#FF5A1F]">

                  Upload licence...

                </p>

              )}

              {formData.license_url && (

                <a
                  href={
                    formData.license_url
                  }
                  target="_blank"
                  className="mt-5 inline-block text-sm font-bold text-[#FF5A1F]"
                >

                  Voir la licence

                </a>

              )}

            </div>

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
"use client";

import {
  CheckCircle2,
  Clock,
  ExternalLink,
  Trash2,
  Upload,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

// ─── LicenseCard ─────────────────────────────────────────────────────────────

type License = {
  id: string;
  type: string;
  category: string;
  number: string;
  asa: string;
  url: string;
  verified: boolean;
};

function LicenseCard({
  license,
  onUpdate,
  onDelete,
  onUpload,
  uploadingId,
  savingId,
}: {
  license: License;
  onUpdate: (id: string, fields: Partial<License>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpload: (id: string, file: File) => Promise<void>;
  uploadingId: string | null;
  savingId: string | null;
}) {
  const [local, setLocal] = useState<License>(license);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync if parent changes (e.g. after upload)
  useEffect(() => {
    setLocal(license);
  }, [license]);

  const isUploading = uploadingId === license.id;
  const isSaving = savingId === license.id;

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onUpload(license.id, file);
  }

  // Verified badge
  let badge: React.ReactNode;
  if (license.verified) {
    badge = (
      <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
        <CheckCircle2 size={12} /> Validée
      </span>
    );
  } else if (license.url) {
    badge = (
      <span className="flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
        <Clock size={12} /> En attente
      </span>
    );
  } else {
    badge = (
      <span className="flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-500">
        Sans document
      </span>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        {badge}
        <button
          type="button"
          onClick={() => onDelete(license.id)}
          className="flex items-center gap-1.5 rounded-xl border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-50"
        >
          <Trash2 size={12} /> Supprimer
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-zinc-500">
            Type de licence
          </label>
          <input
            type="text"
            value={local.type}
            onChange={(e) => setLocal((p) => ({ ...p, type: e.target.value }))}
            placeholder="Ex: FFSA Circuit, FFM Enduro, Licence club..."
            className="h-12 w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#FF5A1F]"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-zinc-500">
            Fédération
          </label>
          <select
            value={local.category}
            onChange={(e) => setLocal((p) => ({ ...p, category: e.target.value }))}
            className="h-12 w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 text-sm text-zinc-900 outline-none focus:border-[#FF5A1F]"
          >
            <option value="auto">FFSA (Auto)</option>
            <option value="moto">FFM (Moto)</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-zinc-500">
            Numéro de licence
          </label>
          <input
            type="text"
            value={local.number}
            onChange={(e) => setLocal((p) => ({ ...p, number: e.target.value }))}
            placeholder="ex : 2024-FFSA-00123"
            className="h-12 w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#FF5A1F]"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-zinc-500">
            ASA
          </label>
          <input
            type="text"
            value={local.asa}
            onChange={(e) => setLocal((p) => ({ ...p, asa: e.target.value }))}
            placeholder="ex : ASA Lyon, ASA Côte d'Azur..."
            className="h-12 w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#FF5A1F]"
          />
        </div>
      </div>

      {/* Document upload */}
      <div className="mt-4">
        {isUploading ? (
          <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#FF5A1F] border-t-transparent" />
            <span className="text-sm text-zinc-600">Envoi en cours...</span>
          </div>
        ) : license.url ? (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
            <a
              href={license.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-bold text-[#FF5A1F] underline underline-offset-2"
            >
              <ExternalLink size={14} /> Voir le document
            </a>
            <label className="cursor-pointer text-xs text-zinc-500 transition hover:text-zinc-900">
              Remplacer
              <input
                type="file"
                accept=".pdf,image/*"
                className="hidden"
                onChange={handleFile}
              />
            </label>
          </div>
        ) : (
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-3 transition hover:border-[#FF5A1F]/40">
            <Upload size={16} className="text-zinc-400" />
            <span className="text-sm text-zinc-600">Uploader le document (PDF ou image)</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,image/*"
              className="hidden"
              onChange={handleFile}
            />
          </label>
        )}
      </div>

      {/* Save button */}
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          disabled={isSaving}
          onClick={() =>
            onUpdate(license.id, {
              type: local.type,
              category: local.category,
              number: local.number,
              asa: local.asa,
            })
          }
          className="flex h-10 items-center gap-2 rounded-xl bg-[#FF5A1F] px-5 text-sm font-bold text-white transition hover:scale-[1.02] disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Sauvegarde...
            </>
          ) : (
            "Sauvegarder"
          )}
        </button>
      </div>
    </div>
  );
}

// ─── MarshalProfileForm ───────────────────────────────────────────────────────

export default function MarshalProfileForm() {
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [available, setAvailable] = useState(true);

  const [formData, setFormData] = useState({
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
    // Kept for backward-compat DB update (not shown in form UI)
    license_type: "",
    license_number: "",
    asa: "",
    license_url: "",
    license_type_2: "",
    license_number_2: "",
  });

  // License system
  const [licenses, setLicenses] = useState<License[]>([]);
  const [uploadingLicenseId, setUploadingLicenseId] = useState<string | null>(null);
  const [savingLicenseId, setSavingLicenseId] = useState<string | null>(null);
  const [addingLicense, setAddingLicense] = useState(false);

  useEffect(() => {
    loadProfile();
    loadLicenses();
  }, []);

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setAvailable(data.available !== false);
      setFormData({
        full_name: data.full_name || "",
        phone: data.phone || "",
        country: data.country || "",
        city: data.city || "",
        bio: data.bio || "",
        disciplines: data.disciplines || "",
        specialties: data.specialties || "",
        experience: data.experience || "",
        years_experience: data.years_experience || "",
        languages: data.languages || "",
        avatar_url: data.avatar_url || "",
        license_type: data.license_type || "",
        license_number: data.license_number || "",
        asa: data.asa || "",
        license_url: data.license_url || "",
        license_type_2: data.license_type_2 || "",
        license_number_2: data.license_number_2 || "",
      });
    }
  }

  async function loadLicenses() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const res = await fetch("/api/licenses", {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    if (res.ok) {
      const json = await res.json();
      setLicenses(json.licenses || []);
    }
  }

  async function uploadAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage.from("avatars").upload(fileName, file);

    if (error) {
      alert(error.message);
      setUploadingAvatar(false);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);

    setFormData((prev) => ({ ...prev, avatar_url: data.publicUrl }));
    setUploadingAvatar(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: formData.full_name,
        phone: formData.phone,
        country: formData.country,
        city: formData.city,
        bio: formData.bio,
        disciplines: formData.disciplines,
        specialties: formData.specialties,
        experience: formData.experience,
        years_experience: formData.years_experience,
        languages: formData.languages,
        avatar_url: formData.avatar_url,
        // Backward compat — kept but not updated by new form
        license_type: formData.license_type,
        license_number: formData.license_number,
        asa: formData.asa || null,
        license_type_2: formData.license_type_2 || null,
        license_number_2: formData.license_number_2 || null,
        available,
      })
      .eq("id", user.id);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Profil mis à jour.");
  }

  // ── License management functions ──────────────────────────────────────────

  async function addLicense() {
    setAddingLicense(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setAddingLicense(false); return; }

    const res = await fetch("/api/licenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ type: "", category: "auto", number: "", asa: "" }),
    });

    if (res.ok) {
      const json = await res.json();
      setLicenses((prev) => [...prev, json.license]);
    }
    setAddingLicense(false);
  }

  async function updateLicense(id: string, fields: Partial<License>) {
    setSavingLicenseId(id);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setSavingLicenseId(null); return; }

    const res = await fetch("/api/licenses", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ id, ...fields }),
    });

    if (res.ok) {
      const json = await res.json();
      setLicenses((prev) =>
        prev.map((l) => (l.id === id ? { ...l, ...json.license } : l))
      );
    }
    setSavingLicenseId(null);
  }

  async function deleteLicense(id: string) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const res = await fetch("/api/licenses", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setLicenses((prev) => prev.filter((l) => l.id !== id));
    }
  }

  async function uploadLicenseDoc(id: string, file: File) {
    setUploadingLicenseId(id);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setUploadingLicenseId(null); return; }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("licenseId", id);

    const res = await fetch("/api/licenses/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${session.access_token}` },
      body: formData,
    });

    if (res.ok) {
      const json = await res.json();
      setLicenses((prev) =>
        prev.map((l) => (l.id === id ? { ...l, url: json.url, verified: false } : l))
      );
    } else {
      const json = await res.json();
      alert(json.error || "Erreur lors de l'upload.");
    }
    setUploadingLicenseId(null);
  }

  // ─────────────────────────────────────────────────────────────────────────

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

      <form onSubmit={handleSubmit} className="mt-10 space-y-10">

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
              <p className="mt-4 text-sm text-[#FF5A1F]">Upload photo...</p>
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
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="h-16 w-full rounded-2xl border border-zinc-300 bg-zinc-50 px-6 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#FF5A1F]"
                />
              </div>
              <div>
                <label className="mb-3 block text-sm uppercase tracking-[0.2em] text-zinc-500">
                  Téléphone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
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
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
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
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
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
              value={formData.disciplines}
              onChange={(e) => setFormData({ ...formData, disciplines: e.target.value })}
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
              value={formData.languages}
              onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
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
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
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
              value={formData.years_experience}
              onChange={(e) => setFormData({ ...formData, years_experience: e.target.value })}
              placeholder="8 ans"
              className="h-16 w-full rounded-2xl border border-zinc-300 bg-zinc-50 px-6 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#FF5A1F]"
            />
            <label className="mb-3 mt-8 block text-sm uppercase tracking-[0.2em] text-zinc-500">
              Spécialités
            </label>
            <input
              type="text"
              value={formData.specialties}
              onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
              placeholder="FFSA, FIA, Endurance..."
              className="h-16 w-full rounded-2xl border border-zinc-300 bg-zinc-50 px-6 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#FF5A1F]"
            />
          </div>
        </div>

        {/* ── Mes licences ── */}
        <div className="rounded-[32px] border border-[#FF5A1F]/20 bg-[#FF5A1F]/5 p-8">
          <div className="flex items-center justify-between">
            <p className="text-sm uppercase tracking-[0.3em] text-[#FF5A1F]">
              Mes licences
            </p>
            <button
              type="button"
              onClick={addLicense}
              disabled={addingLicense}
              className="flex h-10 items-center gap-2 rounded-xl bg-[#FF5A1F] px-5 text-sm font-bold text-white transition hover:scale-[1.02] disabled:opacity-50"
            >
              {addingLicense ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ...
                </>
              ) : (
                "+ Ajouter une licence"
              )}
            </button>
          </div>

          {licenses.length === 0 && !addingLicense && (
            <p className="mt-6 text-sm text-zinc-400">
              Aucune licence. Ajoutez-en une.
            </p>
          )}

          <div className="mt-6 space-y-4">
            {licenses.map((lic) => (
              <LicenseCard
                key={lic.id}
                license={lic}
                onUpdate={updateLicense}
                onDelete={deleteLicense}
                onUpload={uploadLicenseDoc}
                uploadingId={uploadingLicenseId}
                savingId={savingLicenseId}
              />
            ))}
          </div>
        </div>

        {/* ── Disponibilité ── */}
        <div className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm lg:p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Statut de disponibilité</p>
          <p className="mt-2 text-xs text-zinc-400">
            Visible sur votre profil public. Les organisateurs filtrent par disponibilité.
          </p>
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
          {loading ? "Sauvegarde..." : "Sauvegarder Mon Profil"}
        </button>

      </form>

    </section>
  );
}

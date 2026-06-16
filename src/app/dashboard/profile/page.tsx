"use client";

import {
  Camera,
  CheckCircle2,
  Clock,
  Plus,
  Save,
  Upload,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";
import { isAutoLicense, isMotoLicense } from "@/lib/licenseUtils";
import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import NotificationBell from "@/components/notifications/notification-bell";
import { Toast, type ToastData } from "@/components/ui/toast";

const LICENSE_TYPES_FFSA = [
  "ENCOC - Commissaire C",
  "EICOB - Commissaire international B",
  "EICOACPC - Chef de poste",
];

const LICENSE_TYPES_FFM = [
  "FFM - Commissaire de Course",
  "FFM - Commissaire International",
  "FFM - Chef de Poste",
];

export default function ProfilePage() {

  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [toast, setToast] = useState<ToastData>(null);
  const [uploadingLicense, setUploadingLicense] = useState(false);
  const [uploadingLicense2, setUploadingLicense2] = useState(false);
  const [showAddLicense2, setShowAddLicense2] = useState(false);
  const [addLicense2Form, setAddLicense2Form] = useState({ license_type: "", license_number: "" });
  const [savingLicense2Info, setSavingLicense2Info] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const licenseInputRef = useRef<HTMLInputElement>(null);
  const license2InputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadProfile(); }, []);

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
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
    setUploadingLicense(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setToast({ message: "Session expirée, veuillez vous reconnecter.", type: "error" });
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
    setUploadingLicense(false);
    if (!res.ok) {
      setToast({ message: result.error || "Erreur lors de l'upload de la licence.", type: "error" });
      return;
    }
    setProfile((p: any) => ({ ...p, license_url: result.publicUrl, license_verified: false }));
    setToast({ message: "Licence envoyée, en attente de vérification.", type: "success" });
  }

  async function uploadLicense2(file: File) {
    setUploadingLicense2(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setToast({ message: "Session expirée, veuillez vous reconnecter.", type: "error" });
      setUploadingLicense2(false);
      return;
    }
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    const res = await fetch("/api/upload-license-2", {
      method: "POST",
      headers: { Authorization: `Bearer ${session.access_token}` },
      body: formDataUpload,
    });
    const result = await res.json();
    setUploadingLicense2(false);
    if (!res.ok) {
      setToast({ message: result.error || "Erreur lors de l'upload.", type: "error" });
      return;
    }
    setProfile((p: any) => ({ ...p, license_url_2: result.publicUrl, license_verified_2: false }));
    setToast({ message: "2ème licence envoyée, en attente de vérification.", type: "success" });
  }

  async function saveLicense2Info() {
    if (!addLicense2Form.license_type) {
      setToast({ message: "Veuillez sélectionner un type de licence.", type: "error" });
      return;
    }
    setSavingLicense2Info(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("profiles").update({
      license_type_2: addLicense2Form.license_type,
      license_number_2: addLicense2Form.license_number || null,
    }).eq("id", user.id);
    setProfile((p: any) => ({
      ...p,
      license_type_2: addLicense2Form.license_type,
      license_number_2: addLicense2Form.license_number || null,
    }));
    setSavingLicense2Info(false);
    setShowAddLicense2(false);
    setToast({ message: "Informations enregistrées. Uploadez maintenant le document.", type: "success" });
  }

  async function updateProfile() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("profiles").update(profile).eq("id", user.id);
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

  const primaryIsAuto = isAutoLicense(profile.license_type);
  const primaryIsMoto = isMotoLicense(profile.license_type);
  const canAddSecondLicense = (primaryIsAuto || primaryIsMoto) && !profile.license_type_2;
  const secondCategory = primaryIsAuto ? "moto" : primaryIsMoto ? "auto" : null;
  const secondLicenseTypes = secondCategory === "auto" ? LICENSE_TYPES_FFSA : LICENSE_TYPES_FFM;
  const secondLicenseLabel = secondCategory === "auto" ? "Licence FFSA (Auto)" : "Licence FFM (Moto)";

  return (
    <main className="min-h-screen bg-black text-white">

      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="flex min-h-screen">

        <DashboardSidebar />

        <div className="flex-1">

          <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur-2xl">
            <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-10">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Dashboard Commissaire</p>
                <h1 className="mt-2 text-2xl font-black lg:text-4xl">Modifier mon profil</h1>
              </div>
              <div className="flex items-center gap-3">
                <NotificationBell />
                <button
                  onClick={updateProfile}
                  disabled={loading}
                  className="flex h-12 items-center gap-3 rounded-2xl bg-[#FF5A1F] px-6 font-bold transition hover:scale-[1.02]"
                >
                  <Save size={18} />
                  {loading ? "Sauvegarde..." : "Sauvegarder"}
                </button>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1600px] p-4 pb-24 sm:p-6 lg:p-10 lg:pb-10">

            <div className="grid gap-6 xl:grid-cols-[380px_1fr]">

              {/* Left — avatar + status */}
              <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:p-8">

                <div className="flex flex-col items-center">

                  <div className="relative">
                    <img
                      src={profile.avatar_url || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop"}
                      className="h-40 w-40 rounded-[32px] object-cover"
                    />
                    <button
                      onClick={() => avatarInputRef.current?.click()}
                      className="absolute bottom-3 right-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF5A1F]"
                    >
                      <Camera size={20} />
                    </button>
                    <input ref={avatarInputRef} type="file" accept="image/*" className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadAvatar(f); }} />
                  </div>

                  <h2 className="mt-6 text-3xl font-black">{profile.full_name}</h2>
                  <p className="mt-2 text-zinc-400">Commissaire Motorsport</p>

                  <div className={`mt-6 flex w-full items-center gap-3 rounded-2xl border px-5 py-3 ${profile.license_verified ? "border-green-500/20 bg-green-500/10 text-green-400" : "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"}`}>
                    <CheckCircle2 size={18} />
                    <div>
                      <p className="font-semibold text-sm">{profile.license_verified ? "Licence vérifiée" : "Vérification en attente"}</p>
                      {profile.license_type && <p className="text-xs opacity-70">{profile.license_type}</p>}
                    </div>
                  </div>

                  {profile.license_type_2 && (
                    <div className={`mt-3 flex w-full items-center gap-3 rounded-2xl border px-5 py-3 ${profile.license_verified_2 ? "border-green-500/20 bg-green-500/10 text-green-400" : "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"}`}>
                      <CheckCircle2 size={18} />
                      <div>
                        <p className="font-semibold text-sm">{profile.license_verified_2 ? "2ème licence vérifiée" : "2ème licence en attente"}</p>
                        <p className="text-xs opacity-70">{profile.license_type_2}</p>
                      </div>
                    </div>
                  )}

                </div>

                <div className="mt-8 rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-4">
                  <p className="text-center text-xs text-zinc-500">Faites défiler vers le bas pour modifier vos informations</p>
                </div>

              </div>

              {/* Right — forms */}
              <div className="space-y-6">

                {/* Informations personnelles */}
                <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:p-8">
                  <h2 className="text-3xl font-black">Informations personnelles</h2>
                  <div className="mt-8 grid gap-5 md:grid-cols-2">
                    <div>
                      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">Nom complet</p>
                      <input value={profile.full_name || ""} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                        className="h-14 w-full rounded-2xl border border-white/10 bg-black/40 px-5 outline-none focus:border-[#FF5A1F]" />
                    </div>
                    <div>
                      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">Téléphone</p>
                      <input value={profile.phone || ""} onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="h-14 w-full rounded-2xl border border-white/10 bg-black/40 px-5 outline-none focus:border-[#FF5A1F]" />
                    </div>
                    <div>
                      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">Ville</p>
                      <input value={profile.city || ""} onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                        className="h-14 w-full rounded-2xl border border-white/10 bg-black/40 px-5 outline-none focus:border-[#FF5A1F]" />
                    </div>
                    <div>
                      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">Pays</p>
                      <input value={profile.country || ""} onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                        className="h-14 w-full rounded-2xl border border-white/10 bg-black/40 px-5 outline-none focus:border-[#FF5A1F]" />
                    </div>
                  </div>
                </div>

                {/* Motorsport */}
                <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:p-8">
                  <h2 className="text-3xl font-black">Motorsport</h2>
                  <div className="mt-8 grid gap-5 md:grid-cols-2">
                    <div>
                      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">Expérience</p>
                      <input value={profile.experience || ""} onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                        placeholder="Ex: 5 ans de commissariat en rallye régional"
                        className="h-14 w-full rounded-2xl border border-white/10 bg-black/40 px-5 outline-none focus:border-[#FF5A1F]" />
                    </div>
                    <div>
                      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">Disciplines</p>
                      <input value={profile.disciplines || ""} onChange={(e) => setProfile({ ...profile, disciplines: e.target.value })}
                        placeholder="Ex: Rallye, Circuit, Moto Cross"
                        className="h-14 w-full rounded-2xl border border-white/10 bg-black/40 px-5 outline-none focus:border-[#FF5A1F]" />
                    </div>
                    <div>
                      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">Spécialités</p>
                      <input value={profile.specialties || ""} onChange={(e) => setProfile({ ...profile, specialties: e.target.value })}
                        placeholder="Ex: Directeur de course, Juge de faits"
                        className="h-14 w-full rounded-2xl border border-white/10 bg-black/40 px-5 outline-none focus:border-[#FF5A1F]" />
                    </div>
                    <div>
                      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">Langues</p>
                      <input value={profile.languages || ""} onChange={(e) => setProfile({ ...profile, languages: e.target.value })}
                        placeholder="Ex: Français, Anglais"
                        className="h-14 w-full rounded-2xl border border-white/10 bg-black/40 px-5 outline-none focus:border-[#FF5A1F]" />
                    </div>
                  </div>
                  <div className="mt-5">
                    <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">Bio</p>
                    <textarea rows={6} value={profile.bio || ""} onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="w-full rounded-2xl border border-white/10 bg-black/40 p-5 outline-none focus:border-[#FF5A1F]" />
                  </div>
                </div>

                {/* Licence principale */}
                <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:p-8">

                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-3xl font-black">Licence</h2>
                      <p className="mt-2 text-zinc-400">Upload et validation administrateur</p>
                    </div>
                    <button
                      onClick={() => licenseInputRef.current?.click()}
                      disabled={uploadingLicense}
                      className="flex h-14 items-center gap-3 rounded-2xl bg-[#FF5A1F] px-6 font-bold transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Upload size={18} />
                      {uploadingLicense ? "Envoi..." : profile.license_url ? "Remplacer" : "Upload"}
                    </button>
                    <input ref={licenseInputRef} type="file" accept=".pdf,image/*" className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadLicense(f); }} />
                  </div>

                  {!profile.license_url && !uploadingLicense && (
                    <div className="mt-6 flex flex-col items-center gap-3 rounded-[24px] border border-dashed border-white/10 bg-black/20 p-8 text-center">
                      <Upload size={28} className="text-zinc-600" />
                      <p className="font-semibold text-zinc-400">Aucune licence uploadée</p>
                      <p className="text-sm text-zinc-600">Cliquez sur Upload pour soumettre votre licence motorsport</p>
                    </div>
                  )}

                  {uploadingLicense && (
                    <div className="mt-6 flex items-center justify-center gap-3 rounded-[24px] border border-white/10 bg-black/20 p-8">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#FF5A1F] border-t-transparent" />
                      <p className="text-zinc-400">Envoi en cours...</p>
                    </div>
                  )}

                  {profile.license_url && !profile.license_verified && !uploadingLicense && (
                    <div className="mt-6 rounded-[24px] border border-yellow-500/30 bg-yellow-500/5 p-6">
                      <div className="flex items-center gap-3">
                        <Clock size={20} className="text-yellow-400" />
                        <p className="font-bold text-yellow-400">En attente de validation</p>
                      </div>
                      <p className="mt-2 text-sm text-zinc-400">Votre licence a bien été reçue. Notre équipe va la vérifier dans les plus brefs délais.</p>
                      {profile.license_type && <p className="mt-3 text-sm font-semibold text-white">{profile.license_type}</p>}
                      <a href={profile.license_url} target="_blank" className="mt-3 inline-block text-sm font-bold text-[#FF5A1F] underline underline-offset-2">Voir le fichier envoyé</a>
                    </div>
                  )}

                  {profile.license_url && profile.license_verified && !uploadingLicense && (
                    <div className="mt-6 rounded-[24px] border border-green-500/30 bg-green-500/5 p-6">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 size={20} className="text-green-400" />
                        <p className="font-bold text-green-400">Licence validée</p>
                      </div>
                      <p className="mt-2 text-sm text-zinc-400">Votre licence a été vérifiée et validée par notre équipe. Votre profil est complet.</p>
                      {profile.license_type && <p className="mt-3 text-sm font-semibold text-white">{profile.license_type}</p>}
                      <a href={profile.license_url} target="_blank" className="mt-3 inline-block text-sm font-bold text-[#FF5A1F] underline underline-offset-2">Voir la licence</a>
                    </div>
                  )}

                  {/* Bouton ajouter 2ème licence */}
                  {canAddSecondLicense && !showAddLicense2 && (
                    <button
                      onClick={() => setShowAddLicense2(true)}
                      className="mt-6 flex w-full items-center justify-center gap-3 rounded-[24px] border border-dashed border-white/20 bg-white/[0.02] py-5 text-sm font-bold text-zinc-400 transition hover:border-[#FF5A1F]/50 hover:bg-[#FF5A1F]/5 hover:text-[#FF5A1F]"
                    >
                      <Plus size={18} />
                      Ajouter une licence {secondCategory === "moto" ? "moto (FFM)" : "auto (FFSA)"}
                    </button>
                  )}

                  {/* Formulaire ajout 2ème licence */}
                  {canAddSecondLicense && showAddLicense2 && (
                    <div className="mt-6 space-y-4 rounded-[24px] border border-white/10 bg-black/30 p-6">
                      <p className="font-bold text-white">{secondLicenseLabel}</p>
                      <div>
                        <p className="mb-2 text-xs uppercase tracking-[0.15em] text-zinc-500">Type de licence</p>
                        <select
                          value={addLicense2Form.license_type}
                          onChange={(e) => setAddLicense2Form((f) => ({ ...f, license_type: e.target.value }))}
                          className="h-12 w-full rounded-xl border border-white/10 bg-black/60 px-4 text-sm text-white outline-none focus:border-[#FF5A1F]"
                        >
                          <option value="">— Sélectionner —</option>
                          {secondLicenseTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <p className="mb-2 text-xs uppercase tracking-[0.15em] text-zinc-500">Numéro de licence <span className="normal-case text-zinc-600">(optionnel)</span></p>
                        <input
                          type="text"
                          value={addLicense2Form.license_number}
                          onChange={(e) => setAddLicense2Form((f) => ({ ...f, license_number: e.target.value }))}
                          placeholder="Ex : 2024-FFM-12345"
                          className="h-12 w-full rounded-xl border border-white/10 bg-black/60 px-4 text-sm outline-none focus:border-[#FF5A1F]"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={saveLicense2Info}
                          disabled={savingLicense2Info || !addLicense2Form.license_type}
                          className="flex h-12 flex-1 items-center justify-center rounded-xl bg-[#FF5A1F] text-sm font-bold transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {savingLicense2Info ? "Enregistrement..." : "Continuer →"}
                        </button>
                        <button
                          onClick={() => { setShowAddLicense2(false); setAddLicense2Form({ license_type: "", license_number: "" }); }}
                          className="flex h-12 items-center justify-center rounded-xl border border-white/10 px-5 text-sm text-zinc-400 transition hover:text-white"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  )}

                </div>

                {/* 2ème Licence — visible seulement si license_type_2 est défini */}
                {profile.license_type_2 && (
                  <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:p-8">

                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h2 className="text-3xl font-black">2ème Licence</h2>
                        <p className="mt-2 text-zinc-400">{profile.license_type_2}</p>
                        {profile.license_number_2 && <p className="text-sm text-zinc-500">N° {profile.license_number_2}</p>}
                      </div>
                      <button
                        onClick={() => license2InputRef.current?.click()}
                        disabled={uploadingLicense2}
                        className="flex h-14 items-center gap-3 rounded-2xl bg-[#FF5A1F] px-6 font-bold transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Upload size={18} />
                        {uploadingLicense2 ? "Envoi..." : profile.license_url_2 ? "Remplacer" : "Upload"}
                      </button>
                      <input ref={license2InputRef} type="file" accept=".pdf,image/*" className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadLicense2(f); }} />
                    </div>

                    {!profile.license_url_2 && !uploadingLicense2 && (
                      <div className="mt-6 flex flex-col items-center gap-3 rounded-[24px] border border-dashed border-white/10 bg-black/20 p-8 text-center">
                        <Upload size={28} className="text-zinc-600" />
                        <p className="font-semibold text-zinc-400">Aucun document uploadé</p>
                        <p className="text-sm text-zinc-600">Cliquez sur Upload pour soumettre votre 2ème licence</p>
                      </div>
                    )}

                    {uploadingLicense2 && (
                      <div className="mt-6 flex items-center justify-center gap-3 rounded-[24px] border border-white/10 bg-black/20 p-8">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#FF5A1F] border-t-transparent" />
                        <p className="text-zinc-400">Envoi en cours...</p>
                      </div>
                    )}

                    {profile.license_url_2 && !profile.license_verified_2 && !uploadingLicense2 && (
                      <div className="mt-6 rounded-[24px] border border-yellow-500/30 bg-yellow-500/5 p-6">
                        <div className="flex items-center gap-3">
                          <Clock size={20} className="text-yellow-400" />
                          <p className="font-bold text-yellow-400">En attente de validation</p>
                        </div>
                        <p className="mt-2 text-sm text-zinc-400">Votre 2ème licence a bien été reçue. Notre équipe va la vérifier dans les plus brefs délais.</p>
                        <a href={profile.license_url_2} target="_blank" className="mt-3 inline-block text-sm font-bold text-[#FF5A1F] underline underline-offset-2">Voir le fichier envoyé</a>
                      </div>
                    )}

                    {profile.license_url_2 && profile.license_verified_2 && !uploadingLicense2 && (
                      <div className="mt-6 rounded-[24px] border border-green-500/30 bg-green-500/5 p-6">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 size={20} className="text-green-400" />
                          <p className="font-bold text-green-400">2ème licence validée</p>
                        </div>
                        <p className="mt-2 text-sm text-zinc-400">Votre 2ème licence a été vérifiée et validée par notre équipe.</p>
                        <a href={profile.license_url_2} target="_blank" className="mt-3 inline-block text-sm font-bold text-[#FF5A1F] underline underline-offset-2">Voir la licence</a>
                      </div>
                    )}

                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

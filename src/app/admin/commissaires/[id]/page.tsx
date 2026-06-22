"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft, CalendarDays, CheckCircle2, Clock3, Copy,
  ExternalLink, Globe, Mail, MapPin, Pencil, Phone, Save, XCircle,
} from "lucide-react";
import { Toast, type ToastData } from "@/components/ui/toast";
import ParticipationHistory from "@/components/history/participation-history";

function CopyRow({ icon: Icon, label, value, href }: { icon: any; label: string; value: string; href?: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FF5A1F]/10">
        <Icon size={16} className="text-[#FF5A1F]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">{label}</p>
        {href ? (
          <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="mt-0.5 block truncate text-sm font-bold text-zinc-900 hover:text-[#FF5A1F]">
            {value}
          </a>
        ) : (
          <p className="mt-0.5 truncate text-sm font-bold text-zinc-900">{value}</p>
        )}
      </div>
      <button onClick={copy} className="shrink-0 rounded-xl border border-zinc-200 p-2 transition hover:bg-zinc-100">
        {copied ? <CheckCircle2 size={14} className="text-green-600" /> : <Copy size={14} className="text-zinc-500" />}
      </button>
    </div>
  );
}

export default function AdminCommissaireProfilePage() {
  const params = useParams();
  const id = params?.id as string;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastData>(null);
  const [asaEdit, setAsaEdit] = useState("");
  const [asaSaving, setAsaSaving] = useState(false);
  const [asa2Edit, setAsa2Edit] = useState("");
  const [asa2Saving, setAsa2Saving] = useState(false);
  const [userLicenses, setUserLicenses] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => { setProfile(data); setAsaEdit(data?.asa || ""); setAsa2Edit(data?.asa_2 || ""); setLoading(false); });

    supabase
      .from("licenses")
      .select("*")
      .eq("user_id", id)
      .order("created_at", { ascending: true })
      .then(({ data }) => setUserLicenses(data || []));
  }, [id]);

  async function saveAsa() {
    setAsaSaving(true);
    await supabase.from("profiles").update({ asa: asaEdit.trim() || null }).eq("id", id);
    setProfile((prev: any) => ({ ...prev, asa: asaEdit.trim() || null }));
    setAsaSaving(false);
    setToast({ message: "ASA mis à jour.", type: "success" });
  }

  async function saveAsa2() {
    setAsa2Saving(true);
    await supabase.from("profiles").update({ asa_2: asa2Edit.trim() || null }).eq("id", id);
    setProfile((prev: any) => ({ ...prev, asa_2: asa2Edit.trim() || null }));
    setAsa2Saving(false);
    setToast({ message: "ASA 2ème licence mis à jour.", type: "success" });
  }

  async function validate(verified: boolean) {
    await supabase.from("profiles").update({ license_verified: verified }).eq("id", id);
    await supabase.from("notifications").insert({
      user_id: id,
      title: verified ? "Votre licence a été validée ✔" : "Votre licence n'a pas pu être validée",
      type: verified ? "license_verified" : "license_rejected",
      link: "/dashboard/profile",
    });
    setProfile((prev: any) => ({ ...prev, license_verified: verified }));
    setToast({ message: verified ? "Licence validée." : "Licence rejetée.", type: verified ? "success" : "error" });
  }

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <p className="text-zinc-500">Chargement...</p>
    </div>
  );

  if (!profile) return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <div className="text-center">
        <p className="text-2xl font-black text-zinc-900">Profil introuvable</p>
        <Link href="/admin/commissaires" className="mt-4 inline-block text-[#FF5A1F] hover:underline">← Retour</Link>
      </div>
    </div>
  );

  return (
    <div>
      <Toast toast={toast} onClose={() => setToast(null)} />

      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white">
        <div className="flex h-20 items-center gap-4 px-6 lg:px-10">
          <Link
            href="/admin/commissaires"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 transition hover:bg-zinc-100"
          >
            <ArrowLeft size={18} className="text-zinc-700" />
          </Link>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Administration</p>
            <h1 className="mt-1 text-xl font-black text-zinc-900 lg:text-2xl">{profile.full_name || "Commissaire"}</h1>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1300px] p-6 pb-24 lg:p-10">

        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">

          {/* Colonne gauche — photo + licence */}
          <div className="space-y-6">

            <div className="overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-sm">
              <div className="relative h-[280px]">
                <img
                  src={profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || "C")}&background=FF5A1F&color=fff&size=320`}
                  alt={profile.full_name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-5">
                <h2 className="text-xl font-black text-zinc-900">{profile.full_name}</h2>
                <p className="mt-1 text-sm text-zinc-600">Commissaire Motorsport</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
                  <CalendarDays size={12} />
                  Inscrit le {new Date(profile.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </div>
                <p className="mt-2 break-all text-[10px] text-zinc-400">ID : {profile.id}</p>
              </div>
            </div>

            {/* Licence */}
            <div className="rounded-[32px] border border-zinc-200 bg-white shadow-sm p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Licence</p>

              {profile.license_type ? (
                <>
                  <p className="mt-3 text-base font-black text-[#FF5A1F]">🏁 {profile.license_type}</p>
                  {profile.license_number && (
                    <p className="mt-1 text-sm font-bold text-zinc-700">N° {profile.license_number}</p>
                  )}
                  <div className="mt-3">
                    <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.15em] text-zinc-500">ASA</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={asaEdit}
                        onChange={(e) => setAsaEdit(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") saveAsa(); }}
                        placeholder="ex : ASA Lyon, ASA Côte d'Azur..."
                        className="flex-1 rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#FF5A1F]"
                      />
                      <button
                        onClick={saveAsa}
                        disabled={asaSaving}
                        className="shrink-0 rounded-xl bg-[#FF5A1F]/20 px-3 py-2 text-[#FF5A1F] transition hover:bg-[#FF5A1F]/30 disabled:opacity-50"
                        title="Enregistrer l'ASA"
                      >
                        {asaSaving ? <Clock3 size={14} /> : <Save size={14} />}
                      </button>
                    </div>
                  </div>
                  {profile.license_type_2 && (
                    <div className="mt-4 border-t border-zinc-200 pt-4">
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-500 mb-2">2ème licence</p>
                      <p className="text-base font-black text-[#FF5A1F]">🏁 {profile.license_type_2}</p>
                      {profile.license_number_2 && (
                        <p className="mt-1 text-sm font-bold text-zinc-700">N° {profile.license_number_2}</p>
                      )}
                      <div className="mt-3">
                        <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.15em] text-zinc-500">ASA</p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={asa2Edit}
                            onChange={(e) => setAsa2Edit(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") saveAsa2(); }}
                            placeholder="ex : ASA Lyon, ASA Côte d'Azur..."
                            className="flex-1 rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#FF5A1F]"
                          />
                          <button
                            onClick={saveAsa2}
                            disabled={asa2Saving}
                            className="shrink-0 rounded-xl bg-[#FF5A1F]/20 px-3 py-2 text-[#FF5A1F] transition hover:bg-[#FF5A1F]/30 disabled:opacity-50"
                            title="Enregistrer l'ASA"
                          >
                            {asa2Saving ? <Clock3 size={14} /> : <Save size={14} />}
                          </button>
                        </div>
                      </div>
                      <div className="mt-3">
                        {profile.license_verified_2 ? (
                          <div className="flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-2 text-sm font-bold text-green-700">
                            <CheckCircle2 size={15} /> Vérifiée
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-2 text-sm font-bold text-yellow-700">
                            <Clock3 size={15} /> En attente
                          </div>
                        )}
                      </div>
                      {profile.license_url_2 && (
                        <a
                          href={profile.license_url_2}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 py-3 text-sm font-bold text-zinc-700 transition hover:border-[#FF5A1F]/40 hover:text-[#FF5A1F]"
                        >
                          <ExternalLink size={15} /> Ouvrir la 2ème licence
                        </a>
                      )}
                    </div>
                  )}

                  <div className="mt-4">
                    {profile.license_verified ? (
                      <div className="flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-2 text-sm font-bold text-green-700">
                        <CheckCircle2 size={15} /> Vérifiée
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-2 text-sm font-bold text-yellow-700">
                        <Clock3 size={15} /> En attente
                      </div>
                    )}
                  </div>

                  {profile.license_url && (
                    <>
                      <a
                        href={profile.license_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 py-3 text-sm font-bold text-zinc-700 transition hover:border-[#FF5A1F]/40 hover:text-[#FF5A1F]"
                      >
                        <ExternalLink size={15} /> Ouvrir la licence
                      </a>
                      <div className="mt-3 flex gap-3">
                        <button
                          onClick={() => validate(true)}
                          disabled={profile.license_verified}
                          className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold transition ${
                            profile.license_verified ? "cursor-not-allowed bg-zinc-100 text-zinc-400" : "bg-green-600 text-white hover:scale-105"
                          }`}
                        >
                          <CheckCircle2 size={14} /> Valider
                        </button>
                        <button
                          onClick={() => validate(false)}
                          disabled={!profile.license_verified}
                          className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold transition ${
                            !profile.license_verified ? "cursor-not-allowed bg-zinc-100 text-zinc-400" : "bg-red-600 text-white hover:scale-105"
                          }`}
                        >
                          <XCircle size={14} /> Rejeter
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <p className="mt-3 text-sm text-zinc-500">Aucune licence renseignée</p>
              )}
            </div>

          </div>

          {/* Colonne droite */}
          <div className="space-y-6">

            {/* Contact — bloc principal */}
            <div className="rounded-[32px] border border-zinc-200 bg-white shadow-sm p-6 lg:p-8">
              <p className="mb-5 text-xs uppercase tracking-[0.2em] text-zinc-500">Informations de contact</p>
              <div className="space-y-3">
                {profile.email && (
                  <CopyRow icon={Mail} label="Email" value={profile.email} href={`mailto:${profile.email}`} />
                )}
                {profile.phone && (
                  <CopyRow icon={Phone} label="Téléphone" value={profile.phone} href={`tel:${profile.phone}`} />
                )}
                {(profile.city || profile.country) && (
                  <CopyRow icon={MapPin} label="Localisation" value={[profile.city, profile.country].filter(Boolean).join(", ")} />
                )}
                {profile.slug && (
                  <CopyRow icon={Globe} label="Profil public" value={`trackmarshal.app/marshal/${profile.slug}`} href={`/marshal/${profile.slug}`} />
                )}
                {!profile.email && !profile.phone && !profile.city && (
                  <p className="text-sm text-zinc-500">Aucune coordonnée renseignée.</p>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-[28px] border border-zinc-200 bg-white shadow-sm p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Ancienneté</p>
                <p className="mt-3 text-4xl font-black text-[#FF5A1F]">{profile.years_experience || "—"}</p>
                {profile.years_experience && <p className="text-xs text-zinc-500">ans</p>}
              </div>
              <div className="rounded-[28px] border border-zinc-200 bg-white shadow-sm p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Langues</p>
                <p className="mt-3 text-sm font-bold text-zinc-900">{profile.languages || "—"}</p>
              </div>
              <div className="col-span-2 rounded-[28px] border border-zinc-200 bg-white shadow-sm p-5 sm:col-span-1">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Disciplines</p>
                <p className="mt-3 text-sm font-bold text-zinc-900">{profile.disciplines || "—"}</p>
              </div>
            </div>

            {profile.bio && (
              <div className="rounded-[32px] border border-zinc-200 bg-white shadow-sm p-6 lg:p-8">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Biographie</p>
                <p className="mt-4 whitespace-pre-wrap leading-relaxed text-zinc-700">{profile.bio}</p>
              </div>
            )}

            {profile.experience && (
              <div className="rounded-[32px] border border-zinc-200 bg-white shadow-sm p-6 lg:p-8">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Expérience Motorsport</p>
                <p className="mt-4 whitespace-pre-wrap leading-relaxed text-zinc-700">{profile.experience}</p>
              </div>
            )}

            {profile.specialties && (
              <div className="rounded-[32px] border border-zinc-200 bg-white shadow-sm p-6 lg:p-8">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Spécialités</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {profile.specialties.split(",").map((s: string) => s.trim()).filter(Boolean).map((s: string) => (
                    <span key={s} className="rounded-full border border-[#FF5A1F]/20 bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-[#FF5A1F]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profile.badges && profile.badges.length > 0 && (
              <div className="rounded-[32px] border border-zinc-200 bg-white shadow-sm p-6 lg:p-8">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Badges</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {profile.badges.map((badge: string) => (
                    <span key={badge} className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-700">{badge}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Licences (new system) */}
            {userLicenses.length > 0 && (
              <div className="rounded-[32px] border border-zinc-200 bg-white shadow-sm p-6 lg:p-8">
                <p className="mb-5 text-xs uppercase tracking-[0.2em] text-zinc-500">Licences</p>
                <div className="space-y-3">
                  {userLicenses.map((lic: any) => (
                    <div key={lic.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-[#FF5A1F]">{lic.type || "—"}</span>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                              lic.category === "moto"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-orange-100 text-orange-700"
                            }`}>
                              {lic.category}
                            </span>
                          </div>
                          {lic.number && (
                            <p className="mt-1 text-sm text-zinc-700">N° {lic.number}</p>
                          )}
                          {lic.asa && (
                            <p className="mt-0.5 text-xs text-zinc-500">ASA : {lic.asa}</p>
                          )}
                          {lic.url && (
                            <a
                              href={lic.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#FF5A1F] underline underline-offset-2"
                            >
                              <ExternalLink size={12} /> Voir le document
                            </a>
                          )}
                        </div>
                        <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase ${
                          lic.verified
                            ? "bg-green-100 text-green-700"
                            : lic.url
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-zinc-100 text-zinc-500"
                        }`}>
                          {lic.verified ? "Validée" : lic.url ? "En attente" : "Sans doc"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <ParticipationHistory marshalId={profile.id} forceShow />

          </div>
        </div>
      </div>
    </div>
  );
}

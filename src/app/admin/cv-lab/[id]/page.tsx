"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, CalendarDays, MapPin, Plus, Star, Trash2, X } from "lucide-react";
import { Toast, type ToastData } from "@/components/ui/toast";

const ROLES = [
  "Commissaire de virage",
  "Commissaire de départ/arrivée",
  "Commissaire technique",
  "Directeur de course adjoint",
  "Directeur de course",
  "Délégué sportif",
  "Safety Car",
  "Officier de liaison",
  "Commissaire médical",
  "Autre",
];

const DISCIPLINES = ["Rallye", "Circuit", "Karting", "Rallycross", "Moto - Road", "Moto - Cross", "Moto - Enduro", "Tout-terrain", "Slalom", "Autre"];

type CareerEvent = {
  id: string;
  event_name: string;
  event_date: string;
  location: string | null;
  role: string;
  discipline: string | null;
  organizer_name: string | null;
  notes: string | null;
  source: string;
};

type PlatformEvent = {
  id: string;
  event_date: string;
  event_end_date: string | null;
  title: string;
  location: string | null;
  discipline: string | null;
  role?: string | null;
};

type BlankForm = {
  event_name: string;
  event_date: string;
  location: string;
  role: string;
  discipline: string;
  organizer_name: string;
  notes: string;
};

const blank: BlankForm = { event_name: "", event_date: "", location: "", role: "", discipline: "", organizer_name: "", notes: "" };

export default function CvLabProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [profile, setProfile] = useState<any>(null);
  const [licenses, setLicenses] = useState<any[]>([]);
  const [platformEvents, setPlatformEvents] = useState<PlatformEvent[]>([]);
  const [careerEvents, setCareerEvents] = useState<CareerEvent[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<BlankForm>(blank);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastData>(null);

  useEffect(() => { load(); }, [id]);

  async function load() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const [{ data: prof }, { data: lics }, { data: apps }, { data: revs }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", id).single(),
      supabase.from("licenses").select("*").eq("user_id", id).order("created_at"),
      supabase.from("applications").select("*, events(id, title, event_date, event_end_date, location, discipline)").eq("marshal_id", id).eq("status", "accepted").order("created_at", { ascending: false }),
      supabase.from("reviews").select("rating, comment, created_at").eq("marshal_id", id).order("created_at", { ascending: false }),
    ]);

    setProfile(prof);
    setLicenses(lics || []);
    setPlatformEvents((apps || []).map((a: any) => ({ ...a.events, role: a.role_requested })).filter(Boolean));
    setReviews(revs || []);

    const res = await fetch(`/api/admin/career-events?userId=${id}`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    const json = await res.json();
    setCareerEvents(json.events || []);
    setLoading(false);
  }

  async function addEvent() {
    if (!form.event_name || !form.event_date || !form.role) {
      setToast({ message: "Nom, date et rôle sont obligatoires.", type: "error" });
      return;
    }
    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch("/api/admin/career-events", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session!.access_token}` },
      body: JSON.stringify({ userId: id, ...form }),
    });
    const json = await res.json();
    setSaving(false);
    if (!res.ok) { setToast({ message: json.error, type: "error" }); return; }
    setCareerEvents((prev) => [json.event, ...prev]);
    setForm(blank);
    setShowForm(false);
    setToast({ message: "Épreuve ajoutée.", type: "success" });
  }

  async function deleteEvent(eventId: string) {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch("/api/admin/career-events", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session!.access_token}` },
      body: JSON.stringify({ id: eventId }),
    });
    if (res.ok) {
      setCareerEvents((prev) => prev.filter((e) => e.id !== eventId));
      setToast({ message: "Épreuve supprimée.", type: "error" });
    }
  }

  const avgRating = reviews.length > 0
    ? Math.round((reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length) * 10) / 10
    : null;

  const totalEvents = platformEvents.length + careerEvents.length;

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-zinc-50"><p className="text-zinc-500">Chargement...</p></main>;
  if (!profile) return <main className="flex min-h-screen items-center justify-center bg-zinc-50"><p className="text-zinc-500">Profil introuvable.</p></main>;

  return (
    <div>
      <Toast toast={toast} onClose={() => setToast(null)} />

      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white">
        <div className="flex h-20 items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-4">
            <Link href="/admin/cv-lab" className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 transition hover:bg-zinc-100">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">CV Lab — Bêta</p>
              <h1 className="mt-0.5 text-xl font-black text-zinc-900">{profile.full_name}</h1>
            </div>
          </div>
          <button
            onClick={() => { setShowForm(true); window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }); }}
            className="flex items-center gap-2 rounded-2xl bg-[#FF5A1F] px-5 py-2.5 text-sm font-bold text-white transition hover:scale-105"
          >
            <Plus size={16} /> Ajouter une épreuve
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[1200px] p-6 pb-24 lg:p-10 lg:pb-10 space-y-8">

        {/* CV Header */}
        <div className="overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-sm">
          <div className="h-24 bg-gradient-to-r from-zinc-900 to-zinc-700" />
          <div className="px-8 pb-8">
            <div className="-mt-12 flex items-end gap-6">
              <img
                src={profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || "C")}&background=FF5A1F&color=fff&size=200`}
                alt={profile.full_name}
                className="h-24 w-24 rounded-[20px] border-4 border-white object-cover shadow-md"
              />
              <div className="pb-1">
                <h2 className="text-3xl font-black text-zinc-900">{profile.full_name}</h2>
                <p className="mt-1 text-zinc-500">{[profile.city, profile.country].filter(Boolean).join(", ") || "Localisation non renseignée"}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-4">
              {[
                { label: "Épreuves", value: totalEvents, color: "text-[#FF5A1F]" },
                { label: "Années d'exp.", value: profile.years_experience || "—", color: "text-zinc-900" },
                { label: "Note moy.", value: avgRating ? `${avgRating}/5` : "—", color: "text-yellow-600" },
                { label: "Évaluations", value: reviews.length, color: "text-zinc-900" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-center">
                  <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.15em] text-zinc-500">{s.label}</p>
                </div>
              ))}
            </div>

            {profile.bio && (
              <p className="mt-6 text-zinc-600 leading-relaxed">{profile.bio}</p>
            )}

            {profile.disciplines && (
              <div className="mt-4 flex flex-wrap gap-2">
                {profile.disciplines.split(",").map((d: string) => (
                  <span key={d} className="rounded-full border border-[#FF5A1F]/20 bg-[#FF5A1F]/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#FF5A1F]">{d.trim()}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Licences */}
        {licenses.length > 0 && (
          <div className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm lg:p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Licences</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {licenses.map((l) => (
                <div key={l.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                  <p className="font-bold text-zinc-900">{l.type || "—"}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">{l.category === "moto" ? "FFM" : "FFSA"}{l.number ? ` · N° ${l.number}` : ""}</p>
                  <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${l.verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {l.verified ? "✔ Vérifiée" : "En attente"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Historique complet */}
        <div className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Historique des épreuves</p>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-600">{totalEvents} au total</span>
          </div>

          {totalEvents === 0 && (
            <p className="text-center text-zinc-400 py-8">Aucune épreuve enregistrée. Ajoute les épreuves passées via le bouton en haut.</p>
          )}

          <div className="space-y-3">
            {/* Platform events */}
            {platformEvents.map((e) => (
              <div key={e.id} className="flex items-start gap-4 rounded-2xl border border-green-100 bg-green-50 px-5 py-4">
                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-green-500" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-zinc-900 truncate">{e.title}</p>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-zinc-500">
                    {e.event_date && <span className="flex items-center gap-1"><CalendarDays size={11} />{new Date(e.event_date).toLocaleDateString("fr-FR")}</span>}
                    {e.location && <span className="flex items-center gap-1"><MapPin size={11} />{e.location}</span>}
                    {e.discipline && <span className="rounded-full bg-white border border-zinc-200 px-2 py-0.5">{e.discipline}</span>}
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">Plateforme</span>
              </div>
            ))}

            {/* Manual career events */}
            {careerEvents.map((e) => (
              <div key={e.id} className="flex items-start gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4">
                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-zinc-400" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-zinc-900 truncate">{e.event_name}</p>
                  <p className="mt-0.5 text-xs font-semibold text-[#FF5A1F]">{e.role}</p>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-zinc-500">
                    <span className="flex items-center gap-1"><CalendarDays size={11} />{new Date(e.event_date).toLocaleDateString("fr-FR")}</span>
                    {e.location && <span className="flex items-center gap-1"><MapPin size={11} />{e.location}</span>}
                    {e.discipline && <span className="rounded-full bg-white border border-zinc-200 px-2 py-0.5">{e.discipline}</span>}
                    {e.organizer_name && <span>{e.organizer_name}</span>}
                  </div>
                  {e.notes && <p className="mt-2 text-xs text-zinc-500 italic">{e.notes}</p>}
                </div>
                <button
                  onClick={() => deleteEvent(e.id)}
                  className="shrink-0 rounded-xl p-1.5 text-zinc-400 transition hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Avis organisateurs */}
        {reviews.length > 0 && (
          <div className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm lg:p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Avis organisateurs</p>
            <div className="mt-4 space-y-3">
              {reviews.map((r, i) => (
                <div key={i} className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
                  <div className="flex items-center gap-1 mb-2">
                    {[1,2,3,4,5].map((s) => <Star key={s} size={12} fill={s <= (r.rating || 0) ? "#EAB308" : "none"} className={s <= (r.rating || 0) ? "text-yellow-500" : "text-zinc-300"} />)}
                    <span className="ml-2 text-xs text-zinc-400">{new Date(r.created_at).toLocaleDateString("fr-FR")}</span>
                  </div>
                  {r.comment && <p className="text-sm text-zinc-600 italic">"{r.comment}"</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Formulaire ajout épreuve */}
        {showForm && (
          <div className="rounded-[32px] border border-[#FF5A1F]/30 bg-white p-6 shadow-sm lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Ajouter une épreuve passée</p>
              <button onClick={() => setShowForm(false)} className="rounded-xl p-1.5 text-zinc-400 hover:bg-zinc-100"><X size={16} /></button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-zinc-600">Nom de l'épreuve *</label>
                <input type="text" placeholder="ex. Rallye du Var 2022" value={form.event_name} onChange={(e) => setForm((f) => ({ ...f, event_name: e.target.value }))}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-600">Date *</label>
                <input type="date" value={form.event_date} onChange={(e) => setForm((f) => ({ ...f, event_date: e.target.value }))}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-600">Rôle *</label>
                <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30">
                  <option value="">Sélectionner...</option>
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-600">Discipline</label>
                <select value={form.discipline} onChange={(e) => setForm((f) => ({ ...f, discipline: e.target.value }))}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30">
                  <option value="">Sélectionner...</option>
                  {DISCIPLINES.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-600">Lieu</label>
                <input type="text" placeholder="ex. Brignoles, Var" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-600">Organisateur</label>
                <input type="text" placeholder="ex. ASA du Var" value={form.organizer_name} onChange={(e) => setForm((f) => ({ ...f, organizer_name: e.target.value }))}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-zinc-600">Notes</label>
                <textarea placeholder="Informations complémentaires..." value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30" />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="rounded-xl border border-zinc-200 px-5 py-2.5 text-sm font-bold text-zinc-600 hover:bg-zinc-50">Annuler</button>
              <button onClick={addEvent} disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-[#FF5A1F] px-6 py-2.5 text-sm font-bold text-white transition hover:scale-105 disabled:opacity-50">
                <Plus size={15} />{saving ? "Enregistrement…" : "Ajouter"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

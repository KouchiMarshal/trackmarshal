"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Dumbbell, Scale, Trophy, Plus, Trash2, ChevronDown, ChevronUp, X, TrendingUp, Flame, Calendar } from "lucide-react";

const OWNER_EMAIL = "foussardk@gmail.com";

const EXERCISES = [
  "Développé couché", "Développé incliné", "Développé décliné", "Écarté poulie",
  "Squat", "Presse à cuisses", "Leg curl", "Leg extension", "Fentes",
  "Soulevé de terre", "Romanian deadlift",
  "Tirage vertical", "Rowing barre", "Rowing haltère", "Pull-over",
  "Développé militaire", "Élévations latérales", "Oiseau",
  "Curl barre", "Curl haltère", "Marteau",
  "Triceps poulie", "Dips", "Extensions triceps",
  "Gainage", "Crunchs", "Relevé de jambes",
  "Autre",
];

type Workout = {
  id: string;
  date: string;
  exercise: string;
  sets: number | null;
  reps: number | null;
  weight_kg: number | null;
  notes: string | null;
};

type BodyWeight = {
  id: string;
  date: string;
  weight_kg: number;
  notes: string | null;
};

type Tab = "overview" | "workouts" | "body";

export default function PerfPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("overview");

  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [bodyWeights, setBodyWeights] = useState<BodyWeight[]>([]);

  // Workout form
  const [showWForm, setShowWForm] = useState(false);
  const [wDate, setWDate] = useState(new Date().toISOString().slice(0, 10));
  const [wExercise, setWExercise] = useState("");
  const [wCustom, setWCustom] = useState("");
  const [wSets, setWSets] = useState("");
  const [wReps, setWReps] = useState("");
  const [wWeight, setWWeight] = useState("");
  const [wNotes, setWNotes] = useState("");
  const [wSaving, setWSaving] = useState(false);

  // Body weight form
  const [showBForm, setShowBForm] = useState(false);
  const [bDate, setBDate] = useState(new Date().toISOString().slice(0, 10));
  const [bWeight, setBWeight] = useState("");
  const [bNotes, setBNotes] = useState("");
  const [bSaving, setBSaving] = useState(false);

  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== OWNER_EMAIL) {
        router.replace("/");
        return;
      }
      setAuthorized(true);
      await Promise.all([loadWorkouts(user.id), loadBodyWeights(user.id)]);
      setLoading(false);
    }
    init();
  }, []);

  async function loadWorkouts(uid: string) {
    const { data } = await supabase.from("fitness_workouts").select("*").eq("user_id", uid).order("date", { ascending: false }).order("created_at", { ascending: false });
    setWorkouts(data || []);
  }

  async function loadBodyWeights(uid: string) {
    const { data } = await supabase.from("fitness_body_weight").select("*").eq("user_id", uid).order("date", { ascending: false });
    setBodyWeights(data || []);
  }

  async function saveWorkout() {
    const name = wExercise === "Autre" ? wCustom : wExercise;
    if (!name || !wDate) return;
    setWSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("fitness_workouts").insert({
      user_id: user.id,
      date: wDate,
      exercise: name,
      sets: wSets ? parseInt(wSets) : null,
      reps: wReps ? parseInt(wReps) : null,
      weight_kg: wWeight ? parseFloat(wWeight) : null,
      notes: wNotes || null,
    });
    await loadWorkouts(user.id);
    setWExercise(""); setWCustom(""); setWSets(""); setWReps(""); setWWeight(""); setWNotes("");
    setWSaving(false);
    setShowWForm(false);
  }

  async function saveBodyWeight() {
    if (!bWeight || !bDate) return;
    setBSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("fitness_body_weight").insert({
      user_id: user.id,
      date: bDate,
      weight_kg: parseFloat(bWeight),
      notes: bNotes || null,
    });
    await loadBodyWeights(user.id);
    setBWeight(""); setBNotes("");
    setBSaving(false);
    setShowBForm(false);
  }

  async function deleteWorkout(id: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("fitness_workouts").delete().eq("id", id).eq("user_id", user.id);
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  }

  async function deleteBodyWeight(id: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("fitness_body_weight").delete().eq("id", id).eq("user_id", user.id);
    setBodyWeights((prev) => prev.filter((b) => b.id !== id));
  }

  // Computed stats
  const prs: Record<string, number> = {};
  workouts.forEach((w) => {
    if (w.weight_kg && (!prs[w.exercise] || w.weight_kg > prs[w.exercise])) {
      prs[w.exercise] = w.weight_kg;
    }
  });

  const byExercise: Record<string, Workout[]> = {};
  workouts.forEach((w) => {
    if (!byExercise[w.exercise]) byExercise[w.exercise] = [];
    byExercise[w.exercise].push(w);
  });

  const sessionDates = [...new Set(workouts.map((w) => w.date))];
  const thisMonth = new Date().toISOString().slice(0, 7);
  const sessionsThisMonth = new Set(workouts.filter((w) => w.date.startsWith(thisMonth)).map((w) => w.date)).size;

  const latestBW = bodyWeights[0];
  const prevBW = bodyWeights[1];
  const bwDiff = latestBW && prevBW ? +(latestBW.weight_kg - prevBW.weight_kg).toFixed(1) : null;

  const recentSessions = sessionDates.slice(0, 5).map((date) => ({
    date,
    exercises: workouts.filter((w) => w.date === date),
  }));

  const topPRs = Object.entries(prs).sort((a, b) => b[1] - a[1]).slice(0, 5);

  if (!authorized || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#FF5A1F] border-t-transparent" />
          <p className="text-zinc-400 text-sm">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF5A1F]">
              <Dumbbell size={18} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF5A1F]">Privé</p>
              <h1 className="text-base font-black leading-none">Mon Suivi Muscu</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setShowBForm(true); setTab("body"); }}
              className="flex items-center gap-1.5 rounded-xl border border-zinc-700 px-3 py-2 text-xs font-bold text-zinc-300 transition hover:border-zinc-500 hover:text-white"
            >
              <Scale size={13} /> Poids
            </button>
            <button
              onClick={() => { setShowWForm(true); setTab("workouts"); }}
              className="flex items-center gap-1.5 rounded-xl bg-[#FF5A1F] px-3 py-2 text-xs font-bold text-white transition hover:opacity-90"
            >
              <Plus size={13} /> Séance
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-6">

        {/* Stats bar */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-center">
            <p className="text-2xl font-black text-[#FF5A1F]">{sessionsThisMonth}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-zinc-500">Séances ce mois</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-center">
            <p className="text-2xl font-black text-[#FF5A1F]">{sessionDates.length}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-zinc-500">Total séances</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-center">
            <p className="text-2xl font-black text-[#FF5A1F]">{latestBW ? `${latestBW.weight_kg} kg` : "—"}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-zinc-500">
              Poids actuel {bwDiff !== null && (
                <span className={bwDiff > 0 ? "text-orange-400" : "text-green-400"}>
                  ({bwDiff > 0 ? "+" : ""}{bwDiff})
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-2xl border border-zinc-800 bg-zinc-900 p-1">
          {([
            { key: "overview", label: "Vue d'ensemble", icon: TrendingUp },
            { key: "workouts", label: "Séances", icon: Dumbbell },
            { key: "body", label: "Poids corporel", icon: Scale },
          ] as { key: Tab; label: string; icon: any }[]).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition ${
                tab === key ? "bg-[#FF5A1F] text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Icon size={13} />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{key === "overview" ? "Stats" : key === "workouts" ? "Séances" : "Poids"}</span>
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div className="space-y-6">
            {/* Records perso */}
            {topPRs.length > 0 && (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Trophy size={16} className="text-yellow-400" />
                  <p className="text-sm font-black uppercase tracking-[0.15em] text-yellow-400">Records personnels</p>
                </div>
                <div className="space-y-2">
                  {topPRs.map(([ex, kg]) => (
                    <div key={ex} className="flex items-center justify-between rounded-xl border border-zinc-800 px-4 py-3">
                      <span className="text-sm font-semibold text-zinc-300">{ex}</span>
                      <span className="text-sm font-black text-yellow-400">{kg} kg</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dernières séances */}
            {recentSessions.length > 0 && (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Flame size={16} className="text-[#FF5A1F]" />
                  <p className="text-sm font-black uppercase tracking-[0.15em] text-[#FF5A1F]">Dernières séances</p>
                </div>
                <div className="space-y-3">
                  {recentSessions.map(({ date, exercises }) => (
                    <div key={date} className="rounded-xl border border-zinc-800 px-4 py-3">
                      <p className="mb-2 text-xs font-bold text-zinc-500">
                        {new Date(date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {[...new Set(exercises.map((e) => e.exercise))].map((ex) => {
                          const isPR = exercises.some((e) => e.exercise === ex && e.weight_kg !== null && e.weight_kg === prs[ex]);
                          return (
                            <span key={ex} className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${isPR ? "bg-yellow-400/20 text-yellow-400" : "bg-zinc-800 text-zinc-400"}`}>
                              {isPR && "🏆 "}{ex}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recentSessions.length === 0 && (
              <div className="rounded-2xl border border-dashed border-zinc-700 p-12 text-center">
                <Dumbbell size={32} className="mx-auto mb-3 text-zinc-600" />
                <p className="font-bold text-zinc-500">Aucune séance enregistrée.</p>
                <button onClick={() => { setShowWForm(true); setTab("workouts"); }} className="mt-4 rounded-xl bg-[#FF5A1F] px-5 py-2.5 text-sm font-bold">
                  Ajouter ma première séance
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── SÉANCES ── */}
        {tab === "workouts" && (
          <div className="space-y-4">
            {/* Formulaire ajout */}
            {showWForm && (
              <div className="rounded-2xl border border-[#FF5A1F]/30 bg-zinc-900 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="font-black text-[#FF5A1F]">Nouvelle entrée</p>
                  <button onClick={() => setShowWForm(false)}><X size={16} className="text-zinc-500" /></button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-500">Date</label>
                    <input type="date" value={wDate} onChange={(e) => setWDate(e.target.value)}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-[#FF5A1F] focus:outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-500">Exercice</label>
                    <select value={wExercise} onChange={(e) => setWExercise(e.target.value)}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-[#FF5A1F] focus:outline-none">
                      <option value="">Choisir...</option>
                      {EXERCISES.map((ex) => <option key={ex} value={ex}>{ex}</option>)}
                    </select>
                  </div>
                  {wExercise === "Autre" && (
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-semibold text-zinc-500">Nom de l'exercice</label>
                      <input type="text" placeholder="Ex: Hip thrust..." value={wCustom} onChange={(e) => setWCustom(e.target.value)}
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-[#FF5A1F] focus:outline-none" />
                    </div>
                  )}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-500">Séries</label>
                    <input type="number" min="1" placeholder="4" value={wSets} onChange={(e) => setWSets(e.target.value)}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-[#FF5A1F] focus:outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-500">Répétitions</label>
                    <input type="number" min="1" placeholder="10" value={wReps} onChange={(e) => setWReps(e.target.value)}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-[#FF5A1F] focus:outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-500">Charge (kg)</label>
                    <input type="number" min="0" step="0.5" placeholder="80" value={wWeight} onChange={(e) => setWWeight(e.target.value)}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-[#FF5A1F] focus:outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-500">Notes</label>
                    <input type="text" placeholder="RPE 8, pause 90s..." value={wNotes} onChange={(e) => setWNotes(e.target.value)}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-[#FF5A1F] focus:outline-none" />
                  </div>
                </div>
                <button onClick={saveWorkout} disabled={wSaving || !wExercise || !wDate}
                  className="mt-4 w-full rounded-xl bg-[#FF5A1F] py-3 text-sm font-black disabled:opacity-40">
                  {wSaving ? "Enregistrement..." : "Ajouter"}
                </button>
              </div>
            )}

            {!showWForm && (
              <button onClick={() => setShowWForm(true)} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-zinc-700 py-4 text-sm font-bold text-zinc-500 transition hover:border-[#FF5A1F]/50 hover:text-[#FF5A1F]">
                <Plus size={16} /> Ajouter une entrée
              </button>
            )}

            {/* Par exercice */}
            {Object.keys(byExercise).length === 0 && !showWForm && (
              <p className="py-8 text-center text-zinc-600">Aucune entrée enregistrée.</p>
            )}

            {Object.entries(byExercise).map(([exercise, entries]) => {
              const max = Math.max(...entries.map((e) => e.weight_kg || 0));
              const isExpanded = expandedExercise === exercise;
              return (
                <div key={exercise} className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
                  <button
                    onClick={() => setExpandedExercise(isExpanded ? null : exercise)}
                    className="flex w-full items-center justify-between px-5 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-800">
                        <Dumbbell size={14} className="text-[#FF5A1F]" />
                      </div>
                      <div className="text-left">
                        <p className="font-black text-white">{exercise}</p>
                        <p className="text-xs text-zinc-500">{entries.length} entrée{entries.length > 1 ? "s" : ""}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {max > 0 && (
                        <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-black text-yellow-400">
                          🏆 {max} kg
                        </span>
                      )}
                      {isExpanded ? <ChevronUp size={16} className="text-zinc-500" /> : <ChevronDown size={16} className="text-zinc-500" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-zinc-800 px-5 pb-4">
                      <div className="mt-3 space-y-2">
                        {entries.map((e) => {
                          const isPR = e.weight_kg !== null && e.weight_kg === max;
                          return (
                            <div key={e.id} className={`flex items-center justify-between rounded-xl px-4 py-3 ${isPR ? "border border-yellow-400/20 bg-yellow-400/5" : "bg-zinc-800/50"}`}>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] text-zinc-500">
                                    {new Date(e.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                                  </span>
                                  {isPR && <span className="text-[10px] font-black text-yellow-400">PR</span>}
                                </div>
                                <p className="mt-0.5 text-sm font-bold text-white">
                                  {e.sets && e.reps ? `${e.sets} × ${e.reps} reps` : ""}
                                  {e.weight_kg ? ` @ ${e.weight_kg} kg` : ""}
                                  {!e.sets && !e.reps && !e.weight_kg && "—"}
                                </p>
                                {e.notes && <p className="mt-0.5 text-xs text-zinc-500 italic">{e.notes}</p>}
                              </div>
                              <button onClick={() => deleteWorkout(e.id)} className="ml-3 rounded-lg p-1.5 text-zinc-600 hover:bg-red-900/30 hover:text-red-400">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── POIDS CORPOREL ── */}
        {tab === "body" && (
          <div className="space-y-4">
            {showBForm && (
              <div className="rounded-2xl border border-[#FF5A1F]/30 bg-zinc-900 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="font-black text-[#FF5A1F]">Ajouter une pesée</p>
                  <button onClick={() => setShowBForm(false)}><X size={16} className="text-zinc-500" /></button>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-500">Date</label>
                    <input type="date" value={bDate} onChange={(e) => setBDate(e.target.value)}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-[#FF5A1F] focus:outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-500">Poids (kg)</label>
                    <input type="number" step="0.1" placeholder="82.5" value={bWeight} onChange={(e) => setBWeight(e.target.value)}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-[#FF5A1F] focus:outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-500">Notes</label>
                    <input type="text" placeholder="À jeun, matin..." value={bNotes} onChange={(e) => setBNotes(e.target.value)}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-[#FF5A1F] focus:outline-none" />
                  </div>
                </div>
                <button onClick={saveBodyWeight} disabled={bSaving || !bWeight}
                  className="mt-4 w-full rounded-xl bg-[#FF5A1F] py-3 text-sm font-black disabled:opacity-40">
                  {bSaving ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            )}

            {!showBForm && (
              <button onClick={() => setShowBForm(true)} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-zinc-700 py-4 text-sm font-bold text-zinc-500 transition hover:border-[#FF5A1F]/50 hover:text-[#FF5A1F]">
                <Plus size={16} /> Ajouter une pesée
              </button>
            )}

            {/* Graphe minimaliste */}
            {bodyWeights.length >= 2 && (() => {
              const last10 = [...bodyWeights].reverse().slice(-10);
              const min = Math.min(...last10.map((b) => b.weight_kg));
              const max = Math.max(...last10.map((b) => b.weight_kg));
              const range = max - min || 1;
              return (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                  <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-zinc-500">Évolution (10 dernières)</p>
                  <div className="flex h-28 items-end gap-1.5">
                    {last10.map((b, i) => {
                      const h = Math.max(8, Math.round(((b.weight_kg - min) / range) * 80 + 8));
                      const isLatest = i === last10.length - 1;
                      return (
                        <div key={b.id} className="group relative flex flex-1 flex-col items-center justify-end">
                          <div
                            className={`w-full rounded-t-lg transition-all ${isLatest ? "bg-[#FF5A1F]" : "bg-zinc-700 group-hover:bg-zinc-500"}`}
                            style={{ height: `${h}px` }}
                          />
                          <div className="absolute -top-6 hidden rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-bold text-white group-hover:block">
                            {b.weight_kg}kg
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-2 flex justify-between text-[10px] text-zinc-600">
                    <span>{new Date([...bodyWeights].reverse().slice(-10)[0].date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span>
                    <span>{new Date(bodyWeights[0].date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span>
                  </div>
                </div>
              );
            })()}

            {/* Historique */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-zinc-500">Historique</p>
              {bodyWeights.length === 0 && <p className="text-center text-zinc-600 py-4">Aucune pesée enregistrée.</p>}
              <div className="space-y-2">
                {bodyWeights.map((b, i) => {
                  const prev = bodyWeights[i + 1];
                  const diff = prev ? +(b.weight_kg - prev.weight_kg).toFixed(1) : null;
                  return (
                    <div key={b.id} className="flex items-center justify-between rounded-xl border border-zinc-800 px-4 py-3">
                      <div>
                        <p className="text-xs text-zinc-500">
                          {new Date(b.date).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "long", year: "numeric" })}
                        </p>
                        <div className="mt-0.5 flex items-center gap-2">
                          <span className="text-lg font-black text-white">{b.weight_kg} kg</span>
                          {diff !== null && (
                            <span className={`text-xs font-bold ${diff > 0 ? "text-orange-400" : diff < 0 ? "text-green-400" : "text-zinc-500"}`}>
                              {diff > 0 ? "+" : ""}{diff} kg
                            </span>
                          )}
                        </div>
                        {b.notes && <p className="mt-0.5 text-xs text-zinc-600 italic">{b.notes}</p>}
                      </div>
                      <button onClick={() => deleteBodyWeight(b.id)} className="rounded-lg p-1.5 text-zinc-600 hover:bg-red-900/30 hover:text-red-400">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

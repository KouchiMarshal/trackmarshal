"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Dumbbell, Scale, Trophy, Plus, Trash2,
  ChevronDown, ChevronUp, X, TrendingUp, Flame, Check, Pencil,
} from "lucide-react";

const OWNER_EMAIL = "foussardk@gmail.com";

const EXERCISES = [
  "Échauffement / Cardio",
  "Rameur", "Vélo", "Tapis de course",
  "Développé couché", "Développé couché haltères", "Développé incliné", "Développé décliné", "Écarté poulie", "Écarté haltères",
  "Squat", "Presse à cuisses", "Leg curl", "Leg extension", "Fentes", "Hip thrust",
  "Soulevé de terre", "Romanian deadlift",
  "Tirage vertical", "Lat Pulldown", "Rowing barre", "Rowing haltère", "Tirage horizontal prise neutre", "Pull-over",
  "Développé militaire", "Développé militaire haltères", "Élévations latérales", "Oiseau", "Face pull",
  "Curl barre", "Curl haltère", "Curl poulie", "Marteau",
  "Triceps poulie", "Extension triceps corde", "Dips", "Extensions triceps",
  "Gainage", "Crunchs", "Relevé de jambes", "Planche",
  "Autre",
];

type SetRow = { id: string; sets: string; reps: string; weight: string; notes: string };
type ExerciseBlock = { id: string; name: string; custom: string; rows: SetRow[] };

type Workout = {
  id: string; date: string; exercise: string;
  sets: number | null; reps: number | null; weight_kg: number | null; notes: string | null;
};
type BodyWeight = { id: string; date: string; weight_kg: number; notes: string | null };
type Tab = "overview" | "workouts" | "body";

function makeRow(): SetRow {
  return { id: Math.random().toString(36).slice(2), sets: "", reps: "", weight: "", notes: "" };
}
function makeBlock(): ExerciseBlock {
  return { id: Math.random().toString(36).slice(2), name: "", custom: "", rows: [makeRow()] };
}

export default function PerfPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("overview");

  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [bodyWeights, setBodyWeights] = useState<BodyWeight[]>([]);

  // Session builder / editor
  const [sessionOpen, setSessionOpen] = useState(false);
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().slice(0, 10));
  const [editDate, setEditDate] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<ExerciseBlock[]>([makeBlock()]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Workouts tab view mode
  const [sessionViewMode, setSessionViewMode] = useState<"by-date" | "by-exercise">("by-date");

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
      if (!user || user.email !== OWNER_EMAIL) { router.replace("/"); return; }
      setAuthorized(true);
      await Promise.all([loadWorkouts(user.id), loadBodyWeights(user.id)]);
      setLoading(false);
    }
    init();
  }, []);

  async function loadWorkouts(uid: string) {
    const { data } = await supabase.from("fitness_workouts").select("*").eq("user_id", uid)
      .order("date", { ascending: false }).order("created_at", { ascending: false });
    setWorkouts(data || []);
  }
  async function loadBodyWeights(uid: string) {
    const { data } = await supabase.from("fitness_body_weight").select("*").eq("user_id", uid).order("date", { ascending: false });
    setBodyWeights(data || []);
  }

  // ── Block helpers ──
  function updateBlock(id: string, field: keyof ExerciseBlock, val: string) {
    setBlocks((prev) => prev.map((b) => b.id === id ? { ...b, [field]: val } : b));
  }
  function updateRow(blockId: string, rowId: string, field: keyof SetRow, val: string) {
    setBlocks((prev) => prev.map((b) => b.id !== blockId ? b : {
      ...b, rows: b.rows.map((r) => r.id === rowId ? { ...r, [field]: val } : r),
    }));
  }
  function addRow(blockId: string) {
    setBlocks((prev) => prev.map((b) => b.id !== blockId ? b : { ...b, rows: [...b.rows, makeRow()] }));
  }
  function removeRow(blockId: string, rowId: string) {
    setBlocks((prev) => prev.map((b) => b.id !== blockId ? b : { ...b, rows: b.rows.filter((r) => r.id !== rowId) }));
  }
  function addBlock() { setBlocks((prev) => [...prev, makeBlock()]); }
  function removeBlock(id: string) { setBlocks((prev) => prev.filter((b) => b.id !== id)); }

  function closeSessionModal() {
    setSessionOpen(false);
    setEditDate(null);
    setBlocks([makeBlock()]);
    setSessionDate(new Date().toISOString().slice(0, 10));
  }

  function openNewSession() {
    setEditDate(null);
    setSessionDate(new Date().toISOString().slice(0, 10));
    setBlocks([makeBlock()]);
    setSessionOpen(true);
  }

  function openEditSession(date: string) {
    const dayWorkouts = workouts.filter((w) => w.date === date);
    // Group by exercise, preserving insertion order
    const seen: string[] = [];
    dayWorkouts.forEach((w) => { if (!seen.includes(w.exercise)) seen.push(w.exercise); });

    const newBlocks: ExerciseBlock[] = seen.map((exercise) => {
      const ws = dayWorkouts.filter((w) => w.exercise === exercise);
      return {
        id: Math.random().toString(36).slice(2),
        name: EXERCISES.includes(exercise) ? exercise : "Autre",
        custom: EXERCISES.includes(exercise) ? "" : exercise,
        rows: ws.map((w) => ({
          id: Math.random().toString(36).slice(2),
          sets: w.sets?.toString() ?? "",
          reps: w.reps?.toString() ?? "",
          weight: w.weight_kg?.toString() ?? "",
          notes: w.notes ?? "",
        })),
      };
    });

    setBlocks(newBlocks.length > 0 ? newBlocks : [makeBlock()]);
    setSessionDate(date);
    setEditDate(date);
    setSessionOpen(true);
  }

  async function saveSession() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const rows: any[] = [];
    for (const block of blocks) {
      const exName = block.name === "Autre" ? block.custom : block.name;
      if (!exName) continue;
      for (const row of block.rows) {
        rows.push({
          user_id: user.id,
          date: sessionDate,
          exercise: exName,
          sets: row.sets ? parseInt(row.sets) : null,
          reps: row.reps ? parseInt(row.reps) : null,
          weight_kg: row.weight ? parseFloat(row.weight.replace(",", ".")) : null,
          notes: row.notes || null,
        });
      }
    }
    if (rows.length === 0) return;
    setSaving(true);

    if (editDate) {
      // Replace all rows for the edited date
      await supabase.from("fitness_workouts").delete().eq("user_id", user.id).eq("date", editDate);
    }

    await supabase.from("fitness_workouts").insert(rows);
    await loadWorkouts(user.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      closeSessionModal();
      setTab("workouts");
    }, 1200);
  }

  async function deleteSession(date: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("fitness_workouts").delete().eq("user_id", user.id).eq("date", date);
    setWorkouts((prev) => prev.filter((w) => w.date !== date));
  }

  async function saveBodyWeight() {
    if (!bWeight || !bDate) return;
    setBSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("fitness_body_weight").insert({ user_id: user.id, date: bDate, weight_kg: parseFloat(bWeight.replace(",", ".")), notes: bNotes || null });
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

  // Computed
  const prs: Record<string, number> = {};
  workouts.forEach((w) => { if (w.weight_kg && (!prs[w.exercise] || w.weight_kg > prs[w.exercise])) prs[w.exercise] = w.weight_kg; });

  const byExercise: Record<string, Workout[]> = {};
  workouts.forEach((w) => { if (!byExercise[w.exercise]) byExercise[w.exercise] = []; byExercise[w.exercise].push(w); });

  const sessionDates = [...new Set(workouts.map((w) => w.date))];
  const thisMonth = new Date().toISOString().slice(0, 7);
  const sessionsThisMonth = new Set(workouts.filter((w) => w.date.startsWith(thisMonth)).map((w) => w.date)).size;
  const latestBW = bodyWeights[0];
  const prevBW = bodyWeights[1];
  const bwDiff = latestBW && prevBW ? +(latestBW.weight_kg - prevBW.weight_kg).toFixed(1) : null;
  const recentSessions = sessionDates.slice(0, 5).map((date) => ({ date, exercises: workouts.filter((w) => w.date === date) }));
  const topPRs = Object.entries(prs).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const inputCls = "w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-[#FF5A1F] focus:outline-none";

  if (!authorized || loading) return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#FF5A1F] border-t-transparent" />
        <p className="text-sm text-zinc-500">Chargement...</p>
      </div>
    </div>
  );

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
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF5A1F]">Privé</p>
              <h1 className="text-base font-black leading-none">Mon Suivi Muscu</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setShowBForm(true); setTab("body"); }}
              className="flex items-center gap-1.5 rounded-xl border border-zinc-700 px-3 py-2 text-xs font-bold text-zinc-300 transition hover:border-zinc-500">
              <Scale size={13} /> Poids
            </button>
            <button onClick={() => { openNewSession(); setTab("workouts"); }}
              className="flex items-center gap-1.5 rounded-xl bg-[#FF5A1F] px-3 py-2 text-xs font-bold text-white transition hover:opacity-90">
              <Plus size={13} /> Séance
            </button>
          </div>
        </div>
      </div>

      {/* ── SESSION BUILDER / EDITOR MODAL ── */}
      {sessionOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/95 backdrop-blur-sm">
          <div className="mx-auto max-w-2xl px-4 py-6">

            {/* Modal header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white">
                  {editDate ? "Modifier la séance" : "Nouvelle séance"}
                </h2>
                <p className="text-xs text-zinc-500">
                  {editDate ? "Modifie les exercices puis valide pour enregistrer" : "Ajoute tous tes exercices puis valide"}
                </p>
              </div>
              <button onClick={closeSessionModal} className="rounded-xl border border-zinc-700 p-2 text-zinc-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Date */}
            <div className="mb-5">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-zinc-500">Date</label>
              <input type="date" value={sessionDate} onChange={(e) => setSessionDate(e.target.value)} className={inputCls} />
            </div>

            {/* Exercise blocks */}
            <div className="space-y-4">
              {blocks.map((block, bi) => (
                <div key={block.id} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
                  {/* Exercise name */}
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FF5A1F] text-[10px] font-black">{bi + 1}</span>
                    <select value={block.name} onChange={(e) => updateBlock(block.id, "name", e.target.value)}
                      className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-[#FF5A1F] focus:outline-none">
                      <option value="">Choisir un exercice...</option>
                      {EXERCISES.map((ex) => <option key={ex} value={ex}>{ex}</option>)}
                    </select>
                    {blocks.length > 1 && (
                      <button onClick={() => removeBlock(block.id)} className="rounded-xl p-2 text-zinc-600 hover:text-red-400">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  {block.name === "Autre" && (
                    <input type="text" placeholder="Nom de l'exercice..." value={block.custom}
                      onChange={(e) => updateBlock(block.id, "custom", e.target.value)}
                      className={`mb-3 ${inputCls}`} />
                  )}

                  {/* Set rows */}
                  <div className="space-y-2">
                    {/* Header */}
                    <div className="grid grid-cols-[40px_1fr_1fr_1fr_1fr_32px] gap-1.5 px-1">
                      {["Séries", "Reps", "Kg", "Notes", ""].map((h, i) => (
                        <p key={i} className={`text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-600 ${i === 0 ? "col-span-1" : ""}`}>{h}</p>
                      ))}
                    </div>

                    {block.rows.map((row, ri) => (
                      <div key={row.id} className="grid grid-cols-[40px_1fr_1fr_1fr_1fr_32px] items-center gap-1.5">
                        <span className="text-center text-xs font-bold text-zinc-600">{ri + 1}</span>
                        <input type="number" min="1" placeholder="3" value={row.sets}
                          onChange={(e) => updateRow(block.id, row.id, "sets", e.target.value)}
                          className="rounded-xl border border-zinc-700 bg-zinc-800 px-2 py-2 text-center text-sm text-white focus:border-[#FF5A1F] focus:outline-none" />
                        <input type="number" min="1" placeholder="10" value={row.reps}
                          onChange={(e) => updateRow(block.id, row.id, "reps", e.target.value)}
                          className="rounded-xl border border-zinc-700 bg-zinc-800 px-2 py-2 text-center text-sm text-white focus:border-[#FF5A1F] focus:outline-none" />
                        <input type="text" placeholder="65" value={row.weight}
                          onChange={(e) => updateRow(block.id, row.id, "weight", e.target.value)}
                          className="rounded-xl border border-zinc-700 bg-zinc-800 px-2 py-2 text-center text-sm text-white focus:border-[#FF5A1F] focus:outline-none" />
                        <input type="text" placeholder="rest-pause..." value={row.notes}
                          onChange={(e) => updateRow(block.id, row.id, "notes", e.target.value)}
                          className="rounded-xl border border-zinc-700 bg-zinc-800 px-2 py-2 text-sm text-white focus:border-[#FF5A1F] focus:outline-none" />
                        <button onClick={() => block.rows.length > 1 && removeRow(block.id, row.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-xl text-zinc-700 hover:text-red-400 disabled:opacity-30"
                          disabled={block.rows.length === 1}>
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button onClick={() => addRow(block.id)}
                    className="mt-2.5 flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-[#FF5A1F]">
                    <Plus size={12} /> Ajouter une série
                  </button>
                </div>
              ))}
            </div>

            {/* Add exercise */}
            <button onClick={addBlock}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-zinc-700 py-3.5 text-sm font-bold text-zinc-500 transition hover:border-[#FF5A1F]/50 hover:text-[#FF5A1F]">
              <Plus size={15} /> Ajouter un exercice
            </button>

            {/* Save */}
            <button onClick={saveSession} disabled={saving || saved}
              className={`mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-black transition ${saved ? "bg-green-500 text-white" : "bg-[#FF5A1F] text-white hover:opacity-90 disabled:opacity-50"}`}>
              {saved ? <><Check size={16} /> {editDate ? "Séance mise à jour !" : "Séance enregistrée !"}</> : saving ? "Enregistrement..." : editDate ? "Mettre à jour la séance" : "Valider la séance"}
            </button>

          </div>
        </div>
      )}

      <div className="mx-auto max-w-4xl px-4 py-6">

        {/* Stats bar */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-center">
            <p className="text-2xl font-black text-[#FF5A1F]">{sessionsThisMonth}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-zinc-500">Ce mois</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-center">
            <p className="text-2xl font-black text-[#FF5A1F]">{sessionDates.length}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-zinc-500">Total séances</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-center">
            <p className="text-2xl font-black text-[#FF5A1F]">{latestBW ? `${latestBW.weight_kg} kg` : "—"}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-zinc-500">
              Poids {bwDiff !== null && <span className={bwDiff > 0 ? "text-orange-400" : "text-green-400"}>({bwDiff > 0 ? "+" : ""}{bwDiff})</span>}
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
            <button key={key} onClick={() => setTab(key)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition ${tab === key ? "bg-[#FF5A1F] text-white" : "text-zinc-500 hover:text-zinc-300"}`}>
              <Icon size={13} />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{key === "overview" ? "Stats" : key === "workouts" ? "Séances" : "Poids"}</span>
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div className="space-y-6">
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

            {recentSessions.length > 0 ? (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Flame size={16} className="text-[#FF5A1F]" />
                  <p className="text-sm font-black uppercase tracking-[0.15em] text-[#FF5A1F]">Dernières séances</p>
                </div>
                <div className="space-y-3">
                  {recentSessions.map(({ date, exercises }) => (
                    <div key={date} className="rounded-xl border border-zinc-800 px-4 py-3">
                      <p className="mb-2 text-xs font-bold text-zinc-500 capitalize">
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
            ) : (
              <div className="rounded-2xl border border-dashed border-zinc-700 p-12 text-center">
                <Dumbbell size={32} className="mx-auto mb-3 text-zinc-600" />
                <p className="font-bold text-zinc-500">Aucune séance enregistrée.</p>
                <button onClick={() => { openNewSession(); }} className="mt-4 rounded-xl bg-[#FF5A1F] px-5 py-2.5 text-sm font-bold">
                  Ajouter ma première séance
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── SÉANCES ── */}
        {tab === "workouts" && (
          <div className="space-y-4">
            {/* View mode toggle */}
            <div className="flex gap-1 rounded-2xl border border-zinc-800 bg-zinc-900 p-1">
              <button onClick={() => setSessionViewMode("by-date")}
                className={`flex-1 rounded-xl py-2 text-xs font-bold transition ${sessionViewMode === "by-date" ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300"}`}>
                Par séance
              </button>
              <button onClick={() => setSessionViewMode("by-exercise")}
                className={`flex-1 rounded-xl py-2 text-xs font-bold transition ${sessionViewMode === "by-exercise" ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300"}`}>
                Par exercice
              </button>
            </div>

            {!sessionOpen && (
              <button onClick={openNewSession}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-zinc-700 py-4 text-sm font-bold text-zinc-500 transition hover:border-[#FF5A1F]/50 hover:text-[#FF5A1F]">
                <Plus size={16} /> Nouvelle séance
              </button>
            )}

            {/* ── PAR SÉANCE ── */}
            {sessionViewMode === "by-date" && (
              <>
                {sessionDates.length === 0 && (
                  <p className="py-8 text-center text-zinc-600">Aucune séance enregistrée.</p>
                )}
                {sessionDates.map((date) => {
                  const dayWorkouts = workouts.filter((w) => w.date === date);
                  const exercises = [...new Set(dayWorkouts.map((w) => w.exercise))];
                  return (
                    <div key={date} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-black capitalize text-white">
                          {new Date(date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditSession(date)}
                            className="flex items-center gap-1.5 rounded-xl border border-zinc-700 px-3 py-1.5 text-xs font-bold text-zinc-400 transition hover:border-[#FF5A1F]/50 hover:text-[#FF5A1F]">
                            <Pencil size={11} /> Modifier
                          </button>
                          <button
                            onClick={() => deleteSession(date)}
                            className="rounded-xl border border-zinc-800 p-1.5 text-zinc-600 transition hover:border-red-900/30 hover:bg-red-900/20 hover:text-red-400">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        {exercises.map((ex) => {
                          const exWorkouts = dayWorkouts.filter((w) => w.exercise === ex);
                          const isPR = exWorkouts.some((w) => w.weight_kg !== null && w.weight_kg === prs[ex]);
                          return (
                            <div key={ex} className={`flex items-start justify-between rounded-xl px-3 py-2.5 ${isPR ? "bg-yellow-400/5" : "bg-zinc-800/50"}`}>
                              <div className="flex items-center gap-2">
                                {isPR && <Trophy size={11} className="mt-0.5 shrink-0 text-yellow-400" />}
                                <span className={`text-sm font-semibold ${isPR ? "text-yellow-300" : "text-zinc-300"}`}>{ex}</span>
                              </div>
                              <div className="ml-4 text-right">
                                {exWorkouts.map((w, i) => (
                                  <p key={i} className="text-xs text-zinc-500">
                                    {w.sets && w.reps ? `${w.sets}×${w.reps}` : ""}
                                    {w.weight_kg ? ` @ ${w.weight_kg} kg` : ""}
                                    {!w.sets && !w.reps && !w.weight_kg ? "—" : ""}
                                  </p>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {/* ── PAR EXERCICE ── */}
            {sessionViewMode === "by-exercise" && (
              <>
                {Object.keys(byExercise).length === 0 && (
                  <p className="py-8 text-center text-zinc-600">Aucune entrée enregistrée.</p>
                )}
                {Object.entries(byExercise).map(([exercise, entries]) => {
                  const max = Math.max(...entries.map((e) => e.weight_kg || 0));
                  const isExpanded = expandedExercise === exercise;
                  return (
                    <div key={exercise} className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
                      <button onClick={() => setExpandedExercise(isExpanded ? null : exercise)}
                        className="flex w-full items-center justify-between px-5 py-4">
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
                          {max > 0 && <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-black text-yellow-400">🏆 {max} kg</span>}
                          {isExpanded ? <ChevronUp size={16} className="text-zinc-500" /> : <ChevronDown size={16} className="text-zinc-500" />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-zinc-800 px-5 pb-4 pt-3 space-y-2">
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
                                  {e.notes && <p className="mt-0.5 text-xs italic text-zinc-500">{e.notes}</p>}
                                </div>
                                <button onClick={() => deleteWorkout(e.id)} className="ml-3 rounded-lg p-1.5 text-zinc-600 hover:bg-red-900/30 hover:text-red-400">
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}
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
                    <input type="date" value={bDate} onChange={(e) => setBDate(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-500">Poids (kg)</label>
                    <input type="text" placeholder="82,5" value={bWeight} onChange={(e) => setBWeight(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-500">Notes</label>
                    <input type="text" placeholder="À jeun, matin..." value={bNotes} onChange={(e) => setBNotes(e.target.value)} className={inputCls} />
                  </div>
                </div>
                <button onClick={saveBodyWeight} disabled={bSaving || !bWeight}
                  className="mt-4 w-full rounded-xl bg-[#FF5A1F] py-3 text-sm font-black disabled:opacity-40">
                  {bSaving ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            )}

            {!showBForm && (
              <button onClick={() => setShowBForm(true)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-zinc-700 py-4 text-sm font-bold text-zinc-500 transition hover:border-[#FF5A1F]/50 hover:text-[#FF5A1F]">
                <Plus size={16} /> Ajouter une pesée
              </button>
            )}

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
                          <div className={`w-full rounded-t-lg ${isLatest ? "bg-[#FF5A1F]" : "bg-zinc-700 group-hover:bg-zinc-500"}`} style={{ height: `${h}px` }} />
                          <div className="absolute -top-6 hidden rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-bold text-white group-hover:block">{b.weight_kg}kg</div>
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

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-zinc-500">Historique</p>
              {bodyWeights.length === 0 && <p className="py-4 text-center text-zinc-600">Aucune pesée enregistrée.</p>}
              <div className="space-y-2">
                {bodyWeights.map((b, i) => {
                  const prev = bodyWeights[i + 1];
                  const diff = prev ? +(b.weight_kg - prev.weight_kg).toFixed(1) : null;
                  return (
                    <div key={b.id} className="flex items-center justify-between rounded-xl border border-zinc-800 px-4 py-3">
                      <div>
                        <p className="text-xs capitalize text-zinc-500">
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
                        {b.notes && <p className="mt-0.5 text-xs italic text-zinc-600">{b.notes}</p>}
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

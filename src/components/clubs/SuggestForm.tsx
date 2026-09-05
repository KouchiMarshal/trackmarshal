"use client";

import { useState } from "react";

type Kind = "annuaire" | "calendrier";

export default function SuggestForm({ kind, onDone }: { kind: Kind; onDone?: () => void }) {
  const isCal = kind === "calendrier";
  const [form, setForm] = useState({
    name: "", category: "", region: "", city: "", contact: "", message: "",
    date: "", discipline: "", website: "",
  });
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [err, setErr] = useState("");

  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.name.trim().length < 2) { setErr("Indique au moins un nom."); setState("error"); return; }
    setState("sending"); setErr("");

    // Pour une date, on compose le message avec date + discipline.
    const message = isCal
      ? [form.date && `Date : ${form.date}`, form.discipline && `Discipline : ${form.discipline}`, form.message]
          .filter(Boolean).join(" · ")
      : form.message;

    const payload = {
      kind,
      name: form.name,
      category: isCal ? "evenement" : form.category,
      region: form.region,
      city: form.city,
      contact: form.contact,
      message,
      website: form.website, // honeypot
    };

    try {
      const res = await fetch("/api/club-suggestions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setState("done");
    } catch (e: any) { setErr(e?.message || "Envoi impossible."); setState("error"); }
  }

  if (state === "done") {
    return (
      <div className="mt-6 rounded-2xl border border-green-300 bg-green-50 p-5 text-center">
        <p className="text-2xl">✅</p>
        <p className="mt-2 font-bold text-green-800">Merci ! Ta proposition a bien été envoyée.</p>
        {onDone && <button onClick={onDone} className="mt-3 text-sm font-bold text-green-700 hover:underline">Fermer</button>}
      </div>
    );
  }

  const input = "rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm";

  return (
    <form onSubmit={submit} className="mt-6 grid gap-3 sm:grid-cols-2">
      <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder={isCal ? "Nom de l'épreuve *" : "Nom du club / circuit / épreuve *"} className={`${input} sm:col-span-2`} />

      {isCal ? (
        <>
          <input value={form.date} onChange={(e) => set("date", e.target.value)} placeholder="Date (ex. 14/09/2026)" className={input} />
          <input value={form.discipline} onChange={(e) => set("discipline", e.target.value)} placeholder="Discipline (rallye, circuit…)" className={input} />
          <input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Lieu / circuit" className={input} />
          <input value={form.region} onChange={(e) => set("region", e.target.value)} placeholder="Région" className={input} />
        </>
      ) : (
        <>
          <select value={form.category} onChange={(e) => set("category", e.target.value)} className={`${input} font-bold text-zinc-700`}>
            <option value="">Type…</option>
            <option value="club">Club / ASA (pour débuter)</option>
            <option value="circuit">Où officier (circuit, organisateur, épreuve)</option>
          </select>
          <input value={form.region} onChange={(e) => set("region", e.target.value)} placeholder="Région / pays" className={input} />
          <input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Ville" className={input} />
        </>
      )}

      <input value={form.contact} onChange={(e) => set("contact", e.target.value)} placeholder={isCal ? "Lien officiel / inscription" : "Contact (site, email, tél)"} className={`${input} ${isCal ? "" : "sm:col-span-2"}`} />
      <textarea value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Infos complémentaires (facultatif)" rows={2} className={`${input} sm:col-span-2`} />

      {/* Honeypot anti-bot */}
      <input value={form.website} onChange={(e) => set("website", e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      {state === "error" && <p className="text-sm font-medium text-red-600 sm:col-span-2">{err}</p>}
      <button type="submit" disabled={state === "sending"} className="rounded-xl bg-[#FF5A1F] px-6 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50 sm:col-span-2 sm:w-fit">
        {state === "sending" ? "Envoi…" : "Envoyer ma proposition"}
      </button>
    </form>
  );
}

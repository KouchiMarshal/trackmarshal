"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, Clock3, ExternalLink, FlaskConical, XCircle } from "lucide-react";
import { Toast, type ToastData } from "@/components/ui/toast";
import { sendEmail } from "@/lib/sendEmail";

export default function AdminLicensesPage() {
  const [commissaires, setCommissaires] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "verified" | "all">("pending");
  const [toast, setToast] = useState<ToastData>(null);
  const [testingEmail, setTestingEmail] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, email, avatar_url, license_type, license_number, license_url, license_verified, created_at")
      .eq("role", "marshal")
      .not("license_url", "is", null)
      .order("created_at", { ascending: false });

    setCommissaires(data || []);
    setLoading(false);
  }

  async function testEmailSystem() {
    setTestingEmail(true);
    const { data: { session } } = await supabase.auth.getSession();
    const { data: { user } } = await supabase.auth.getUser();
    if (!session || !user?.email) {
      setToast({ message: "Session introuvable.", type: "error" });
      setTestingEmail(false);
      return;
    }
    const res = await fetch("/api/send-email/test", {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    const result = await res.json();
    if (result.ok) {
      setToast({ message: `Email de test envoyé à ${result.to} ✓`, type: "success" });
    } else {
      setToast({ message: `Échec : ${JSON.stringify(result)}`, type: "error" });
    }
    setTestingEmail(false);
  }

  async function validate(id: string, verified: boolean) {
    await supabase.from("profiles").update({ license_verified: verified }).eq("id", id);

    await supabase.from("notifications").insert({
      user_id: id,
      title: verified
        ? "Votre licence a été validée ✔"
        : "Votre licence n'a pas pu être validée",
      type: verified ? "license_verified" : "license_rejected",
      link: "/dashboard/profile",
    });

    const commissaire = commissaires.find((c) => c.id === id);
    if (commissaire?.email) {
      sendEmail(commissaire.email, verified ? "license_validated" : "license_rejected", {
        licenseType: commissaire.license_type,
      });
    }

    setToast({
      message: verified ? "Licence validée." : "Licence rejetée.",
      type: verified ? "success" : "error",
    });

    setCommissaires((prev) =>
      prev.map((c) => c.id === id ? { ...c, license_verified: verified } : c)
    );
  }

  const filtered = commissaires.filter((c) => {
    if (filter === "pending") return !c.license_verified;
    if (filter === "verified") return c.license_verified;
    return true;
  });

  const counts = {
    all: commissaires.length,
    pending: commissaires.filter((c) => !c.license_verified).length,
    verified: commissaires.filter((c) => c.license_verified).length,
  };

  return (
    <div>
      <Toast toast={toast} onClose={() => setToast(null)} />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur-2xl">
        <div className="flex h-20 items-center justify-between px-6 lg:px-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Administration</p>
            <h1 className="mt-1 text-2xl font-black lg:text-3xl">Validation des licences</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-5 py-3 text-center">
              <p className="text-xs text-zinc-500">En attente</p>
              <p className="text-2xl font-black text-yellow-400">{counts.pending}</p>
            </div>
            <div className="hidden rounded-2xl border border-green-500/20 bg-green-500/10 px-5 py-3 text-center sm:block">
              <p className="text-xs text-zinc-500">Validées</p>
              <p className="text-2xl font-black text-green-400">{counts.verified}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] p-6 lg:p-10">

        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-3">
            {([
              { key: "pending", label: "En attente", count: counts.pending, activeClass: "bg-yellow-600" },
              { key: "verified", label: "Validées", count: counts.verified, activeClass: "bg-green-600" },
              { key: "all", label: "Toutes", count: counts.all, activeClass: "bg-[#FF5A1F]" },
            ] as const).map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`flex items-center gap-2 rounded-2xl px-5 py-3 font-bold transition ${
                  filter === f.key ? f.activeClass : "bg-white/[0.05] text-zinc-400 hover:text-white"
                }`}
              >
                {f.label}
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">{f.count}</span>
              </button>
            ))}
          </div>
          <button
            onClick={testEmailSystem}
            disabled={testingEmail}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-bold text-zinc-400 transition hover:text-white disabled:opacity-50"
          >
            <FlaskConical size={16} />
            {testingEmail ? "Envoi..." : "Tester les emails"}
          </button>
        </div>

        {loading && <p className="py-20 text-center text-zinc-500">Chargement...</p>}

        {!loading && filtered.length === 0 && (
          <div className="rounded-[32px] border border-dashed border-white/10 p-16 text-center">
            <CheckCircle2 size={40} className="mx-auto text-green-400" />
            <h2 className="mt-6 text-2xl font-black">
              {filter === "pending" ? "Aucune licence en attente" : "Aucun résultat"}
            </h2>
            <p className="mt-3 text-zinc-500">
              {filter === "pending" ? "Toutes les licences ont été traitées." : ""}
            </p>
          </div>
        )}

        <div className="space-y-5">
          {filtered.map((c) => (
            <div key={c.id} className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03]">
              <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start lg:p-8">

                {/* Identité */}
                <div className="flex items-center gap-4 sm:w-64 sm:shrink-0">
                  <img
                    src={
                      c.avatar_url ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(c.full_name || "C")}&background=FF5A1F&color=fff&size=80`
                    }
                    alt={c.full_name}
                    className="h-16 w-16 shrink-0 rounded-2xl object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-black">{c.full_name || "Sans nom"}</p>
                    <p className="truncate text-sm text-zinc-400">{c.email}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      Inscrit le {new Date(c.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>

                {/* Infos licence */}
                <div className="flex-1 space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                      <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">Type de licence</p>
                      <p className="mt-2 font-bold text-[#FF5A1F]">{c.license_type || "—"}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                      <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">Numéro de licence</p>
                      <p className="mt-2 font-bold">{c.license_number || "—"}</p>
                    </div>
                  </div>

                  <a
                    href={c.license_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-2xl border border-[#FF5A1F]/20 bg-[#FF5A1F]/5 px-5 py-4 font-bold text-[#FF5A1F] transition hover:border-[#FF5A1F]/40 hover:bg-[#FF5A1F]/10"
                  >
                    <ExternalLink size={18} />
                    Ouvrir la licence (PDF ou image)
                  </a>
                </div>

                {/* Statut + actions */}
                <div className="flex flex-col items-start gap-3 sm:items-end sm:shrink-0">
                  <span className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] ${
                    c.license_verified
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {c.license_verified ? "✔ Validée" : "⏳ En attente"}
                  </span>

                  <div className="flex gap-3">
                    <button
                      onClick={() => validate(c.id, true)}
                      disabled={c.license_verified}
                      className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition ${
                        c.license_verified
                          ? "cursor-not-allowed bg-zinc-800 text-zinc-600"
                          : "bg-green-600 hover:scale-105"
                      }`}
                    >
                      <CheckCircle2 size={16} />
                      Valider
                    </button>
                    <button
                      onClick={() => validate(c.id, false)}
                      disabled={!c.license_verified}
                      className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition ${
                        !c.license_verified
                          ? "cursor-not-allowed bg-zinc-800 text-zinc-600"
                          : "bg-red-600 hover:scale-105"
                      }`}
                    >
                      <XCircle size={16} />
                      Rejeter
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

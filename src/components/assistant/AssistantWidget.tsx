"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Que signifie le drapeau jaune agité ?",
  "Quelle est la différence entre Safety Car et VSC ?",
  "Comment devenir commissaire de piste ?",
  "Que faire si une voiture sort de la piste ?",
];

export default function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;

    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    // On ajoute un message assistant vide qu'on remplira au fil du flux.
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erreur réseau");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch (e: any) {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content: "⚠️ " + (e?.message || "Une erreur est survenue.") };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Bouton flottant */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Ouvrir l'assistant commissaire"
          className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#FF5A1F] text-white shadow-xl shadow-[#FF5A1F]/30 transition hover:scale-105"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {/* Panneau */}
      {open && (
        <div className="fixed bottom-5 right-5 z-50 flex h-[min(620px,calc(100dvh-2.5rem))] w-[min(400px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-[24px] border border-zinc-200 bg-white shadow-2xl">
          {/* En-tête */}
          <div className="flex items-center justify-between bg-[#FF5A1F] px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <span className="text-lg">🏁</span>
              <div>
                <p className="text-sm font-black leading-none">Assistant commissaire</p>
                <p className="mt-0.5 text-[11px] opacity-90">Propulsé par l'IA · réponses indicatives</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Fermer" className="rounded-lg p-1 transition hover:bg-white/20">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Fil */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-zinc-50 p-4">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm text-zinc-600">
                  Pose-moi une question sur le métier de commissaire : drapeaux, procédures, sécurité, licences…
                </p>
                <div className="flex flex-col gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-left text-sm text-zinc-700 transition hover:border-[#FF5A1F]/50 hover:bg-orange-50"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-[#FF5A1F] text-white"
                      : "border border-zinc-200 bg-white text-zinc-800"
                  }`}
                >
                  {m.content || (loading && i === messages.length - 1 ? "…" : "")}
                </div>
              </div>
            ))}
          </div>

          {/* Saisie */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="flex items-end gap-2 border-t border-zinc-200 bg-white p-3"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
              placeholder="Écris ta question…"
              rows={1}
              className="max-h-28 flex-1 resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[#FF5A1F]"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="shrink-0 rounded-xl bg-[#FF5A1F] px-3.5 py-2.5 text-white transition hover:opacity-90 disabled:opacity-40"
              aria-label="Envoyer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";
import { Mail, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <PublicNavbar />

      <section className="relative overflow-hidden pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-[#FF5A1F]/6 blur-[160px] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F]">Nous contacter</p>
          <h1 className="mt-4 text-5xl font-black leading-[0.92] tracking-[-0.04em] text-zinc-900 sm:text-6xl lg:text-8xl">
            Une question ?<br />
            <span className="text-[#FF5A1F]">Écrivez-nous.</span>
          </h1>

          <div className="mt-16 grid gap-12 lg:grid-cols-2">

            <div>
              <div className="space-y-6">
                <div className="flex items-start gap-4 rounded-[24px] border border-zinc-200 bg-white p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FF5A1F]/10">
                    <Mail size={20} className="text-[#FF5A1F]" />
                  </div>
                  <div>
                    <p className="font-black text-zinc-900">Email</p>
                    <a href="mailto:contact.trackmarshal@gmail.com" className="mt-1 text-zinc-600 hover:text-[#FF5A1F] transition text-sm">
                      contact.trackmarshal@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-[24px] border border-zinc-200 bg-white p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FF5A1F]/10">
                    <MapPin size={20} className="text-[#FF5A1F]" />
                  </div>
                  <div>
                    <p className="font-black text-zinc-900">Basé en France</p>
                    <p className="mt-1 text-sm text-zinc-600">Plateforme nationale — commissaires FFSA &amp; FFM</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-[24px] border border-zinc-200 bg-white p-6">
                <p className="font-black text-zinc-900">Suivez-nous</p>
                <div className="mt-4 flex gap-4">
                  <a
                    href="https://www.instagram.com/trackmarshal.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 text-zinc-500 transition hover:border-[#FF5A1F]/40 hover:text-[#FF5A1F]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </a>
                  <a
                    href="https://www.facebook.com/share/18tQGXmfYB/?mibextid=wwXIfr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 text-zinc-500 transition hover:border-[#FF5A1F]/40 hover:text-[#FF5A1F]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-zinc-200 bg-white p-8 shadow-sm">
              {status === "success" ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <Send size={28} className="text-green-600" />
                  </div>
                  <h2 className="mt-6 text-2xl font-black text-zinc-900">Message envoyé !</h2>
                  <p className="mt-3 text-zinc-600">Nous vous répondrons dans les plus brefs délais.</p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-8 rounded-2xl bg-[#FF5A1F] px-8 py-3 font-bold text-white transition hover:opacity-90"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="text-2xl font-black text-zinc-900">Envoyer un message</h2>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-bold text-zinc-700">Nom</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Votre nom"
                        className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-[#FF5A1F] focus:ring-1 focus:ring-[#FF5A1F]/30 placeholder:text-zinc-400"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-bold text-zinc-700">Email</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="votre@email.com"
                        className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-[#FF5A1F] focus:ring-1 focus:ring-[#FF5A1F]/30 placeholder:text-zinc-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-zinc-700">Sujet</label>
                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="Objet de votre message"
                      className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-[#FF5A1F] focus:ring-1 focus:ring-[#FF5A1F]/30 placeholder:text-zinc-400"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-zinc-700">Message</label>
                    <textarea
                      required
                      rows={6}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Décrivez votre demande..."
                      className="w-full resize-none rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-[#FF5A1F] focus:ring-1 focus:ring-[#FF5A1F]/30 placeholder:text-zinc-400"
                    />
                  </div>

                  {status === "error" && (
                    <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                      Une erreur est survenue. Veuillez réessayer ou nous contacter directement par email.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#FF5A1F] font-bold text-white transition hover:opacity-90 disabled:opacity-60"
                  >
                    <Send size={18} />
                    {status === "sending" ? "Envoi en cours..." : "Envoyer le message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}

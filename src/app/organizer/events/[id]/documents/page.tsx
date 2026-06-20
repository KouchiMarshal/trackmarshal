"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, Trash2, Upload, File } from "lucide-react";
import { supabase } from "@/lib/supabase";
import OrganizerSidebar from "@/components/layout/organizer-sidebar";
import NotificationBell from "@/components/notifications/notification-bell";

export default function EventDocumentsPage() {
  const { id: eventId } = useParams() as { id: string };
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [eventTitle, setEventTitle] = useState("");
  const [docs, setDocs] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => { load(); }, [eventId]);

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const { data: event } = await supabase.from("events").select("title").eq("id", eventId).eq("organizer_id", user.id).maybeSingle();
    if (!event) { router.push("/organizer/events"); return; }
    setEventTitle(event.title);

    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(`/api/organizer/documents?eventId=${eventId}`, {
      headers: { Authorization: `Bearer ${session?.access_token}` },
    });
    const data = await res.json();
    setDocs(data.docs || []);
  }

  async function uploadFile(file: File) {
    if (!file) return;
    setUploading(true);
    setError(null);
    const { data: { session } } = await supabase.auth.getSession();
    const form = new FormData();
    form.append("file", file);
    form.append("eventId", eventId);
    const res = await fetch("/api/organizer/documents", {
      method: "POST",
      headers: { Authorization: `Bearer ${session?.access_token}` },
      body: form,
    });
    const data = await res.json();
    if (data.ok) {
      setDocs((prev) => [data.doc, ...prev]);
    } else {
      setError(data.error || "Erreur lors de l'upload");
    }
    setUploading(false);
  }

  async function deleteDoc(docId: string) {
    setDeletingId(docId);
    const { data: { session } } = await supabase.auth.getSession();
    await fetch("/api/organizer/documents", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ docId }),
    });
    setDocs((prev) => prev.filter((d) => d.id !== docId));
    setDeletingId(null);
  }

  function formatSize(bytes: number) {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="flex min-h-screen">
        <OrganizerSidebar />
        <div className="flex-1">
          <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white">
            <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-10">
              <div className="flex items-center gap-4">
                <Link href={`/organizer/events/${eventId}`} className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-50">
                  <ArrowLeft size={18} />
                </Link>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Documents</p>
                  <h1 className="mt-0.5 text-xl font-black text-zinc-900 lg:text-2xl">{eventTitle}</h1>
                </div>
              </div>
              <NotificationBell />
            </div>
          </header>

          <div className="mx-auto max-w-3xl p-4 pb-24 sm:p-6 lg:p-10">

            {/* Upload zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) uploadFile(f); }}
              onClick={() => inputRef.current?.click()}
              className={`cursor-pointer rounded-[32px] border-2 border-dashed p-12 text-center transition ${dragOver ? "border-[#FF5A1F] bg-[#FF5A1F]/5" : "border-zinc-300 bg-white hover:border-[#FF5A1F]/50"}`}
            >
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.txt"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f); }}
              />
              <Upload size={32} className="mx-auto mb-3 text-zinc-400" />
              {uploading ? (
                <p className="font-bold text-[#FF5A1F]">Envoi en cours...</p>
              ) : (
                <>
                  <p className="font-black text-zinc-900">Déposer un fichier ici</p>
                  <p className="mt-1 text-sm text-zinc-500">ou cliquer pour sélectionner — PDF, Word, Excel, image</p>
                </>
              )}
            </div>

            {error && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div>
            )}

            {/* Documents list */}
            <div className="mt-8 space-y-3">
              {docs.length === 0 && !uploading && (
                <p className="text-center text-zinc-400">Aucun document pour l'instant.</p>
              )}
              {docs.map((doc) => (
                <div key={doc.id} className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FF5A1F]/10 text-[#FF5A1F]">
                    <File size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="truncate font-bold text-zinc-900 hover:text-[#FF5A1F]">
                      {doc.name}
                    </a>
                    <p className="text-xs text-zinc-400">
                      {formatSize(doc.size_bytes)} · {new Date(doc.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteDoc(doc.id)}
                    disabled={deletingId === doc.id}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

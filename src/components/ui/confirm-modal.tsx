"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="mx-0 w-full rounded-t-[32px] border border-zinc-200 bg-white p-8 shadow-xl sm:mx-4 sm:max-w-md sm:rounded-[32px]">
        {danger && (
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-200 bg-red-100">
            <AlertTriangle size={24} className="text-red-600" />
          </div>
        )}
        <h2 className="text-2xl font-black text-zinc-900">{title}</h2>
        <p className="mt-4 leading-relaxed text-zinc-600">{message}</p>
        <div className="mt-8 flex gap-4">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex h-14 flex-1 items-center justify-center rounded-2xl border border-zinc-300 font-bold text-zinc-600 transition hover:border-zinc-400 hover:text-zinc-900 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex h-14 flex-1 items-center justify-center rounded-2xl font-black text-white transition hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 ${
              danger ? "bg-red-600 hover:bg-red-500" : "bg-[#FF5A1F] hover:bg-[#FF6A2F]"
            }`}
          >
            {loading ? "..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

export type ToastData = {
  message: string;
  type: "success" | "error";
} | null;

export function Toast({
  toast,
  onClose,
}: {
  toast: ToastData;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 lg:bottom-8">
      <div
        className={`flex items-center gap-3 rounded-2xl border px-5 py-4 shadow-2xl backdrop-blur-xl ${
          toast.type === "success"
            ? "border-green-500/30 bg-green-500/10 text-green-400"
            : "border-red-500/30 bg-red-500/10 text-red-400"
        }`}
      >
        {toast.type === "success" ? (
          <CheckCircle2 size={20} />
        ) : (
          <XCircle size={20} />
        )}
        <p className="font-bold">{toast.message}</p>
        <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

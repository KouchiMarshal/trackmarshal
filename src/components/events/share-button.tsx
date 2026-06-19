"use client";

import { useState, useRef, useEffect } from "react";
import { Check, Copy, Share2 } from "lucide-react";

type Props = { title: string; slug: string };

export default function ShareButton({ title, slug }: Props) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [dropPos, setDropPos] = useState({ top: 0, right: 0 });

  const url = `https://www.trackmarshal.app/events/${slug}`;

  function handleToggle() {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
    setOpen((v) => !v);
  }

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        buttonRef.current?.contains(e.target as Node) ||
        dropRef.current?.contains(e.target as Node)
      ) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function shareWhatsApp() {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${title} — Postulez comme commissaire !\n${url}`)}`,
      "_blank"
    );
  }

  async function nativeShare() {
    if (navigator.share) {
      await navigator.share({ title, url });
    }
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="flex h-12 items-center gap-2 rounded-2xl border border-zinc-300 bg-zinc-50 px-5 text-sm font-bold text-zinc-700 transition hover:border-[#FF5A1F]/40 hover:text-zinc-900"
      >
        <Share2 size={16} />
        Partager
      </button>

      {open && (
        <div
          ref={dropRef}
          style={{ top: dropPos.top, right: dropPos.right }}
          className="fixed z-[9999] w-56 overflow-hidden rounded-[20px] border border-zinc-200 bg-white shadow-lg"
        >
          <button
            onClick={copyLink}
            className="flex w-full items-center gap-3 px-5 py-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
          >
            {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
            {copied ? "Lien copié !" : "Copier le lien"}
          </button>
          <button
            onClick={shareWhatsApp}
            className="flex w-full items-center gap-3 border-t border-zinc-100 px-5 py-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </button>
          {"share" in navigator && (
            <button
              onClick={nativeShare}
              className="flex w-full items-center gap-3 border-t border-zinc-100 px-5 py-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
            >
              <Share2 size={16} />
              Autres apps
            </button>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import NotificationBell from "@/components/notifications/notification-bell";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/events", label: "Événements" },
  { href: "/actualites", label: "Actualités" },
  { href: "/about", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export default function PublicNavbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const isAdmin = user?.email === (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "foussardk@gmail.com");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });
  }, []);

  return (
    <>
      <header className="fixed left-0 top-0 z-50 w-full border-b border-zinc-200 bg-white/90 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">

          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="TrackMarshal" width={44} height={44} className="h-9 w-9 rounded-full object-cover lg:h-11 lg:w-11" />
            <h1 className="text-xl font-black text-zinc-900 lg:text-2xl">
              Track<span className="text-[#FF5A1F]">Marshal</span>
            </h1>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-bold uppercase tracking-[0.12em] transition hover:text-[#FF5A1F] ${
                  pathname === link.href ? "text-[#FF5A1F]" : "text-zinc-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <Link
                href="/devenir-commissaire"
                className={`text-sm font-bold uppercase tracking-[0.12em] transition hover:text-[#FF5A1F] ${
                  pathname === "/devenir-commissaire" ? "text-[#FF5A1F]" : "text-zinc-600"
                }`}
              >
                Devenir commissaire
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/apprendre"
                className={`text-sm font-bold uppercase tracking-[0.12em] transition hover:text-[#FF5A1F] ${
                  pathname.startsWith("/apprendre") ? "text-[#FF5A1F]" : "text-zinc-600"
                }`}
              >
                Apprendre
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <NotificationBell />
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="hidden h-10 items-center rounded-xl border border-[#FF5A1F]/40 bg-[#FF5A1F]/10 px-4 text-sm font-bold text-[#FF5A1F] transition hover:bg-[#FF5A1F]/20 lg:flex"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="flex h-10 items-center rounded-xl bg-[#FF5A1F] px-5 text-sm font-bold text-white transition hover:opacity-90 lg:h-11 lg:px-7"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden h-10 items-center rounded-xl border border-zinc-300 px-5 text-sm font-bold text-zinc-700 transition hover:border-[#FF5A1F]/50 hover:text-[#FF5A1F] lg:flex"
                >
                  Se connecter
                </Link>
                <Link
                  href="/register"
                  className="hidden h-10 items-center rounded-xl bg-[#FF5A1F] px-5 text-sm font-bold text-white transition hover:opacity-90 lg:flex lg:h-11 lg:px-7"
                >
                  S'inscrire
                </Link>
              </>
            )}

            <button
              onClick={() => setOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-300 text-zinc-600 lg:hidden"
            >
              <Menu size={20} />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile menu overlay */}
      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-white lg:hidden">
          <div className="flex h-16 items-center justify-between border-b border-zinc-200 px-4">
            <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-3">
              <Image src="/logo.png" alt="TrackMarshal" width={36} height={36} className="h-9 w-9 rounded-full object-cover" />
              <h1 className="text-xl font-black text-zinc-900">
                Track<span className="text-[#FF5A1F]">Marshal</span>
              </h1>
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-300 text-zinc-600"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-1 flex-col justify-between p-5">
            <nav className="space-y-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex h-14 items-center rounded-2xl px-5 text-lg font-black transition ${
                    pathname === link.href
                      ? "bg-[#FF5A1F] text-white"
                      : "text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {!user && (
                <Link
                  href="/devenir-commissaire"
                  onClick={() => setOpen(false)}
                  className={`flex h-14 items-center rounded-2xl px-5 text-lg font-black transition ${
                    pathname === "/devenir-commissaire"
                      ? "bg-[#FF5A1F] text-white"
                      : "text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  Devenir commissaire
                </Link>
              )}
              {isAdmin && (
                <Link
                  href="/apprendre"
                  onClick={() => setOpen(false)}
                  className={`flex h-14 items-center rounded-2xl px-5 text-lg font-black transition ${
                    pathname.startsWith("/apprendre")
                      ? "bg-[#FF5A1F] text-white"
                      : "text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  📚 Apprendre
                </Link>
              )}
            </nav>

            <div className="space-y-3">
              {user ? (
                <>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className="flex h-13 items-center justify-center rounded-2xl border border-[#FF5A1F]/40 bg-[#FF5A1F]/10 font-black text-[#FF5A1F]"
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex h-13 items-center justify-center rounded-2xl bg-[#FF5A1F] font-black text-white"
                  >
                    Mon Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex h-13 items-center justify-center rounded-2xl border border-zinc-300 font-bold text-zinc-800"
                  >
                    Se connecter
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="flex h-13 items-center justify-center rounded-2xl bg-[#FF5A1F] font-black text-white"
                  >
                    S'inscrire
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

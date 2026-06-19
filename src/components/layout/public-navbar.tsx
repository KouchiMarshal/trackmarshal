"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import NotificationBell from "@/components/notifications/notification-bell";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/events", label: "Événements" },
  { href: "/about", label: "À propos" },
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
      <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur-2xl">
        <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:h-24 lg:px-8">

          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="TrackMarshal" className="h-10 w-10 rounded-full object-cover lg:h-12 lg:w-12" />
            <h1 className="text-2xl font-black lg:text-3xl">
              Track<span className="text-[#FF5A1F]">Marshal</span>
            </h1>
          </Link>

          <nav className="hidden items-center gap-10 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-bold uppercase tracking-[0.15em] transition hover:text-[#FF5A1F] ${
                  pathname === link.href ? "text-[#FF5A1F]" : "text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <Link
                href="/devenir-commissaire"
                className={`text-sm font-bold uppercase tracking-[0.15em] transition hover:text-[#FF5A1F] ${
                  pathname === "/devenir-commissaire" ? "text-[#FF5A1F]" : "text-white"
                }`}
              >
                Devenir commissaire
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/apprendre"
                className={`text-sm font-bold uppercase tracking-[0.15em] transition hover:text-[#FF5A1F] ${
                  pathname.startsWith("/apprendre") ? "text-[#FF5A1F]" : "text-white"
                }`}
              >
                Apprendre
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <NotificationBell />
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="hidden h-12 items-center rounded-2xl border border-[#FF5A1F]/40 bg-[#FF5A1F]/10 px-5 text-sm font-bold text-[#FF5A1F] transition hover:bg-[#FF5A1F]/20 lg:flex"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="flex h-12 items-center rounded-2xl bg-[#FF5A1F] px-5 text-sm font-bold transition hover:scale-105 lg:h-14 lg:px-8 lg:text-base"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden h-12 items-center rounded-2xl border border-white/10 px-6 text-sm font-bold transition hover:border-[#FF5A1F]/40 hover:bg-[#FF5A1F]/10 lg:flex"
                >
                  Se connecter
                </Link>
                <Link
                  href="/register"
                  className="hidden h-12 items-center rounded-2xl bg-[#FF5A1F] px-5 text-sm font-bold transition hover:scale-105 lg:flex lg:h-14 lg:px-8 lg:text-base"
                >
                  S'inscrire
                </Link>
              </>
            )}

            <button
              onClick={() => setOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 lg:hidden"
            >
              <Menu size={20} />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile menu overlay */}
      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-black lg:hidden">
          <div className="flex h-20 items-center justify-between px-4">
            <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-3">
              <img src="/logo.png" alt="TrackMarshal" className="h-10 w-10 rounded-full object-cover" />
              <h1 className="text-2xl font-black">
                Track<span className="text-[#FF5A1F]">Marshal</span>
              </h1>
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-1 flex-col justify-between p-6">
            <nav className="space-y-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex h-16 items-center rounded-2xl px-6 text-xl font-black transition ${
                    pathname === link.href
                      ? "bg-[#FF5A1F] text-white"
                      : "text-zinc-300 hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {!user && (
                <Link
                  href="/devenir-commissaire"
                  onClick={() => setOpen(false)}
                  className={`flex h-16 items-center rounded-2xl px-6 text-xl font-black transition ${
                    pathname === "/devenir-commissaire"
                      ? "bg-[#FF5A1F] text-white"
                      : "text-zinc-300 hover:bg-white/5"
                  }`}
                >
                  Devenir commissaire
                </Link>
              )}
              {isAdmin && (
                <Link
                  href="/apprendre"
                  onClick={() => setOpen(false)}
                  className={`flex h-16 items-center rounded-2xl px-6 text-xl font-black transition ${
                    pathname.startsWith("/apprendre")
                      ? "bg-[#FF5A1F] text-white"
                      : "text-zinc-300 hover:bg-white/5"
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
                      className="flex h-14 items-center justify-center rounded-2xl border border-[#FF5A1F]/40 bg-[#FF5A1F]/10 font-black text-[#FF5A1F]"
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex h-14 items-center justify-center rounded-2xl bg-[#FF5A1F] font-black"
                  >
                    Mon Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex h-14 items-center justify-center rounded-2xl border border-white/10 font-bold"
                  >
                    Se connecter
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="flex h-14 items-center justify-center rounded-2xl bg-[#FF5A1F] font-black"
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

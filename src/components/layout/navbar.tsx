"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import NotificationBell from "@/components/notifications/notification-bell";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-2xl">

      <div className="mx-auto flex h-24 max-w-[1600px] items-center justify-between px-4 md:px-8">

        <Link
          href="/"
          className="text-2xl font-black uppercase tracking-[-0.08em] text-zinc-900 md:text-3xl"
        >
          Track<span className="text-[#FF5A1F]">Marshal</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          <Link
            href="/events"
            className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-600 transition hover:text-zinc-900"
          >
            Événements
          </Link>

          {user && (
            <Link
              href="/dashboard"
              className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-600 transition hover:text-zinc-900"
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <NotificationBell />
              <button
                onClick={handleLogout}
                className="rounded-2xl bg-[#FF5A1F] px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:scale-105"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-2xl bg-[#FF5A1F] px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:scale-105"
            >
              Connexion
            </Link>
          )}
        </div>

      </div>

    </header>
  );
}

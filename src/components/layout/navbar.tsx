"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

export default function Navbar() {

  const [user, setUser] =
    useState<any>(null);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [notifications, setNotifications] =
    useState<any[]>([]);

  const [open, setOpen] =
    useState(false);

  useEffect(() => {

    checkUser();

  }, []);

  async function checkUser() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);

    if (user) {

      loadNotifications();

      const channel = supabase
        .channel(
          "navbar-notifications"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notifications",
          },
          () => {
            loadNotifications();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(
          channel
        );
      };
    }
  }

  async function loadNotifications() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    setNotifications(data || []);

    setUnreadCount(
      data?.filter(
        (n) => !n.read
      ).length || 0
    );
  }

  async function markAllAsRead() {

    if (!user) return;

    await supabase
      .from("notifications")
      .update({
        read: true,
      })
      .eq("user_id", user.id);

    loadNotifications();
  }

  async function handleLogout() {

    await supabase.auth.signOut();

    window.location.href = "/";
  }

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/40 backdrop-blur-2xl">

      <div className="mx-auto flex h-24 max-w-[1600px] items-center justify-between px-4 md:px-8">

        <Link
          href="/"
          className="text-2xl font-black uppercase tracking-[-0.08em] text-white md:text-3xl"
        >

          Track
          <span className="text-[#FF5A1F]">

            Marshal

          </span>

        </Link>

        <nav className="hidden items-center gap-8 lg:flex">

          <Link
            href="/events"
            className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-300 transition hover:text-white"
          >

            Événements

          </Link>

          {user && (

            <Link
              href="/dashboard"
              className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-300 transition hover:text-white"
            >

              Dashboard

            </Link>

          )}

        </nav>

        <div className="flex items-center gap-3">

          {user ? (

            <>

              <div className="relative">

                <button
                  onClick={() => {

                    setOpen(!open);

                    markAllAsRead();

                  }}
                  className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl transition hover:border-[#FF5A1F]/40 md:h-14 md:w-14 md:text-2xl"
                >

                  🔔

                  {unreadCount > 0 && (

                    <div className="absolute -right-1 -top-1 flex h-6 min-w-[24px] items-center justify-center rounded-full bg-[#FF5A1F] px-2 text-[10px] font-black text-white shadow-[0_0_20px_rgba(255,90,31,0.6)] md:h-7 md:min-w-[28px] md:text-xs">

                      {unreadCount}

                    </div>

                  )}

                </button>

                {open && (

                  <div className="absolute right-0 mt-4 w-[320px] overflow-hidden rounded-[32px] border border-white/10 bg-[#0A0A0A] shadow-2xl md:w-[420px]">

                    <div className="border-b border-white/10 p-6">

                      <h3 className="text-2xl font-black text-white">

                        Notifications

                      </h3>

                    </div>

                    <div className="max-h-[500px] overflow-y-auto p-4">

                      {notifications.length === 0 && (

                        <div className="rounded-2xl bg-white/5 p-6 text-zinc-400">

                          Aucune notification.

                        </div>

                      )}

                      <div className="space-y-3">

                        {notifications.map(
                          (notif) => (

                            <div
                              key={notif.id}
                              className={`rounded-2xl border p-5 transition ${
                                notif.read
                                  ? "border-white/10 bg-white/5"
                                  : "border-[#FF5A1F]/40 bg-[#FF5A1F]/10"
                              }`}
                            >

                              <p className="font-bold text-white">

                                {notif.title}

                              </p>

                              <p className="mt-2 text-sm text-zinc-400">

                                {new Date(
                                  notif.created_at
                                ).toLocaleString(
                                  "fr-FR"
                                )}

                              </p>

                            </div>

                          )
                        )}

                      </div>

                    </div>

                  </div>

                )}

              </div>

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
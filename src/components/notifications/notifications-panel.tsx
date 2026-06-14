"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

export default function NotificationsPanel() {

  const [notifications, setNotifications] =
    useState<any[]>([]);

  useEffect(() => {

    loadNotifications();

    const channel = supabase
      .channel("notifications-live")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        () => {
          loadNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };

  }, []);

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

    if (data) {
      setNotifications(data);
    }
  }

  async function markAsRead(
    id: string
  ) {

    await supabase
      .from("notifications")
      .update({
        read: true,
      })
      .eq("id", id);

    loadNotifications();
  }

  return (
    <section className="rounded-[40px] border border-white/10 bg-[#0A0A0A] p-8">

      <div className="mb-8 flex items-center justify-between">

        <div>

          <p className="text-sm uppercase tracking-[0.3em] text-[#FF5A1F]">

            Notifications

          </p>

          <h2 className="mt-4 text-4xl font-black">

            Activité

          </h2>

        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF5A1F]/10">

          <div className="h-3 w-3 animate-pulse rounded-full bg-[#FF5A1F]" />

        </div>

      </div>

      <div className="space-y-4">

        {notifications.length === 0 && (

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-zinc-400">

            Aucune notification.

          </div>

        )}

        {notifications.map((notif) => (

          <button
            key={notif.id}
            onClick={() =>
              markAsRead(notif.id)
            }
            className={`w-full rounded-3xl border p-5 text-left transition duration-300 ${
              notif.read
                ? "border-white/10 bg-white/5"
                : "border-[#FF5A1F]/40 bg-[#FF5A1F]/10 shadow-[0_0_40px_rgba(255,90,31,0.15)]"
            }`}
          >

            <div className="flex items-start justify-between gap-4">

              <div>

                <p className="text-lg font-bold text-white">

                  {notif.title}

                </p>

                <p className="mt-2 text-sm text-zinc-400">

                  {new Date(
                    notif.created_at
                  ).toLocaleString("fr-FR")}

                </p>

              </div>

              {!notif.read && (

                <div className="mt-1 h-3 w-3 rounded-full bg-[#FF5A1F]" />

              )}

            </div>

          </button>

        ))}

      </div>

    </section>
  );
}
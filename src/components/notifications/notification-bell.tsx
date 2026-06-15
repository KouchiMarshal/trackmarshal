"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadNotifications();

    const channel = supabase
      .channel("notif-bell")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, () => {
        loadNotifications();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function loadNotifications() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);
    setNotifications(data || []);
  }

  async function markAsRead(id: string) {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }

  async function markAllAsRead() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div ref={ref} className="relative">

      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] transition hover:bg-white/10"
      >
        <Bell size={20} className="text-zinc-400" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5A1F] text-[10px] font-black text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-14 z-50 w-[360px] overflow-hidden rounded-[28px] border border-white/10 bg-[#0A0A0A] shadow-2xl">

          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <div>
              <p className="font-black text-white">Notifications</p>
              {unread > 0 && (
                <p className="text-xs text-zinc-500">{unread} non lue{unread > 1 ? "s" : ""}</p>
              )}
            </div>
            {unread > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-semibold text-[#FF5A1F] transition hover:opacity-70"
              >
                Tout marquer lu
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-zinc-500">
                Aucune notification
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    if (!notif.read) markAsRead(notif.id);
                    setOpen(false);
                  }}
                  className={`relative cursor-pointer border-b border-white/5 px-6 py-4 transition last:border-0 hover:bg-white/5 ${
                    !notif.read ? "bg-[#FF5A1F]/5" : ""
                  }`}
                >
                  {!notif.read && (
                    <span className="absolute right-5 top-5 h-2 w-2 rounded-full bg-[#FF5A1F]" />
                  )}
                  {notif.link ? (
                    <Link href={notif.link} className="block">
                      <p className={`text-sm font-semibold ${notif.read ? "text-zinc-300" : "text-white"}`}>
                        {notif.title}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {new Date(notif.created_at).toLocaleString("fr-FR", {
                          day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                        })}
                      </p>
                    </Link>
                  ) : (
                    <>
                      <p className={`text-sm font-semibold ${notif.read ? "text-zinc-300" : "text-white"}`}>
                        {notif.title}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {new Date(notif.created_at).toLocaleString("fr-FR", {
                          day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                        })}
                      </p>
                    </>
                  )}
                </div>
              ))
            )}
          </div>

        </div>
      )}

    </div>
  );
}

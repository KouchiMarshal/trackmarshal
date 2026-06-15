"use client";

import {
  CalendarDays,
  FileBadge2,
  Home,
  LogOut,
  Plus,
  Settings,
} from "lucide-react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import NotificationBell from "@/components/notifications/notification-bell";

const navItems = [
  { icon: Home, label: "Dashboard", href: "/organizer/dashboard" },
  { icon: CalendarDays, label: "Mes événements", href: "/organizer/events" },
  { icon: FileBadge2, label: "Candidatures", href: "/organizer/applications" },
  { icon: Settings, label: "Paramètres", href: "/dashboard/settings" },
];

export default function OrganizerSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <>
      {/* Sidebar desktop */}
      <aside className="hidden h-screen w-[280px] shrink-0 sticky top-0 border-r border-white/10 bg-[#050505] lg:flex lg:flex-col overflow-y-auto">
        <div className="border-b border-white/10 p-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF5A1F]/10">
                <div className="h-4 w-4 rounded-full bg-[#FF5A1F]" />
              </div>
              <h1 className="text-2xl font-black">
                Track<span className="text-[#FF5A1F]">Marshal</span>
              </h1>
            </Link>
            <NotificationBell />
          </div>
        </div>

        <div className="flex-1 p-6">
          <nav className="space-y-3">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex h-14 w-full items-center gap-4 rounded-2xl px-5 transition ${
                    active
                      ? "bg-[#FF5A1F] text-white"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-semibold">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-white/10 p-6">
          <button
            onClick={logout}
            className="flex h-14 w-full items-center gap-4 rounded-2xl px-5 text-zinc-400 transition hover:bg-white/5 hover:text-white"
          >
            <LogOut size={20} />
            <span className="font-semibold">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Bottom nav mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/90 backdrop-blur-2xl lg:hidden">
        <div className="grid grid-cols-3">
          {[
            { icon: Home, label: "Dashboard", href: "/organizer/dashboard" },
            { icon: CalendarDays, label: "Événements", href: "/organizer/events" },
            { icon: Plus, label: "Créer", href: "/organizer/events/create" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-2 py-4 transition ${
                pathname === item.href ? "text-[#FF5A1F]" : "text-zinc-400 hover:text-[#FF5A1F]"
              }`}
            >
              <item.icon size={20} />
              <span className="text-xs font-semibold">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

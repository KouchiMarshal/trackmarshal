"use client";

import {
  CalendarDays,
  FileBadge2,
  Home,
  LogOut,
  MessageSquare,
  Plus,
  Settings,
  Users,
} from "lucide-react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";

const navItems = [
  { icon: Home, label: "Dashboard", href: "/organizer/dashboard" },
  { icon: CalendarDays, label: "Mes événements", href: "/organizer/events" },
  { icon: FileBadge2, label: "Candidatures", href: "/organizer/applications" },
  { icon: Users, label: "Annuaire commissaires", href: "/commissaires" },
  { icon: MessageSquare, label: "Messages", href: "/organizer/messages" },
  { icon: Settings, label: "Paramètres", href: "/organizer/settings" },
];

export default function OrganizerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const unread = useUnreadMessages();

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <>
      {/* Sidebar desktop */}
      <aside className="hidden h-screen w-[280px] shrink-0 sticky top-0 border-r border-zinc-200 bg-white lg:flex lg:flex-col overflow-y-auto">
        <div className="border-b border-zinc-200 p-8">
          <Link href="/" className="flex items-center gap-4">
            <img src="/logo.png" alt="TrackMarshal" className="h-12 w-12 rounded-full object-cover" />
            <h1 className="text-xl font-black text-zinc-900">
              Track<span className="text-[#FF5A1F]">Marshal</span>
            </h1>
          </Link>
        </div>

        <div className="flex-1 p-6">
          <nav className="space-y-3">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const isMessages = item.href === "/organizer/messages";
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex h-14 w-full items-center gap-4 rounded-2xl px-5 transition ${
                    active
                      ? "bg-[#FF5A1F] text-white"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                >
                  <div className="relative">
                    <item.icon size={20} />
                    {isMessages && unread > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF5A1F] text-[9px] font-black text-white">
                        {unread > 9 ? "9+" : unread}
                      </span>
                    )}
                  </div>
                  <span className="font-semibold">{item.label}</span>
                  {isMessages && unread > 0 && !active && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FF5A1F] px-1.5 text-[10px] font-black text-white">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-zinc-200 p-6">
          <button
            onClick={logout}
            className="flex h-14 w-full items-center gap-4 rounded-2xl px-5 text-zinc-500 transition hover:bg-red-50 hover:text-red-500"
          >
            <LogOut size={20} />
            <span className="font-semibold">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Bottom nav mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-white lg:hidden">
        <div className="grid grid-cols-6">

          {/* Logo → accueil */}
          <Link
            href="/"
            className="flex flex-col items-center gap-1.5 py-4 text-zinc-500 transition hover:text-[#FF5A1F]"
          >
            <img src="/logo.png" alt="Accueil" className="h-5 w-5 rounded-full object-cover" />
            <span className="text-[10px] font-semibold">Accueil</span>
          </Link>

          {[
            { icon: Home, label: "Dashboard", href: "/organizer/dashboard" },
            { icon: CalendarDays, label: "Events", href: "/organizer/events" },
            { icon: MessageSquare, label: "Messages", href: "/organizer/messages" },
            { icon: Plus, label: "Créer", href: "/organizer/events/create" },
            { icon: Settings, label: "Réglages", href: "/organizer/settings" },
          ].map((item) => {
            const isMessages = item.href === "/organizer/messages";
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1.5 py-4 transition ${
                  pathname === item.href ? "text-[#FF5A1F]" : "text-zinc-500 hover:text-[#FF5A1F]"
                }`}
              >
                <div className="relative">
                  <item.icon size={20} />
                  {isMessages && unread > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF5A1F] text-[9px] font-black text-white">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

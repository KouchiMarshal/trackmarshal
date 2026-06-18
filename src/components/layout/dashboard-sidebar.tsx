"use client";

import {
  CalendarDays,
  FileBadge2,
  Globe,
  Heart,
  Home,
  LogOut,
  MessageSquare,
  Settings,
  ShieldCheck,
  Trophy,
  User,
} from "lucide-react";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";

const navItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: CalendarDays, label: "Événements", href: "/dashboard/events" },
  { icon: FileBadge2, label: "Mes candidatures", href: "/dashboard/applications" },
  { icon: Trophy, label: "Mon historique", href: "/dashboard/history" },
  { icon: Heart, label: "Favoris", href: "/dashboard/favorites" },
  { icon: MessageSquare, label: "Messages", href: "/dashboard/messages" },
  { icon: User, label: "Mon profil", href: "/dashboard/profile" },
  { icon: Settings, label: "Paramètres", href: "/dashboard/settings" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const unread = useUnreadMessages();
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingLicenses, setPendingLicenses] = useState(0);

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email !== (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "foussardk@gmail.com")) return;
      setIsAdmin(true);

      const [{ count: licenseCount }, { count: orgCount }] = await Promise.all([
        supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("role", "marshal")
          .not("license_url", "is", null)
          .eq("license_verified", false),
        supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("role", "organizer")
          .eq("organizer_verified", false),
      ]);

      setPendingLicenses((licenseCount || 0) + (orgCount || 0));
    }
    checkAdmin();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <>
      {/* Sidebar desktop */}
      <aside className="hidden h-screen w-[280px] shrink-0 sticky top-0 border-r border-white/10 bg-[#050505] lg:flex lg:flex-col overflow-y-auto">
        <div className="border-b border-white/10 p-8">
          <Link href="/" className="flex items-center gap-4">
            <img src="/logo.png" alt="TrackMarshal" className="h-12 w-12 rounded-full object-cover" />
            <h1 className="text-xl font-black">
              Track<span className="text-[#FF5A1F]">Marshal</span>
            </h1>
          </Link>
        </div>

        <div className="flex-1 p-6">
          <nav className="space-y-3">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const isMessages = item.href === "/dashboard/messages";
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

        {isAdmin && (
          <div className="border-t border-white/10 p-6 pb-0">
            <Link
              href="/admin"
              className={`flex h-14 w-full items-center gap-4 rounded-2xl px-5 transition ${
                pathname.startsWith("/admin")
                  ? "bg-[#FF5A1F] text-white"
                  : "border border-[#FF5A1F]/20 bg-[#FF5A1F]/5 text-[#FF5A1F] hover:bg-[#FF5A1F]/10"
              }`}
            >
              <div className="relative">
                <ShieldCheck size={20} />
                {pendingLicenses > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400 text-[9px] font-black text-black">
                    {pendingLicenses > 9 ? "9+" : pendingLicenses}
                  </span>
                )}
              </div>
              <span className="font-semibold">Admin</span>
              {pendingLicenses > 0 && !pathname.startsWith("/admin") && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-yellow-400 px-1.5 text-[10px] font-black text-black">
                  {pendingLicenses > 9 ? "9+" : pendingLicenses}
                </span>
              )}
            </Link>
          </div>
        )}

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
        <div className="grid grid-cols-6">
          {[
            { icon: Home, label: "Dashboard", href: "/dashboard" },
            { icon: CalendarDays, label: "Events", href: "/dashboard/events" },
            { icon: MessageSquare, label: "Messages", href: "/dashboard/messages" },
            { icon: User, label: "Profil", href: "/dashboard/profile" },
            { icon: Settings, label: "Réglages", href: "/dashboard/settings" },
            { icon: Globe, label: "Accueil", href: "/" },
          ].map((item) => {
            const isMessages = item.href === "/dashboard/messages";
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-2 py-4 transition ${
                  pathname === item.href ? "text-[#FF5A1F]" : "text-zinc-400 hover:text-[#FF5A1F]"
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
                <span className="text-xs font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

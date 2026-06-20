"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { BarChart3, Building2, FileBadge2, Home, LogOut, Megaphone, MessageSquare, Users } from "lucide-react";

const navItems = [
  { icon: Home, label: "Tableau de bord", href: "/admin" },
  { icon: BarChart3, label: "Analytiques", href: "/admin/analytics" },
  { icon: FileBadge2, label: "Licences à valider", href: "/admin/licenses" },
  { icon: Users, label: "Tous les commissaires", href: "/admin/commissaires" },
  { icon: Building2, label: "Organisateurs", href: "/admin/organizers" },
  { icon: MessageSquare, label: "Messages", href: "/admin/messages" },
  { icon: Megaphone, label: "Email groupé", href: "/admin/broadcast" },
];

const mobileNavItems = [
  { icon: Home, label: "Accueil", href: "/admin" },
  { icon: BarChart3, label: "Stats", href: "/admin/analytics" },
  { icon: FileBadge2, label: "Licences", href: "/admin/licenses" },
  { icon: MessageSquare, label: "Messages", href: "/admin/messages" },
  { icon: Megaphone, label: "Broadcast", href: "/admin/broadcast" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login"); return; }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "admin") { router.replace("/"); return; }
      setChecking(false);
    }
    checkAdmin();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 text-zinc-900">
        <p className="text-zinc-500">Vérification des droits...</p>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 text-zinc-900">

      {/* Sidebar */}
      <aside className="hidden h-screen w-[280px] shrink-0 sticky top-0 flex-col border-r border-zinc-200 bg-white lg:flex overflow-y-auto">
        <div className="border-b border-zinc-200 p-8">
          <Link href="/" className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF5A1F]/10">
              <div className="h-4 w-4 rounded-full bg-[#FF5A1F]" />
            </div>
            <div>
              <h1 className="text-lg font-black text-zinc-900">Track<span className="text-[#FF5A1F]">Marshal</span></h1>
              <p className="text-xs text-zinc-500 uppercase tracking-widest">Admin</p>
            </div>
          </Link>
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
                    active ? "bg-[#FF5A1F] text-white" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-semibold">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-zinc-200 p-6">
          <button
            onClick={logout}
            className="flex h-14 w-full items-center gap-4 rounded-2xl px-5 text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
          >
            <LogOut size={20} />
            <span className="font-semibold">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {children}
      </div>

      {/* Bottom nav mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-white lg:hidden">
        <div className="grid grid-cols-5">
          {mobileNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1.5 py-3 text-center transition ${
                pathname === item.href ? "text-[#FF5A1F]" : "text-zinc-500 hover:text-[#FF5A1F]"
              }`}
            >
              <item.icon size={20} />
              <span className="text-[10px] font-semibold leading-none">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}

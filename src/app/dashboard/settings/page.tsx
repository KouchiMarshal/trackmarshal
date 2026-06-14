"use client";

import {
  Bell,
  CalendarDays,
  FileBadge2,
  Home,
  LogOut,
  MessageSquare,
  Save,
  Settings,
  Shield,
  Trash2,
  User,
} from "lucide-react";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function SettingsPage() {

  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [notifications, setNotifications] =
    useState(true);

  useEffect(() => {

    loadUser();

  }, []);

  async function loadUser() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {

      router.push("/login");

      return;
    }

    setEmail(user.email || "");
  }

  async function updatePassword() {

    if (!password) return;

    const { error } =
      await supabase.auth.updateUser({
        password,
      });

    if (error) {

      alert(error.message);

      return;
    }

    alert("Mot de passe mis à jour");

    setPassword("");
  }

  async function logout() {

    await supabase.auth.signOut();

    router.push("/");
  }

  async function deleteAccount() {

    const confirmDelete =
      confirm(
        "Supprimer définitivement votre compte ?"
      );

    if (!confirmDelete) return;

    alert(
      "La suppression automatique sera ajoutée côté admin."
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <div className="flex min-h-screen">

        <aside className="hidden w-[280px] border-r border-white/10 bg-[#050505] lg:flex lg:flex-col">

          <div className="border-b border-white/10 p-8">

            <Link
              href="/"
              className="flex items-center gap-4"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF5A1F]/10">

                <div className="h-4 w-4 rounded-full bg-[#FF5A1F]" />

              </div>

              <h1 className="text-3xl font-black">

                Track
                <span className="text-[#FF5A1F]">

                  Marshal

                </span>

              </h1>

            </Link>

          </div>

          <div className="flex-1 p-6">

            <nav className="space-y-3">

              {[
                {
                  icon: Home,
                  label: "Dashboard",
                  href: "/dashboard",
                },
                {
                  icon: CalendarDays,
                  label: "Événements",
                  href: "/dashboard/events",
                },
                {
                  icon: FileBadge2,
                  label: "Mes candidatures",
                  href: "/dashboard/applications",
                },
                {
                  icon: MessageSquare,
                  label: "Messages",
                  href: "/dashboard/messages",
                },
                {
                  icon: User,
                  label: "Mon profil",
                  href: "/dashboard/profile",
                },
                {
                  icon: Settings,
                  label: "Paramètres",
                  href: "/dashboard/settings",
                  active: true,
                },
              ].map((item) => (

                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex h-14 items-center gap-4 rounded-2xl px-5 transition ${
                    item.active
                      ? "bg-[#FF5A1F] text-white"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >

                  <item.icon size={20} />

                  <span className="font-semibold">

                    {item.label}

                  </span>

                </Link>

              ))}

            </nav>

          </div>

          <div className="border-t border-white/10 p-6">

            <button
              onClick={logout}
              className="flex h-14 w-full items-center gap-4 rounded-2xl px-5 text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >

              <LogOut size={20} />

              <span className="font-semibold">

                Déconnexion

              </span>

            </button>

          </div>

        </aside>

        <div className="flex-1">

          <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur-2xl">

            <div className="mx-auto flex h-20 max-w-[1600px] items-center px-4 sm:px-6 lg:px-10">

              <div>

                <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">

                  Dashboard Commissaire

                </p>

                <h1 className="mt-2 text-2xl font-black lg:text-4xl">

                  Paramètres

                </h1>

              </div>

            </div>

          </header>

          <div className="relative overflow-hidden">

            <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-[#FF5A1F]/10 blur-[140px]" />

            <div className="relative z-10 mx-auto max-w-[1200px] space-y-6 p-4 sm:p-6 lg:p-10">

              <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:p-8">

                <div className="flex items-center gap-4">

                  <Shield
                    size={28}
                    className="text-[#FF5A1F]"
                  />

                  <div>

                    <h2 className="text-3xl font-black">

                      Sécurité

                    </h2>

                    <p className="mt-2 text-zinc-400">

                      Gérez vos informations de connexion.

                    </p>

                  </div>

                </div>

                <div className="mt-10 space-y-6">

                  <div>

                    <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">

                      Adresse Email

                    </p>

                    <input
                      disabled
                      value={email}
                      className="h-14 w-full rounded-2xl border border-white/10 bg-black/40 px-5 text-zinc-500 outline-none"
                    />

                  </div>

                  <div>

                    <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">

                      Nouveau mot de passe

                    </p>

                    <input
                      type="password"
                      value={password}
                      onChange={(e) =>
                        setPassword(
                          e.target.value
                        )
                      }
                      className="h-14 w-full rounded-2xl border border-white/10 bg-black/40 px-5 outline-none focus:border-[#FF5A1F]"
                      placeholder="••••••••"
                    />

                  </div>

                  <button
                    onClick={updatePassword}
                    className="flex h-14 items-center gap-3 rounded-2xl bg-[#FF5A1F] px-8 font-bold transition hover:scale-[1.01]"
                  >

                    <Save size={18} />

                    Sauvegarder

                  </button>

                </div>

              </div>

              <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:p-8">

                <div className="flex items-center gap-4">

                  <Bell
                    size={28}
                    className="text-[#FF5A1F]"
                  />

                  <div>

                    <h2 className="text-3xl font-black">

                      Notifications

                    </h2>

                    <p className="mt-2 text-zinc-400">

                      Configurez vos préférences.

                    </p>

                  </div>

                </div>

                <div className="mt-10 flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-5">

                  <div>

                    <h3 className="text-lg font-bold">

                      Notifications email

                    </h3>

                    <p className="mt-2 text-sm text-zinc-500">

                      Recevoir les mises à jour des événements.

                    </p>

                  </div>

                  <button
                    onClick={() =>
                      setNotifications(
                        !notifications
                      )
                    }
                    className={`relative h-8 w-16 rounded-full transition ${
                      notifications
                        ? "bg-[#FF5A1F]"
                        : "bg-zinc-700"
                    }`}
                  >

                    <div
                      className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${
                        notifications
                          ? "left-9"
                          : "left-1"
                      }`}
                    />

                  </button>

                </div>

              </div>

              <div className="rounded-[32px] border border-red-500/20 bg-red-500/5 p-6 backdrop-blur-xl lg:p-8">

                <div className="flex items-center gap-4">

                  <Trash2
                    size={28}
                    className="text-red-400"
                  />

                  <div>

                    <h2 className="text-3xl font-black text-red-400">

                      Zone dangereuse

                    </h2>

                    <p className="mt-2 text-zinc-400">

                      Actions irréversibles liées à votre compte.

                    </p>

                  </div>

                </div>

                <button
                  onClick={deleteAccount}
                  className="mt-10 flex h-14 items-center gap-3 rounded-2xl bg-red-500 px-8 font-bold transition hover:scale-[1.01]"
                >

                  <Trash2 size={18} />

                  Supprimer mon compte

                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/90 backdrop-blur-2xl lg:hidden">

        <div className="grid grid-cols-4">

          {[
            {
              icon: Home,
              label: "Accueil",
              href: "/dashboard",
            },
            {
              icon: CalendarDays,
              label: "Events",
              href: "/dashboard/events",
            },
            {
              icon: MessageSquare,
              label: "Messages",
              href: "/dashboard/messages",
            },
            {
              icon: User,
              label: "Profil",
              href: "/dashboard/profile",
            },
          ].map((item) => (

            <Link
              href={item.href}
              key={item.label}
              className="flex flex-col items-center gap-2 py-4 text-zinc-400 transition hover:text-[#FF5A1F]"
            >

              <item.icon size={20} />

              <span className="text-xs font-semibold">

                {item.label}

              </span>

            </Link>

          ))}

        </div>

      </div>

    </main>
  );
}
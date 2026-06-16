"use client";

import { Bell, LogOut, Save, Shield, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import OrganizerSidebar from "@/components/layout/organizer-sidebar";
import NotificationBell from "@/components/notifications/notification-bell";
import { Toast, type ToastData } from "@/components/ui/toast";

export default function OrganizerSettingsPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [toast, setToast] = useState<ToastData>(null);
  const [updatingEmail, setUpdatingEmail] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    setEmail(user.email || "");
    const { data: profile } = await supabase
      .from("profiles")
      .select("notifications_enabled")
      .eq("id", user.id)
      .single();
    if (profile && typeof profile.notifications_enabled === "boolean") {
      setNotifications(profile.notifications_enabled);
    }
  }

  async function saveNotifications(value: boolean) {
    setNotifications(value);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("profiles").update({ notifications_enabled: value }).eq("id", user.id);
    setToast({ message: value ? "Notifications activées." : "Notifications désactivées.", type: "success" });
  }

  async function updatePassword() {
    if (!password) return;
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setToast({ message: error.message, type: "error" }); return; }
    setToast({ message: "Mot de passe mis à jour !", type: "success" });
    setPassword("");
  }

  async function updateEmail() {
    if (!email) return;
    setUpdatingEmail(true);
    const { error } = await supabase.auth.updateUser({ email }, { emailRedirectTo: window.location.origin });
    if (error) { setToast({ message: error.message, type: "error" }); setUpdatingEmail(false); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await supabase.from("profiles").update({ email }).eq("id", user.id);
    setToast({ message: "Email mis à jour. Vérifiez votre boîte mail.", type: "success" });
    setUpdatingEmail(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  async function deleteAccount() {
    const confirmed = confirm("Supprimer définitivement votre compte ?");
    if (!confirmed) return;
    setToast({ message: "La suppression de compte sera disponible prochainement.", type: "error" });
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="flex min-h-screen">

        <OrganizerSidebar />

        <div className="flex-1">

          <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur-2xl">
            <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-10">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Dashboard Organisateur</p>
                <h1 className="mt-2 text-2xl font-black lg:text-4xl">Paramètres</h1>
              </div>
              <NotificationBell />
            </div>
          </header>

          <div className="relative overflow-hidden">
            <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-[#FF5A1F]/10 blur-[140px]" />

            <div className="relative z-10 mx-auto max-w-[1200px] space-y-6 p-4 pb-24 sm:p-6 lg:p-10 lg:pb-10">

              <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:p-8">
                <div className="flex items-center gap-4">
                  <Shield size={28} className="text-[#FF5A1F]" />
                  <div>
                    <h2 className="text-3xl font-black">Sécurité</h2>
                    <p className="mt-2 text-zinc-400">Gérez vos informations de connexion.</p>
                  </div>
                </div>

                <div className="mt-10 space-y-6">
                  <div>
                    <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">Adresse Email</p>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-14 w-full rounded-2xl border border-white/10 bg-black/40 px-5 outline-none focus:border-[#FF5A1F]"
                    />
                    <button
                      onClick={updateEmail}
                      disabled={updatingEmail}
                      className="mt-3 flex h-12 items-center gap-3 rounded-2xl bg-zinc-800 px-6 text-sm font-bold transition hover:bg-zinc-700 disabled:opacity-50"
                    >
                      <Save size={16} />
                      {updatingEmail ? "Mise à jour..." : "Mettre à jour l'email"}
                    </button>
                  </div>
                  <div>
                    <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">Nouveau mot de passe</p>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                  <Bell size={28} className="text-[#FF5A1F]" />
                  <div>
                    <h2 className="text-3xl font-black">Notifications</h2>
                    <p className="mt-2 text-zinc-400">Configurez vos préférences.</p>
                  </div>
                </div>

                <div className="mt-10 flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-5">
                  <div>
                    <h3 className="text-lg font-bold">Notifications email</h3>
                    <p className="mt-2 text-sm text-zinc-500">Recevoir les mises à jour des événements.</p>
                  </div>
                  <button
                    onClick={() => saveNotifications(!notifications)}
                    className={`relative h-8 w-16 rounded-full transition ${notifications ? "bg-[#FF5A1F]" : "bg-zinc-700"}`}
                  >
                    <div className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${notifications ? "left-9" : "left-1"}`} />
                  </button>
                </div>
              </div>

              <button
                onClick={logout}
                className="flex w-full items-center gap-4 rounded-[32px] border border-white/10 bg-white/[0.03] p-6 font-bold text-zinc-400 transition hover:bg-white/[0.06] hover:text-white lg:hidden"
              >
                <LogOut size={22} />
                Se déconnecter
              </button>

              <div className="rounded-[32px] border border-red-500/20 bg-red-500/5 p-6 backdrop-blur-xl lg:p-8">
                <div className="flex items-center gap-4">
                  <Trash2 size={28} className="text-red-400" />
                  <div>
                    <h2 className="text-3xl font-black text-red-400">Zone dangereuse</h2>
                    <p className="mt-2 text-zinc-400">Actions irréversibles liées à votre compte.</p>
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

    </main>
  );
}

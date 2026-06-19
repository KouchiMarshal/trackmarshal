"use client";

import {
  Bell,
  Download,
  LogOut,
  Save,
  Shield,
  Trash2,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";
import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import NotificationBell from "@/components/notifications/notification-bell";
import { Toast, type ToastData } from "@/components/ui/toast";

export default function SettingsPage() {

  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [notifications, setNotifications] =
    useState(true);

  const [emailPrefs, setEmailPrefs] = useState({
    email_on_application_accepted: true,
    email_on_application_rejected: true,
    email_on_new_message: true,
    email_on_license_validated: true,
  });

  const [toast, setToast] =
    useState<ToastData>(null);

  const [deletingAccount, setDeletingAccount] = useState(false);
  const [exportingData, setExportingData] = useState(false);

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

    const { data: profile } = await supabase
      .from("profiles")
      .select("notifications_enabled")
      .eq("id", user.id)
      .single();

    if (profile && typeof profile.notifications_enabled === "boolean") {
      setNotifications(profile.notifications_enabled);
    }
    if (profile?.email_preferences) {
      setEmailPrefs((prev) => ({ ...prev, ...profile.email_preferences }));
    }
  }

  async function saveNotifications(value: boolean) {
    setNotifications(value);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("profiles").update({ notifications_enabled: value }).eq("id", user.id);
    setToast({ message: value ? "Notifications activées." : "Notifications désactivées.", type: "success" });
  }

  async function toggleEmailPref(key: keyof typeof emailPrefs) {
    const next = { ...emailPrefs, [key]: !emailPrefs[key] };
    setEmailPrefs(next);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("profiles").update({ email_preferences: next }).eq("id", user.id);
    setToast({ message: "Préférences emails mises à jour.", type: "success" });
  }

  async function updateEmail() {
    if (!email) return;
    const { error } = await supabase.auth.updateUser({ email }, { emailRedirectTo: `${window.location.origin}/auth/confirm` });
    if (error) {
      setToast({ message: error.message, type: "error" });
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await supabase.from("profiles").update({ email }).eq("id", user.id);
    setToast({ message: "Un email de confirmation a été envoyé à votre nouvelle adresse.", type: "success" });
  }

  async function updatePassword() {

    if (!password) return;

    const { error } =
      await supabase.auth.updateUser({
        password,
      });

    if (error) {
      setToast({ message: error.message, type: "error" });
      return;
    }

    setToast({ message: "Mot de passe mis à jour !", type: "success" });

    setPassword("");
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  async function exportData() {
    setExportingData(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const res = await fetch("/api/account/export", {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (!res.ok) { setToast({ message: "Erreur lors de l'export.", type: "error" }); setExportingData(false); return; }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trackmarshal-mes-donnees-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportingData(false);
    setToast({ message: "Vos données ont été téléchargées.", type: "success" });
  }

  async function deleteAccount() {
    const confirmed = confirm(
      "Supprimer définitivement votre compte ? Cette action est irréversible. Toutes vos données seront effacées."
    );
    if (!confirmed) return;

    setDeletingAccount(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const res = await fetch("/api/account/delete", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    if (!res.ok) {
      setToast({ message: "Erreur lors de la suppression. Contactez le support.", type: "error" });
      setDeletingAccount(false);
      return;
    }

    await supabase.auth.signOut();
    router.push("/?compte=supprime");
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">

      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="flex min-h-screen">

        <DashboardSidebar />

        <div className="flex-1">

          <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white">

            <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-10">

              <div>

                <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">

                  Dashboard Commissaire

                </p>

                <h1 className="mt-2 text-2xl font-black text-zinc-900 lg:text-4xl">

                  Paramètres

                </h1>

              </div>

              <NotificationBell />

            </div>

          </header>

          <div className="relative overflow-hidden">

            <div className="relative z-10 mx-auto max-w-[1200px] space-y-6 p-4 pb-24 sm:p-6 lg:p-10 lg:pb-10">

              <div className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm lg:p-8">

                <div className="flex items-center gap-4">

                  <Shield
                    size={28}
                    className="text-[#FF5A1F]"
                  />

                  <div>

                    <h2 className="text-3xl font-black text-zinc-900">

                      Sécurité

                    </h2>

                    <p className="mt-2 text-zinc-500">

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
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-14 w-full rounded-2xl border border-zinc-300 bg-zinc-50 px-5 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#FF5A1F]"
                    />

                    <p className="mt-2 text-xs text-zinc-400">
                      Un email de confirmation sera envoyé à la nouvelle adresse.
                    </p>

                    <button
                      onClick={updateEmail}
                      className="mt-4 flex h-12 items-center gap-3 rounded-2xl bg-[#FF5A1F] px-6 font-bold text-white transition hover:scale-[1.01]"
                    >
                      <Save size={16} />
                      Mettre à jour l'email
                    </button>

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
                      className="h-14 w-full rounded-2xl border border-zinc-300 bg-zinc-50 px-5 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#FF5A1F]"
                      placeholder="••••••••"
                    />

                  </div>

                  <button
                    onClick={updatePassword}
                    className="flex h-14 items-center gap-3 rounded-2xl bg-[#FF5A1F] px-8 font-bold text-white transition hover:scale-[1.01]"
                  >

                    <Save size={18} />

                    Sauvegarder

                  </button>

                </div>

              </div>

              <div className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm lg:p-8">

                <div className="flex items-center gap-4">

                  <Bell
                    size={28}
                    className="text-[#FF5A1F]"
                  />

                  <div>

                    <h2 className="text-3xl font-black text-zinc-900">

                      Notifications

                    </h2>

                    <p className="mt-2 text-zinc-500">

                      Configurez vos préférences.

                    </p>

                  </div>

                </div>

                <div className="mt-10 flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 p-5">

                  <div>

                    <h3 className="text-lg font-bold text-zinc-900">

                      Notifications email

                    </h3>

                    <p className="mt-2 text-sm text-zinc-500">

                      Recevoir les mises à jour des événements.

                    </p>

                  </div>

                  <button
                    onClick={() =>
                      saveNotifications(!notifications)
                    }
                    className={`relative h-8 w-16 rounded-full transition ${
                      notifications
                        ? "bg-[#FF5A1F]"
                        : "bg-zinc-300"
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

              <div className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm lg:p-8">
                <div className="flex items-center gap-4">
                  <Bell size={28} className="text-[#FF5A1F]" />
                  <div>
                    <h2 className="text-3xl font-black text-zinc-900">Préférences emails</h2>
                    <p className="mt-2 text-zinc-500">Choisissez quels emails vous souhaitez recevoir.</p>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  {([
                    { key: "email_on_application_accepted", label: "Candidature acceptée", desc: "Recevoir un email quand votre candidature est acceptée" },
                    { key: "email_on_application_rejected", label: "Candidature refusée", desc: "Recevoir un email quand votre candidature n'est pas retenue" },
                    { key: "email_on_new_message", label: "Nouveau message", desc: "Recevoir un email lors d'un nouveau message" },
                    { key: "email_on_license_validated", label: "Licence validée", desc: "Recevoir un email lors de la validation de votre licence" },
                  ] as { key: keyof typeof emailPrefs; label: string; desc: string }[]).map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                      <div>
                        <h3 className="font-bold text-zinc-900">{label}</h3>
                        <p className="mt-1 text-sm text-zinc-500">{desc}</p>
                      </div>
                      <button
                        onClick={() => toggleEmailPref(key)}
                        className={`relative h-8 w-16 shrink-0 rounded-full transition ${emailPrefs[key] ? "bg-[#FF5A1F]" : "bg-zinc-300"}`}
                      >
                        <div className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-all ${emailPrefs[key] ? "left-9" : "left-1"}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm lg:p-8 lg:hidden">
                <button
                  onClick={logout}
                  className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-zinc-200 font-bold text-zinc-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                >
                  <LogOut size={18} />
                  Se déconnecter
                </button>
              </div>

              <div className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm lg:p-8">
                <div className="flex items-center gap-4">
                  <Shield size={28} className="text-[#FF5A1F]" />
                  <div>
                    <h2 className="text-3xl font-black text-zinc-900">Mes données (RGPD)</h2>
                    <p className="mt-2 text-zinc-500">Exercez vos droits conformément au RGPD.</p>
                  </div>
                </div>
                <div className="mt-8 space-y-4">
                  <div className="flex items-start justify-between gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                    <div>
                      <h3 className="font-bold text-zinc-900">Télécharger mes données</h3>
                      <p className="mt-1 text-sm text-zinc-500">Exportez toutes vos données personnelles au format JSON (droit à la portabilité — Art. 20 RGPD).</p>
                    </div>
                    <button
                      onClick={exportData}
                      disabled={exportingData}
                      className="flex shrink-0 h-12 items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-100 px-6 text-sm font-bold text-zinc-700 transition hover:bg-zinc-200 disabled:opacity-50"
                    >
                      <Download size={16} />
                      {exportingData ? "Export..." : "Télécharger"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-[32px] border border-red-200 bg-red-50 p-6 lg:p-8">
                <div className="flex items-center gap-4">
                  <Trash2 size={28} className="text-red-500" />
                  <div>
                    <h2 className="text-3xl font-black text-red-600">Zone dangereuse</h2>
                    <p className="mt-2 text-zinc-600">Actions irréversibles liées à votre compte.</p>
                  </div>
                </div>
                <p className="mt-6 text-sm text-zinc-500">La suppression efface définitivement votre profil, vos candidatures, vos messages et toutes vos données personnelles (droit à l'effacement — Art. 17 RGPD).</p>
                <button
                  onClick={deleteAccount}
                  disabled={deletingAccount}
                  className="mt-6 flex h-14 items-center gap-3 rounded-2xl bg-red-500 px-8 font-bold text-white transition hover:scale-[1.01] disabled:opacity-50"
                >
                  <Trash2 size={18} />
                  {deletingAccount ? "Suppression..." : "Supprimer mon compte"}
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}

"use client";

import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import NotificationBell from "@/components/notifications/notification-bell";
import MarshalProfileForm from "@/components/dashboard/marshal-profile-form";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1">
          <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white">
            <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-10">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Dashboard Commissaire</p>
                <h1 className="mt-2 text-2xl font-black text-zinc-900 lg:text-4xl">Modifier mon profil</h1>
              </div>
              <NotificationBell />
            </div>
          </header>

          <div className="mx-auto max-w-[1600px] p-4 pb-24 sm:p-6 lg:p-10 lg:pb-10">
            <MarshalProfileForm />
          </div>
        </div>
      </div>
    </main>
  );
}

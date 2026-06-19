"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";

export default function ApprendreLayout({ children }: { children: React.ReactNode }) {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "foussardk@gmail.com";

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setAllowed(user?.email === adminEmail);
    });
  }, []);

  if (allowed === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <p className="text-zinc-500">Chargement...</p>
      </main>
    );
  }

  if (!allowed) {
    return (
      <main className="flex min-h-screen flex-col bg-[#050505] text-white">
        <PublicNavbar />
        <div className="flex flex-1 items-center justify-center px-6">
          <div className="text-center">
            <p className="text-7xl">🏁</p>
            <h1 className="mt-8 text-4xl font-black lg:text-6xl">Bientôt disponible</h1>
            <p className="mt-4 max-w-md text-lg text-zinc-400">
              Cette section pédagogique est en cours de développement. Revenez bientôt !
            </p>
          </div>
        </div>
        <PublicFooter />
      </main>
    );
  }

  return <>{children}</>;
}

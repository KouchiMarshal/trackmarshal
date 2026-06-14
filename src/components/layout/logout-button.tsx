"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LogoutButton() {

  const router = useRouter();

  async function handleLogout() {

    await supabase.auth.signOut();

    router.push("/");

    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500 hover:text-white"
    >
      Logout
    </button>
  );
}
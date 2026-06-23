"use client";

import { useSearchParams } from "next/navigation";
import { PartyPopper } from "lucide-react";

export default function InviteBanner() {
  const params = useSearchParams();
  if (params.get("invite") !== "1") return null;

  return (
    <div className="mb-8 flex items-center gap-4 rounded-[20px] border border-[#FF5A1F]/30 bg-[#FF5A1F]/10 px-5 py-4 sm:px-6 sm:py-5">
      <PartyPopper size={20} className="shrink-0 text-[#FF5A1F]" />
      <p className="text-sm font-semibold text-zinc-800">
        Vous avez été invité par l'organisateur à rejoindre cet événement.{" "}
        <span className="text-[#FF5A1F]">Postulez ci-dessous !</span>
      </p>
    </div>
  );
}

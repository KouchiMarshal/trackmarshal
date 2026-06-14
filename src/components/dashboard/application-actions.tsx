"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type ApplicationActionsProps = {
  applicationId: string;
};

export default function ApplicationActions({
  applicationId,
}: ApplicationActionsProps) {

  const router = useRouter();

  async function updateStatus(
    status: string
  ) {

    const { error } = await supabase
      .from("applications")
      .update({
        status,
      })
      .eq("id", applicationId);

    if (error) {
      alert(error.message);
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex gap-3">

      <button
        onClick={() => updateStatus("accepted")}
        className="rounded-xl bg-green-500/20 px-5 py-3 font-medium text-green-400 transition hover:bg-green-500 hover:text-white"
      >
        Accept
      </button>

      <button
        onClick={() => updateStatus("rejected")}
        className="rounded-xl bg-red-500/20 px-5 py-3 font-medium text-red-400 transition hover:bg-red-500 hover:text-white"
      >
        Reject
      </button>

    </div>
  );
}
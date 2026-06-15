"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useUnreadMessages() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let uid: string | null = null;

    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      uid = user.id;
      await load(user.id);
    }

    async function load(userId: string) {
      const { data: members } = await supabase
        .from("conversation_members")
        .select("conversation_id, last_read_at")
        .eq("user_id", userId);

      if (!members || members.length === 0) { setUnreadCount(0); return; }

      let total = 0;
      await Promise.all(members.map(async (m: any) => {
        let q = supabase
          .from("messages")
          .select("id", { count: "exact", head: true })
          .eq("conversation_id", m.conversation_id)
          .neq("sender_id", userId);

        if (m.last_read_at) q = q.gt("created_at", m.last_read_at);

        const { count } = await q;
        total += count || 0;
      }));

      setUnreadCount(total);
    }

    init();

    const channel = supabase
      .channel("global-unread")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, () => {
        if (uid) load(uid);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return unreadCount;
}

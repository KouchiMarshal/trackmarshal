"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function ConversationsList() {

  const router = useRouter();

  const searchParams =
    useSearchParams();

  const activeConversation =
    searchParams.get("message");

  const [conversations, setConversations] =
    useState<any[]>([]);

  useEffect(() => {

    loadConversations();

    const channel = supabase
      .channel("conversations-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => {
          loadConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };

  }, [activeConversation]);

  async function loadConversations() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: messages } =
      await supabase
        .from("messages")
        .select("*")
        .or(
          `sender_id.eq.${user.id},receiver_id.eq.${user.id}`
        )
        .order("created_at", {
          ascending: false,
        });

    if (!messages) return;

    const uniqueUsers = new Map();

    for (const msg of messages) {

      const otherUserId =
        msg.sender_id === user.id
          ? msg.receiver_id
          : msg.sender_id;

      if (!uniqueUsers.has(otherUserId)) {

        uniqueUsers.set(otherUserId, {
          ...msg,
          unread:
            msg.receiver_id ===
              user.id &&
            !msg.read,
        });

      }
    }

    const usersIds = Array.from(
      uniqueUsers.keys()
    );

    const { data: profiles } =
      await supabase
        .from("profiles")
        .select("*")
        .in("id", usersIds);

    const finalConversations =
      profiles?.map((profile) => {

        const lastMessage =
          uniqueUsers.get(profile.id);

        return {
          profile,
          lastMessage,
        };

      }) || [];

    setConversations(
      finalConversations
    );
  }

  async function openConversation(
    profileId: string
  ) {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
      .from("messages")
      .update({
        read: true,
      })
      .eq("sender_id", profileId)
      .eq("receiver_id", user.id)
      .eq("read", false);

    router.push(
      `/dashboard?message=${profileId}`
    );

    loadConversations();
  }

  return (
    <section className="rounded-[40px] border border-white/10 bg-[#0A0A0A] p-8">

      <div className="mb-8 flex items-center justify-between">

        <div>

          <p className="text-sm uppercase tracking-[0.3em] text-[#FF5A1F]">

            Conversations

          </p>

          <h2 className="mt-4 text-4xl font-black">

            Messages

          </h2>

        </div>

      </div>

      <div className="space-y-4">

        {conversations.length === 0 && (

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-zinc-400">

            Aucune conversation.

          </div>

        )}

        {conversations.map(
          (conversation) => {

            const isActive =
              activeConversation ===
              conversation.profile.id;

            return (

              <button
                key={
                  conversation.profile.id
                }
                onClick={() =>
                  openConversation(
                    conversation.profile.id
                  )
                }
                className={`relative flex w-full items-center gap-4 rounded-3xl border p-4 text-left transition duration-300 ${
                  isActive
                    ? "border-[#FF5A1F] bg-[#FF5A1F]/10 shadow-[0_0_40px_rgba(255,90,31,0.15)]"
                    : "border-white/10 bg-white/5 hover:border-[#FF5A1F]/40 hover:bg-white/10"
                }`}
              >

                {conversation
                  .lastMessage
                  .unread && (

                  <div className="absolute right-4 top-4 flex h-4 w-4">

                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF5A1F] opacity-75" />

                    <span className="relative inline-flex h-4 w-4 rounded-full bg-[#FF5A1F]" />

                  </div>

                )}

                <img
                  src={
                    conversation.profile
                      .avatar_url ||
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop"
                  }
                  alt={
                    conversation.profile
                      .full_name
                  }
                  className="h-16 w-16 rounded-2xl object-cover"
                />

                <div className="min-w-0 flex-1">

                  <p className="truncate text-lg font-bold text-white">

                    {
                      conversation.profile
                        .full_name
                    }

                  </p>

                  <p className="mt-1 truncate text-sm text-zinc-400">

                    {
                      conversation
                        .lastMessage
                        .message
                    }

                  </p>

                </div>

              </button>

            );
          }
        )}

      </div>

    </section>
  );
}
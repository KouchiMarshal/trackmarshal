"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import { supabase } from "@/lib/supabase";

type MessagesPanelProps = {
  receiverId?: string;
};

export default function MessagesPanel({
  receiverId,
}: MessagesPanelProps) {

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [currentUser, setCurrentUser] =
    useState<any>(null);

  useEffect(() => {

    initialize();

  }, [receiverId]);

  useEffect(() => {

    const channel = supabase
      .channel(
        `messages-${receiverId}`
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        async (payload) => {

          const newMessage =
            payload.new as any;

          if (
            newMessage.sender_id !==
            currentUser?.id
          ) {

            const {
              data: senderProfile,
            } = await supabase
              .from("profiles")
              .select("full_name")
              .eq(
                "id",
                newMessage.sender_id
              )
              .single();

            toast.success(
              `${
                senderProfile?.full_name ||
                "Utilisateur"
              } vous a envoyé un message`
            );

          }

          initialize();

        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };

  }, [receiverId, currentUser]);

  async function initialize() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setCurrentUser(user);

    loadMessages(user.id);
  }

  async function loadMessages(
    userId: string
  ) {

    if (!receiverId) return;

    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${userId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${userId})`
      )
      .order("created_at", {
        ascending: true,
      });

    if (data) {
      setMessages(data);
    }
  }

  async function sendMessage() {

    if (!message || !receiverId)
      return;

    setLoading(true);

    const { error } = await supabase
      .from("messages")
      .insert([
        {
          sender_id: currentUser.id,
          receiver_id: receiverId,
          message,
        },
      ]);

    if (error) {

      alert(error.message);

      setLoading(false);

      return;
    }

    const {
      data: profile,
    } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", currentUser.id)
      .single();

    await supabase
      .from("notifications")
      .insert({
        user_id: receiverId,
        title: `${
          profile?.full_name ||
          "Utilisateur"
        } vous a envoyé un message`,
        type: "message",
        link: "/dashboard",
      });

    setLoading(false);

    setMessage("");
  }

  if (!receiverId) {

    return (
      <section className="rounded-[40px] border border-white/10 bg-[#0A0A0A] p-10">

        <div className="text-center">

          <p className="text-3xl font-black text-white">

            Sélectionnez une conversation

          </p>

        </div>

      </section>
    );
  }

  return (
    <section className="rounded-[40px] border border-white/10 bg-[#0A0A0A] p-10">

      <div>

        <p className="text-sm uppercase tracking-[0.3em] text-[#FF5A1F]">

          Messagerie

        </p>

        <h2 className="mt-4 text-5xl font-black">

          Conversation Privée

        </h2>

      </div>

      <div className="mt-10 space-y-4">

        {messages.length === 0 && (

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-zinc-400">

            Aucun message.

          </div>

        )}

        {messages.map((msg) => {

          const isMine =
            msg.sender_id ===
            currentUser?.id;

          return (

            <div
              key={msg.id}
              className={`flex ${
                isMine
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              <div
                className={`max-w-[70%] rounded-3xl px-6 py-4 ${
                  isMine
                    ? "bg-[#FF5A1F] text-white"
                    : "bg-white/5 text-white"
                }`}
              >

                <p className="text-lg">

                  {msg.message}

                </p>

              </div>

            </div>

          );
        })}

      </div>

      <div className="mt-10 flex gap-4">

        <input
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          placeholder="Écrire un message..."
          className="h-16 flex-1 rounded-2xl border border-white/10 bg-white/5 px-6 text-white outline-none"
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="rounded-2xl bg-[#FF5A1F] px-8 font-bold transition hover:scale-105"
        >

          {loading
            ? "Envoi..."
            : "Envoyer"}

        </button>

      </div>

    </section>
  );
}
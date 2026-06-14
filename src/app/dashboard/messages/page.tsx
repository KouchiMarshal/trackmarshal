"use client";

import {
  CalendarDays,
  FileBadge2,
  Home,
  MessageSquare,
  Send,
  Settings,
  User,
  LogOut,
} from "lucide-react";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

export default function MessagesPage() {

  const [user, setUser] =
    useState<any>(null);

  const [conversations, setConversations] =
    useState<any[]>([]);

  const [selectedConversation, setSelectedConversation] =
    useState<any>(null);

  const [messages, setMessages] =
    useState<any[]>([]);

  const [message, setMessage] =
    useState("");

  useEffect(() => {

    loadUser();

  }, []);

  useEffect(() => {

    if (user) {

      loadConversations();
    }

  }, [user]);

  useEffect(() => {

    if (selectedConversation) {

      loadMessages();
    }

  }, [selectedConversation]);

  async function loadUser() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);
  }

  async function loadConversations() {

    const { data } =
      await supabase
        .from("conversation_members")
        .select(`
          *,
          conversations (*)
        `)
        .eq("user_id", user.id);

    const convs =
      data?.map(
        (item: any) =>
          item.conversations
      ) || [];

    setConversations(convs);

    if (convs.length > 0) {

      setSelectedConversation(
        convs[0]
      );
    }
  }

  async function loadMessages() {

    const { data } =
      await supabase
        .from("messages")
        .select(`
          *,
          sender:profiles (
            full_name,
            avatar_url
          )
        `)
        .eq(
          "conversation_id",
          selectedConversation.id
        )
        .order("created_at", {
          ascending: true,
        });

    setMessages(data || []);
  }

  async function sendMessage() {

    if (
      !message.trim() ||
      !selectedConversation
    )
      return;

    await supabase
      .from("messages")
      .insert({
        conversation_id:
          selectedConversation.id,
        sender_id: user.id,
        content: message,
      });

    setMessage("");

    loadMessages();
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <div className="flex min-h-screen">

        <aside className="hidden w-[280px] border-r border-white/10 bg-[#050505] lg:flex lg:flex-col">

          <div className="border-b border-white/10 p-8">

            <Link
              href="/"
              className="flex items-center gap-4"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF5A1F]/10">

                <div className="h-4 w-4 rounded-full bg-[#FF5A1F]" />

              </div>

              <h1 className="text-3xl font-black">

                Track
                <span className="text-[#FF5A1F]">

                  Marshal

                </span>

              </h1>

            </Link>

          </div>

          <div className="flex-1 p-6">

            <nav className="space-y-3">

              {[
                {
                  icon: Home,
                  label: "Dashboard",
                  href: "/dashboard",
                },
                {
                  icon: CalendarDays,
                  label: "Événements",
                  href: "/dashboard/events",
                },
                {
                  icon: FileBadge2,
                  label: "Mes candidatures",
                  href: "/dashboard/applications",
                },
                {
                  icon: MessageSquare,
                  label: "Messages",
                  href: "/dashboard/messages",
                  active: true,
                },
                {
                  icon: User,
                  label: "Mon profil",
                  href: "/dashboard/profile",
                },
                {
                  icon: Settings,
                  label: "Paramètres",
                  href: "/dashboard/settings",
                },
              ].map((item) => (

                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex h-14 items-center gap-4 rounded-2xl px-5 transition ${
                    item.active
                      ? "bg-[#FF5A1F] text-white"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >

                  <item.icon size={20} />

                  <span className="font-semibold">

                    {item.label}

                  </span>

                </Link>

              ))}

            </nav>

          </div>

        </aside>

        <div className="flex flex-1 flex-col lg:flex-row">

          <div className="w-full border-b border-white/10 bg-[#050505] lg:w-[360px] lg:border-b-0 lg:border-r">

            <div className="border-b border-white/10 p-6">

              <h2 className="text-3xl font-black">

                Messages

              </h2>

            </div>

            <div className="space-y-3 p-4">

              {conversations.map(
                (conversation) => (

                  <button
                    key={conversation.id}
                    onClick={() =>
                      setSelectedConversation(
                        conversation
                      )
                    }
                    className={`w-full rounded-2xl border p-5 text-left transition ${
                      selectedConversation?.id ===
                      conversation.id
                        ? "border-[#FF5A1F] bg-[#FF5A1F]/10"
                        : "border-white/10 bg-white/[0.03]"
                    }`}
                  >

                    <p className="text-lg font-bold">

                      {
                        conversation.event_title
                      }

                    </p>

                    <p className="mt-2 text-sm text-zinc-500">

                      Conversation événement

                    </p>

                  </button>

                )
              )}

            </div>

          </div>

          <div className="flex flex-1 flex-col">

            <div className="border-b border-white/10 p-6">

              <h2 className="text-2xl font-black">

                {
                  selectedConversation
                    ?.event_title ||
                  "Messages"
                }

              </h2>

            </div>

            <div className="flex-1 space-y-6 overflow-y-auto p-4 lg:p-8">

              {messages.map((msg) => {

                const isMe =
                  msg.sender_id ===
                  user?.id;

                return (

                  <div
                    key={msg.id}
                    className={`flex ${
                      isMe
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >

                    <div
                      className={`max-w-[80%] rounded-[28px] p-5 ${
                        isMe
                          ? "rounded-br-md bg-[#FF5A1F]"
                          : "rounded-bl-md border border-white/10 bg-white/[0.03]"
                      }`}
                    >

                      <p className="text-sm text-zinc-300">

                        {
                          msg.sender
                            ?.full_name
                        }

                      </p>

                      <p className="mt-2">

                        {msg.content}

                      </p>

                    </div>

                  </div>

                );
              })}

            </div>

            {selectedConversation && (

              <div className="border-t border-white/10 p-4 lg:p-6">

                <div className="flex items-center gap-4 rounded-[28px] border border-white/10 bg-white/[0.03] p-3">

                  <input
                    type="text"
                    placeholder="Écrire un message..."
                    value={message}
                    onChange={(e) =>
                      setMessage(
                        e.target.value
                      )
                    }
                    className="flex-1 bg-transparent px-4 outline-none placeholder:text-zinc-500"
                  />

                  <button
                    onClick={sendMessage}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF5A1F] transition hover:scale-105"
                  >

                    <Send size={18} />

                  </button>

                </div>

              </div>

            )}

          </div>

        </div>

      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/90 backdrop-blur-2xl lg:hidden">
        <div className="grid grid-cols-4">
          {[
            { icon: Home, label: "Accueil", href: "/dashboard" },
            { icon: CalendarDays, label: "Events", href: "/dashboard/events" },
            { icon: MessageSquare, label: "Messages", href: "/dashboard/messages" },
            { icon: User, label: "Profil", href: "/dashboard/profile" },
          ].map((item) => (
            <Link href={item.href} key={item.label} className="flex flex-col items-center gap-2 py-4 text-zinc-400 transition hover:text-[#FF5A1F]">
              <item.icon size={20} />
              <span className="text-xs font-semibold">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

    </main>
  );
}
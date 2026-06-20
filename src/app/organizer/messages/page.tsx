"use client";

import { Send, MessageSquare, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import OrganizerSidebar from "@/components/layout/organizer-sidebar";
import NotificationBell from "@/components/notifications/notification-bell";

export default function OrganizerMessagesPage() {
  const [user, setUser] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [unreadMap, setUnreadMap] = useState<Record<string, number>>({});
  const [selectedConv, setSelectedConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [profilesMap, setProfilesMap] = useState<Record<string, any>>({});
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { initUser(); }, []);

  useEffect(() => {
    if (!user) return;
    loadConversations();

    const channel = supabase
      .channel(`org-conv-list-${user.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "conversation_members", filter: `user_id=eq.${user.id}` }, () => {
        loadConversations();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  useEffect(() => {
    if (!selectedConv) return;
    loadMessages(selectedConv.id);
    markAsRead(selectedConv.id);

    const channel = supabase
      .channel(`org-messages-${selectedConv.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${selectedConv.id}` }, () => {
        loadMessages(selectedConv.id);
        markAsRead(selectedConv.id);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selectedConv]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function initUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  }

  async function markAsRead(convId: string) {
    if (!user) return;
    await supabase
      .from("conversation_members")
      .update({ last_read_at: new Date().toISOString() })
      .eq("conversation_id", convId)
      .eq("user_id", user.id);
    setUnreadMap((prev) => ({ ...prev, [convId]: 0 }));
  }

  async function loadConversations() {
    if (!user) return;

    const { data: members } = await supabase
      .from("conversation_members")
      .select("conversation_id, last_read_at")
      .eq("user_id", user.id);

    const membersArr = members || [];
    const convIds = membersArr.map((m: any) => m.conversation_id).filter(Boolean);
    if (convIds.length === 0) { setConversations([]); return; }

    const { data: convs } = await supabase
      .from("conversations")
      .select("*")
      .in("id", convIds);

    if (!convs || convs.length === 0) { setConversations([]); return; }

    // Fetch other members' profiles for display names
    const { data: otherMembers } = await supabase
      .from("conversation_members")
      .select("conversation_id, user_id")
      .in("conversation_id", convIds)
      .neq("user_id", user.id);

    const otherUserIds = [...new Set((otherMembers || []).map((m: any) => m.user_id))];
    const { data: otherProfiles } = otherUserIds.length > 0
      ? await supabase.from("profiles").select("id, full_name, avatar_url").in("id", otherUserIds)
      : { data: [] };

    const profilesById: Record<string, any> = {};
    (otherProfiles || []).forEach((p: any) => { profilesById[p.id] = p; });

    const otherMembersMap: Record<string, string> = {};
    (otherMembers || []).forEach((m: any) => { otherMembersMap[m.conversation_id] = m.user_id; });

    // Fetch last message per conversation for preview + sorting
    const lastMsgsResults = await Promise.all(convIds.map(async (cid: string) => {
      const { data } = await supabase
        .from("messages")
        .select("content, created_at, sender_id")
        .eq("conversation_id", cid)
        .order("created_at", { ascending: false })
        .limit(1);
      return { convId: cid, msg: data?.[0] || null };
    }));

    const lastMsgMap: Record<string, any> = {};
    lastMsgsResults.forEach(({ convId, msg }) => { lastMsgMap[convId] = msg; });

    // Enrich conversations with display name and last message
    const enriched = convs.map((conv: any) => {
      const otherId = otherMembersMap[conv.id];
      const otherProfile = otherId ? profilesById[otherId] : null;
      return {
        ...conv,
        displayName: otherProfile?.full_name || conv.title || "Conversation",
        lastMsg: lastMsgMap[conv.id] || null,
      };
    });

    // Sort by last message time (most recent first), fallback to created_at
    enriched.sort((a: any, b: any) => {
      const aTime = a.lastMsg?.created_at || a.created_at;
      const bTime = b.lastMsg?.created_at || b.created_at;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });

    setConversations(enriched);

    const newUnreadMap: Record<string, number> = {};
    await Promise.all(membersArr.map(async (m: any) => {
      let q = supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("conversation_id", m.conversation_id)
        .neq("sender_id", user.id);
      if (m.last_read_at) q = q.gt("created_at", m.last_read_at);
      const { count } = await q;
      newUnreadMap[m.conversation_id] = count || 0;
    }));
    setUnreadMap(newUnreadMap);

    if (enriched.length > 0 && !selectedConv) {
      setSelectedConv(enriched[0]);
    }
  }

  async function loadMessages(convId: string) {
    const { data: msgs } = await supabase
      .from("messages")
      .select("id, conversation_id, sender_id, content, created_at")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true });

    if (!msgs || msgs.length === 0) { setMessages([]); return; }

    const senderIds = [...new Set(msgs.map((m: any) => m.sender_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .in("id", senderIds);

    const map: Record<string, any> = {};
    (profiles || []).forEach((p: any) => { map[p.id] = p; });
    setProfilesMap(map);
    setMessages(msgs);
  }

  async function sendMessage() {
    if (!message.trim() || !selectedConv || !user) return;
    setSending(true);

    const text = message.trim();
    const { error } = await supabase.from("messages").insert({
      conversation_id: selectedConv.id,
      sender_id: user.id,
      content: text,
    });

    if (error) {
      console.error("Erreur envoi message:", error);
    } else {
      setMessage("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";

      const { data: senderProfile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        fetch("/api/messages/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
          body: JSON.stringify({
            conversationId: selectedConv.id,
            senderName: senderProfile?.full_name || "TrackMarshal",
            preview: text.slice(0, 100),
          }),
        }).catch(() => {});
      }
    }
    setSending(false);
  }

  async function deleteConversation(convId: string) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    await fetch("/api/messages/delete-conversation", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ conversationId: convId }),
    });

    setConversations((prev) => prev.filter((c) => c.id !== convId));
    if (selectedConv?.id === convId) {
      setSelectedConv(null);
      setMessages([]);
      setMobileView("list");
    }
    setConfirmDeleteId(null);
  }

  function selectConversation(conv: any) {
    setSelectedConv(conv);
    setMobileView("chat");
    setConfirmDeleteId(null);
  }

  function growTextarea(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 128) + "px";
  }

  const totalUnread = Object.values(unreadMap).reduce((a, b) => a + b, 0);

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="flex min-h-screen">

        <OrganizerSidebar />

        <div className="flex flex-1 flex-col overflow-hidden">

          <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-10">
              <div className="flex items-center gap-3">
                {mobileView === "chat" && selectedConv && (
                  <button
                    onClick={() => setMobileView("list")}
                    className="flex items-center gap-2 text-sm text-zinc-500 transition hover:text-zinc-900 lg:hidden"
                  >
                    ← Retour
                  </button>
                )}
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Dashboard Organisateur</p>
                  <h1 className="flex items-center gap-3 text-xl font-black text-zinc-900 lg:text-2xl">
                    {mobileView === "chat" && selectedConv ? (selectedConv.displayName || selectedConv.title) : "Messages"}
                    {totalUnread > 0 && mobileView !== "chat" && (
                      <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#FF5A1F] px-1.5 text-xs font-black text-white">
                        {totalUnread > 9 ? "9+" : totalUnread}
                      </span>
                    )}
                  </h1>
                </div>
              </div>
              <NotificationBell />
            </div>
          </header>

          <div className="flex flex-1 overflow-hidden">

            <div className={`flex flex-col border-zinc-200 bg-white lg:w-[320px] lg:border-r ${mobileView === "chat" ? "hidden lg:flex" : "flex w-full"}`}>

              <div className="border-b border-zinc-200 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Conversations</p>
              </div>

              <div className="flex-1 overflow-y-auto p-3">
                {conversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <MessageSquare size={40} className="text-zinc-300" />
                    <p className="mt-4 text-sm font-semibold text-zinc-500">Aucune conversation</p>
                    <p className="mt-2 text-xs text-zinc-400">Les conversations s'ouvrent automatiquement quand vous acceptez une candidature.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {conversations.map((conv) => {
                      const convUnread = unreadMap[conv.id] || 0;
                      const isConfirming = confirmDeleteId === conv.id;
                      return (
                        <div
                          key={conv.id}
                          className={`group relative rounded-2xl border transition ${
                            selectedConv?.id === conv.id
                              ? "border-[#FF5A1F] bg-[#FF5A1F]/10"
                              : convUnread > 0
                              ? "border-[#FF5A1F]/30 bg-[#FF5A1F]/5"
                              : "border-zinc-200 bg-zinc-50 hover:bg-zinc-100"
                          }`}
                        >
                          {isConfirming ? (
                            <div className="flex items-center justify-between gap-2 p-4">
                              <p className="text-sm font-semibold text-zinc-700">Supprimer ?</p>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => deleteConversation(conv.id)}
                                  className="h-10 rounded-xl bg-red-600 px-4 text-xs font-bold text-white transition hover:scale-105"
                                >
                                  Oui
                                </button>
                                <button
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="h-10 rounded-xl border border-zinc-200 px-4 text-xs text-zinc-600 transition hover:text-zinc-900"
                                >
                                  Non
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 p-1 pl-4">
                              <button
                                onClick={() => selectConversation(conv)}
                                className="flex flex-1 flex-col py-3 text-left"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    {conv.is_group && <span className="shrink-0 text-[10px]">🏁</span>}
                                    <p className={`truncate font-bold leading-tight ${convUnread > 0 ? "text-zinc-900" : "text-zinc-700"}`}>
                                      {conv.displayName || conv.title || "Conversation"}
                                    </p>
                                  </div>
                                  {convUnread > 0 && (
                                    <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#FF5A1F] px-1 text-[10px] font-black text-white">
                                      {convUnread > 9 ? "9+" : convUnread}
                                    </span>
                                  )}
                                </div>
                                {convUnread > 0 ? (
                                  <p className="mt-1 text-xs font-semibold text-[#FF5A1F]">{convUnread} nouveau{convUnread > 1 ? "x" : ""} message{convUnread > 1 ? "s" : ""}</p>
                                ) : conv.lastMsg ? (
                                  <p className="mt-1 truncate text-xs text-zinc-500">{conv.lastMsg.content.slice(0, 60)}</p>
                                ) : (
                                  <p className="mt-1 text-xs text-zinc-400">Aucun message</p>
                                )}
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(conv.id); }}
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-red-50 hover:text-red-500 lg:opacity-0 lg:group-hover:opacity-100"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className={`flex flex-1 flex-col overflow-hidden lg:flex ${mobileView === "list" ? "hidden" : "flex"}`}>

              {!selectedConv ? (
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                  <MessageSquare size={48} className="text-zinc-300" />
                  <p className="mt-4 font-semibold text-zinc-500">Sélectionne une conversation</p>
                </div>
              ) : (
                <>
                  <div className="hidden border-b border-zinc-200 px-6 py-4 lg:block">
                    <p className="font-black text-zinc-900">{selectedConv.displayName || selectedConv.title}</p>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 lg:p-6">
                    {messages.length === 0 ? (
                      <div className="flex h-full items-center justify-center">
                        <p className="text-sm text-zinc-400">Aucun message. Commencez la conversation !</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {messages.map((msg) => {
                          const isMe = msg.sender_id === user?.id;
                          const sender = profilesMap[msg.sender_id];
                          return (
                            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                              <div className={`max-w-[75%] ${isMe ? "items-end" : "items-start"} flex flex-col gap-1`}>
                                {!isMe && (
                                  <p className="px-1 text-xs text-zinc-500">{sender?.full_name || "Inconnu"}</p>
                                )}
                                <div className={`rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                                  isMe
                                    ? "rounded-br-sm bg-[#FF5A1F] text-white"
                                    : "rounded-bl-sm border border-zinc-200 bg-zinc-100 text-zinc-900"
                                }`}>
                                  {msg.content}
                                </div>
                                <p className="px-1 text-[10px] text-zinc-400">
                                  {new Date(msg.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={bottomRef} />
                      </div>
                    )}
                  </div>

                  <div className="border-t border-zinc-200 p-4 pb-24 lg:pb-4">
                    <div className="flex items-end gap-3 rounded-2xl border border-zinc-300 bg-zinc-50 px-4 py-2">
                      <textarea
                        ref={textareaRef}
                        rows={1}
                        placeholder="Écrire un message..."
                        value={message}
                        onChange={(e) => { setMessage(e.target.value); growTextarea(e.target); }}
                        className="flex-1 resize-none bg-transparent py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
                        style={{ maxHeight: "128px", overflowY: "auto" }}
                      />
                      <button
                        onClick={sendMessage}
                        disabled={sending || !message.trim()}
                        className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FF5A1F] text-white transition hover:scale-105 disabled:opacity-40"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                    <p className="mt-2 hidden text-center text-[10px] text-zinc-400 lg:block">Entrée pour nouvelle ligne · Cliquez sur le bouton pour envoyer</p>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

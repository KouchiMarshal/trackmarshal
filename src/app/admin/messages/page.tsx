"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { MessageSquare, Search, Send, Users } from "lucide-react";

export default function AdminMessagesPage() {
  const [adminUser, setAdminUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedConv, setSelectedConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [profilesMap, setProfilesMap] = useState<Record<string, any>>({});
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingConv, setLoadingConv] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { init(); }, []);

  useEffect(() => {
    const lower = search.toLowerCase();
    setFilteredUsers(
      users.filter((u) =>
        u.full_name?.toLowerCase().includes(lower) ||
        u.email?.toLowerCase().includes(lower) ||
        u.organization_name?.toLowerCase().includes(lower)
      )
    );
  }, [search, users]);

  useEffect(() => {
    if (!selectedConv) return;
    loadMessages(selectedConv.id);
    markAsRead(selectedConv.id);

    const channel = supabase
      .channel(`admin-conv-${selectedConv.id}`)
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "messages",
        filter: `conversation_id=eq.${selectedConv.id}`,
      }, () => {
        loadMessages(selectedConv.id);
        markAsRead(selectedConv.id);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selectedConv]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function init() {
    const { data: { user } } = await supabase.auth.getUser();
    setAdminUser(user);

    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, email, avatar_url, role, organization_name")
      .in("role", ["marshal", "organizer"])
      .order("full_name", { ascending: true });

    setUsers(data || []);
    setFilteredUsers(data || []);
  }

  async function markAsRead(convId: string) {
    if (!adminUser) return;
    await supabase
      .from("conversation_members")
      .update({ last_read_at: new Date().toISOString() })
      .eq("conversation_id", convId)
      .eq("user_id", adminUser.id);
  }

  async function selectUser(user: any) {
    setSelectedUser(user);
    setMobileView("chat");
    setMessages([]);
    setSelectedConv(null);
    setLoadingConv(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setLoadingConv(false); return; }

    const res = await fetch("/api/admin/start-conversation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ targetUserId: user.id }),
    });

    const data = await res.json();
    setLoadingConv(false);

    if (data.conversation) {
      setSelectedConv(data.conversation);
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
    if (!message.trim() || !adminUser || !selectedUser) return;
    if (!selectedConv) return;
    setSending(true);

    const text = message.trim();
    const { error } = await supabase.from("messages").insert({
      conversation_id: selectedConv.id,
      sender_id: adminUser.id,
      content: text,
    });

    if (error) {
      console.error("Erreur envoi message:", error);
      alert("Erreur: " + error.message);
    } else {
      setMessage("");

      // Notify recipients server-side (bypasses RLS)
      const { data: adminProfile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", adminUser.id)
        .single();

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        fetch("/api/messages/notify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            conversationId: selectedConv.id,
            senderName: adminProfile?.full_name || "TrackMarshal",
            preview: text.slice(0, 100),
          }),
        }).catch(() => {});
      }
    }
    setSending(false);
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">

      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur-2xl">
        <div className="flex h-20 items-center gap-4 px-6 lg:px-10">
          {mobileView === "chat" && selectedUser && (
            <button
              onClick={() => setMobileView("list")}
              className="shrink-0 text-sm text-zinc-400 transition hover:text-white lg:hidden"
            >
              ← Retour
            </button>
          )}
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Administration</p>
            <h1 className="text-2xl font-black lg:text-3xl">
              {mobileView === "chat" && selectedUser
                ? (selectedUser.full_name || selectedUser.email)
                : "Messages"}
            </h1>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* Liste des utilisateurs */}
        <div className={`flex flex-col border-r border-white/10 bg-[#050505] lg:w-[320px] ${mobileView === "chat" ? "hidden lg:flex" : "flex w-full"}`}>

          <div className="p-4">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <Search size={16} className="shrink-0 text-zinc-500" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-600"
              />
            </div>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto px-3 pb-4">
            {filteredUsers.length === 0 ? (
              <div className="py-16 text-center">
                <Users size={36} className="mx-auto text-zinc-700" />
                <p className="mt-3 text-sm text-zinc-500">Aucun utilisateur trouvé</p>
              </div>
            ) : (
              filteredUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => selectUser(u)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selectedUser?.id === u.id
                      ? "border-[#FF5A1F] bg-[#FF5A1F]/10"
                      : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.full_name || "U")}&background=FF5A1F&color=fff&size=80`}
                      alt=""
                      className="h-10 w-10 shrink-0 rounded-xl object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-bold text-sm">{u.full_name || "Sans nom"}</p>
                      <p className="truncate text-xs text-zinc-500">{u.email}</p>
                      <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        u.role === "marshal"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-purple-500/20 text-purple-400"
                      }`}>
                        {u.role === "marshal" ? "Commissaire" : "Organisateur"}
                      </span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Zone de conversation */}
        <div className={`flex flex-1 flex-col overflow-hidden lg:flex ${mobileView === "list" ? "hidden" : "flex"}`}>

          {!selectedUser ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <MessageSquare size={48} className="text-zinc-700" />
              <p className="mt-4 font-semibold text-zinc-500">Sélectionne un utilisateur</p>
              <p className="mt-2 text-sm text-zinc-600">pour démarrer une conversation</p>
            </div>
          ) : (
            <>
              <div className="hidden border-b border-white/10 px-6 py-4 lg:block">
                <p className="font-black">{selectedUser.full_name || "Sans nom"}</p>
                <p className="text-sm text-zinc-400">{selectedUser.email}</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 lg:p-6">
                {loadingConv ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-[#FF5A1F]" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-sm text-zinc-600">Aucun message — écris le premier !</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((msg) => {
                      const isMe = msg.sender_id === adminUser?.id;
                      const sender = profilesMap[msg.sender_id];
                      return (
                        <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                          <div className={`flex max-w-[75%] flex-col gap-1 ${isMe ? "items-end" : "items-start"}`}>
                            {!isMe && (
                              <p className="px-1 text-xs text-zinc-500">{sender?.full_name || "Inconnu"}</p>
                            )}
                            <div className={`rounded-2xl px-4 py-3 text-sm ${
                              isMe
                                ? "rounded-br-sm bg-[#FF5A1F] text-white"
                                : "rounded-bl-sm border border-white/10 bg-white/[0.05] text-zinc-100"
                            }`}>
                              {msg.content}
                            </div>
                            <p className="px-1 text-[10px] text-zinc-600">
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

              <div className="border-t border-white/10 p-4 pb-24 lg:pb-4">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2">
                  <input
                    type="text"
                    placeholder="Écrire un message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }}}
                    disabled={loadingConv || !selectedConv}
                    className="flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-zinc-600 disabled:opacity-40"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={sending || !message.trim() || !selectedConv || loadingConv}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FF5A1F] transition hover:scale-105 disabled:opacity-40"
                  >
                    {sending
                      ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      : <Send size={16} />
                    }
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

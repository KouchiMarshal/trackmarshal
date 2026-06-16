import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase-admin";

const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function DELETE(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const token = authHeader.slice(7);
  const supabaseServer = createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { conversationId } = await req.json();
  if (!conversationId) {
    return NextResponse.json({ error: "conversationId manquant" }, { status: 400 });
  }

  // Verify user is a member of this conversation
  const { data: membership } = await supabaseAdmin
    .from("conversation_members")
    .select("user_id")
    .eq("conversation_id", conversationId)
    .eq("user_id", user.id)
    .single();

  if (!membership) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  // Delete in order: messages → members → conversation
  await supabaseAdmin.from("messages").delete().eq("conversation_id", conversationId);
  await supabaseAdmin.from("conversation_members").delete().eq("conversation_id", conversationId);
  await supabaseAdmin.from("conversations").delete().eq("id", conversationId);

  return NextResponse.json({ ok: true });
}

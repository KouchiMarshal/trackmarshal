import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.slice(7);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: adminProfile } = await supabaseAdmin
    .from("profiles").select("role").eq("id", user.id).single();
  if (adminProfile?.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { targetUserId } = await req.json();
  if (!targetUserId) return NextResponse.json({ error: "Missing targetUserId" }, { status: 400 });

  // Check if a conversation already exists between admin and target
  const { data: adminMemberships } = await supabaseAdmin
    .from("conversation_members")
    .select("conversation_id")
    .eq("user_id", user.id);

  const adminConvIds = (adminMemberships || []).map((m: any) => m.conversation_id);

  if (adminConvIds.length > 0) {
    const { data: shared } = await supabaseAdmin
      .from("conversation_members")
      .select("conversation_id")
      .eq("user_id", targetUserId)
      .in("conversation_id", adminConvIds);

    if (shared && shared.length > 0) {
      const { data: conv } = await supabaseAdmin
        .from("conversations")
        .select("*")
        .eq("id", shared[0].conversation_id)
        .single();
      return NextResponse.json({ conversation: conv, created: false });
    }
  }

  // Get target user info for conversation title
  const { data: targetProfile } = await supabaseAdmin
    .from("profiles")
    .select("full_name, email, role")
    .eq("id", targetUserId)
    .single();

  const roleName = targetProfile?.role === "marshal" ? "Commissaire" : "Organisateur";
  const title = `Admin ↔ ${targetProfile?.full_name || targetProfile?.email || "Utilisateur"} (${roleName})`;

  const { data: conv, error: convErr } = await supabaseAdmin
    .from("conversations")
    .insert({ title })
    .select()
    .single();

  if (convErr || !conv)
    return NextResponse.json({ error: convErr?.message || "Création échouée" }, { status: 500 });

  await supabaseAdmin.from("conversation_members").insert([
    { conversation_id: conv.id, user_id: user.id },
    { conversation_id: conv.id, user_id: targetUserId },
  ]);

  return NextResponse.json({ conversation: conv, created: true });
}

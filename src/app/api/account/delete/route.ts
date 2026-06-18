import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function DELETE(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (!user || authError) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const uid = user.id;

  // Delete in dependency order
  await supabaseAdmin.from("messages").delete().eq("sender_id", uid);
  await supabaseAdmin.from("conversation_members").delete().eq("user_id", uid);
  await supabaseAdmin.from("applications").delete().eq("marshal_id", uid);
  await supabaseAdmin.from("favorites").delete().eq("user_id", uid);
  await supabaseAdmin.from("notifications").delete().eq("user_id", uid);
  // Anonymise events created by an organizer rather than hard-deleting
  await supabaseAdmin.from("events").update({ organizer_id: null }).eq("organizer_id", uid);
  await supabaseAdmin.from("profiles").delete().eq("id", uid);

  const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(uid);
  if (deleteAuthError) {
    return NextResponse.json({ error: deleteAuthError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

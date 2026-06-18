import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (!user || authError) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const uid = user.id;

  const [
    { data: profile },
    { data: applications },
    { data: favorites },
    { data: messages },
    { data: events },
    { data: convMembers },
  ] = await Promise.all([
    supabaseAdmin.from("profiles").select("*").eq("id", uid).single(),
    supabaseAdmin.from("applications").select("*").eq("marshal_id", uid),
    supabaseAdmin.from("favorites").select("*").eq("user_id", uid),
    supabaseAdmin.from("messages").select("*").eq("sender_id", uid),
    supabaseAdmin.from("events").select("*").eq("organizer_id", uid),
    supabaseAdmin.from("conversation_members").select("*").eq("user_id", uid),
  ]);

  const exportData = {
    exported_at: new Date().toISOString(),
    account: {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
    },
    profile: profile || null,
    applications: applications || [],
    favorites: favorites || [],
    messages_sent: messages || [],
    events_organized: events || [],
    conversations: convMembers || [],
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="trackmarshal-mes-donnees-${new Date().toISOString().split("T")[0]}.json"`,
    },
  });
}

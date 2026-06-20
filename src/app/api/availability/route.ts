import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("availability")
    .select("date")
    .eq("user_id", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ dates: (data || []).map((r: any) => r.date) });
}

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.slice(7);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { date } = await req.json();
  if (!date) return NextResponse.json({ error: "Missing date" }, { status: 400 });

  const { data: existing } = await supabaseAdmin
    .from("availability")
    .select("user_id")
    .eq("user_id", user.id)
    .eq("date", date)
    .maybeSingle();

  if (existing) {
    await supabaseAdmin.from("availability").delete().eq("user_id", user.id).eq("date", date);
    return NextResponse.json({ action: "removed" });
  } else {
    await supabaseAdmin.from("availability").insert({ user_id: user.id, date });
    return NextResponse.json({ action: "added" });
  }
}

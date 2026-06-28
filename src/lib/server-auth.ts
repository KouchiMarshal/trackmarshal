import { supabaseAdmin } from "@/lib/supabase-admin";

/** Récupère l'utilisateur à partir du header Authorization: Bearer <token>. */
export async function getAuthUser(req: Request) {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  const token = header.slice(7);
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}

/** Renvoie l'utilisateur s'il est admin (profiles.role === "admin"), sinon null. */
export async function getAdminUser(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return null;
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  return profile?.role === "admin" ? user : null;
}

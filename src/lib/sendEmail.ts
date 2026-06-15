import { supabase } from "@/lib/supabase";

export async function sendEmail(
  to: string,
  type: string,
  data: Record<string, any>
) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return;

    await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ to, type, data }),
    });
  } catch {
    // Email failure is non-blocking
  }
}

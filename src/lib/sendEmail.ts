export async function sendEmail(
  to: string,
  type: string,
  data: Record<string, any>
) {
  try {
    await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, type, data }),
    });
  } catch {
    // Email failure is non-blocking
  }
}

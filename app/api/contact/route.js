// Contact form → emails support@billcrafter.com via Resend (reply-to = visitor).
import { getEnv } from "@/lib/server/auth";

const esc = (s) => (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;");

export async function POST(request) {
  const { name, email, message, website } = await request.json().catch(() => ({}));
  if (website) return Response.json({ ok: true }); // honeypot: pretend success for bots
  if (!email || !/.+@.+\..+/.test(email) || !message || message.trim().length < 5) {
    return Response.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  const env = await getEnv();
  if (!env?.EMAIL_API_KEY) return Response.json({ ok: false, error: "email_unavailable" }, { status: 503 });

  const to = env.CONTACT_TO || "support@billcrafter.com";
  const from = env.EMAIL_FROM || "BillCrafter <noreply@billcrafter.com>";
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${env.EMAIL_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({
        from, to: [to], reply_to: email,
        subject: `Contact form — ${(name || email).slice(0, 80)}`,
        html: `<p><b>From:</b> ${esc(name) || "—"} &lt;${esc(email)}&gt;</p><p><b>Message:</b></p><p>${esc(message).replace(/\n/g, "<br>")}</p>`,
      }),
    });
    if (!r.ok) return Response.json({ ok: false, error: "send_failed" }, { status: 502 });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
}

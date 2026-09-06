// Recurring-invoice runner. Call on a schedule (Cloudflare Cron Trigger, or any
// scheduler) with:  Authorization: Bearer <CRON_SECRET>
//
// Note on PDFs: our PDF is produced in the browser by html2pdf, so a server-side
// job cannot attach one. Instead each run mints a share link and emails that —
// which also gives the sender view tracking for free.
import { getEnv } from "@/lib/server/auth";
import { nextRun, catchUp } from "@/lib/server/recurring";
import { nextInvNo } from "@/lib/invoice";

export const dynamic = "force-dynamic";

const esc = (s) => (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;");
const token = () => (crypto.randomUUID() + crypto.randomUUID()).replace(/-/g, "").slice(0, 22);

export async function POST(request) {
  const env = await getEnv();
  if (!env?.DB) return Response.json({ ok: false, error: "backend_unavailable" }, { status: 503 });

  const auth = request.headers.get("authorization") || "";
  if (!env.CRON_SECRET || auth !== `Bearer ${env.CRON_SECRET}`) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const now = Date.now();
  const base = env.APP_URL || "https://billcrafter.com";
  let due = [];
  try {
    const r = await env.DB.prepare(
      "SELECT * FROM recurring WHERE active = 1 AND next_run <= ? ORDER BY next_run ASC LIMIT 50"
    ).bind(now).all();
    due = r.results || [];
  } catch { return Response.json({ ok: false, error: "query_failed" }, { status: 500 }); }

  let sent = 0, failed = 0;
  for (const row of due) {
    try {
      const doc = JSON.parse(row.doc_json);
      // Advance the document number so each issue is distinct.
      if (doc.f?.invNo) doc.f.invNo = nextInvNo(doc.f.invNo);
      doc.f && (doc.f.issueDate = new Date(now).toISOString().slice(0, 10));

      // Mint a share link for this issue.
      const tk = token();
      await env.DB.prepare(
        "INSERT INTO share_links (token, user_id, user_email, doc_json, title, locale, revoked, created_at) VALUES (?,?,?,?,?,?,0,?)"
      ).bind(tk, row.user_id, row.user_email, JSON.stringify(doc), row.title || "", row.locale || "en", now).run();
      const url = `${base}/i/${tk}`;

      // Email the client.
      if (env.EMAIL_API_KEY) {
        const subject = `Invoice ${doc.f?.invNo || ""} from ${doc.f?.fromName || "BillCrafter"}`.trim();
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { authorization: `Bearer ${env.EMAIL_API_KEY}`, "content-type": "application/json" },
          body: JSON.stringify({
            from: env.EMAIL_FROM || "BillCrafter <noreply@billcrafter.com>",
            to: [row.to_email],
            reply_to: row.user_email || undefined,
            subject,
            html: `<p>Hi,</p><p>Your ${esc(doc.type || "invoice")} ${esc(doc.f?.invNo || "")} is ready.</p>
                   <p><a href="${url}" style="display:inline-block;background:#2D2F33;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">View invoice</a></p>
                   <p style="color:#888;font-size:12px">Sent automatically via BillCrafter · billcrafter.com</p>`,
          }),
        });
        if (!res.ok) throw new Error("email_failed");
      }

      await env.DB.prepare(
        "UPDATE recurring SET next_run = ?, last_run = ?, runs = runs + 1 WHERE id = ?"
      ).bind(catchUp(nextRun(row.next_run, row.freq), row.freq, now), now, row.id).run();

      try {
        await env.DB.prepare(
          "INSERT INTO email_log (id, user_id, user_email, to_email, subject, filename, status, error, created_at) VALUES (?,?,?,?,?,?,?,?,?)"
        ).bind(crypto.randomUUID(), row.user_id, row.user_email, row.to_email, (row.title || "Recurring invoice").slice(0, 300), null, "sent", null, now).run();
      } catch {}
      sent++;
    } catch {
      failed++;
      // Push the schedule forward so one bad row can't block the queue forever.
      try {
        await env.DB.prepare("UPDATE recurring SET next_run = ? WHERE id = ?")
          .bind(catchUp(nextRun(row.next_run, row.freq), row.freq, now), row.id).run();
      } catch {}
    }
  }

  return Response.json({ ok: true, due: due.length, sent, failed });
}

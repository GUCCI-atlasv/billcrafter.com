// BillCrafter cron worker.
//
// A deliberately tiny, standalone Worker whose only job is to wake up on a
// schedule and POST the main app's /api/cron/recurring endpoint. It is kept
// separate from the Next.js app because OpenNext generates the main worker's
// entrypoint and does not expose a `scheduled` handler we can hook into.
//
// Secrets (set with `wrangler secret put` inside this folder):
//   CRON_SECRET — must match the CRON_SECRET on the main app
// Vars (wrangler.toml):
//   TARGET_URL  — https://www.billcrafter.com/api/cron/recurring

async function runRecurring(env) {
  const url = env.TARGET_URL;
  if (!url) return { ok: false, error: "TARGET_URL not configured" };
  if (!env.CRON_SECRET) return { ok: false, error: "CRON_SECRET not configured" };

  // One retry: a cold main worker occasionally times out on the first hit.
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          authorization: `Bearer ${env.CRON_SECRET}`,
          "content-type": "application/json",
          "user-agent": "billcrafter-cron/1.0",
        },
        body: "{}",
      });
      const text = await res.text();
      let body;
      try { body = JSON.parse(text); } catch { body = text.slice(0, 300); }

      if (res.ok) {
        console.log("recurring run ok", JSON.stringify(body));
        return { ok: true, status: res.status, body };
      }
      console.error(`recurring run failed (attempt ${attempt})`, res.status, body);
      if (res.status >= 400 && res.status < 500) {
        // 401/403 won't fix themselves on retry — stop and surface it.
        return { ok: false, status: res.status, body };
      }
    } catch (e) {
      console.error(`recurring run threw (attempt ${attempt})`, e?.message);
    }
    if (attempt === 1) await new Promise((r) => setTimeout(r, 3000));
  }
  return { ok: false, error: "all attempts failed" };
}

export default {
  // Fired by the cron triggers in wrangler.toml.
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runRecurring(env));
  },

  // Manual trigger for testing:  curl -X POST https://<worker>/run -H "authorization: Bearer <CRON_SECRET>"
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === "/run" && request.method === "POST") {
      const auth = request.headers.get("authorization") || "";
      if (!env.CRON_SECRET || auth !== `Bearer ${env.CRON_SECRET}`) {
        return new Response("unauthorized", { status: 401 });
      }
      const result = await runRecurring(env);
      return Response.json(result, { status: result.ok ? 200 : 502 });
    }
    return Response.json({ ok: true, service: "billcrafter-cron", note: "POST /run to trigger manually" });
  },
};

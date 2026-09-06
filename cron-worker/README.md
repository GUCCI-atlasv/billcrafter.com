# BillCrafter cron worker

A standalone Cloudflare Worker that fires once a day and asks the main app to
send any due recurring invoices.

It exists as a separate Worker because OpenNext generates the Next.js app's
worker entrypoint, so there's no clean place to add a `scheduled` handler. This
keeps the main deploy untouched.

```
Cloudflare cron (09:00 UTC daily)
        │
        ▼
billcrafter-cron  ──POST──►  https://www.billcrafter.com/api/cron/recurring
                              Authorization: Bearer <CRON_SECRET>
                                        │
                                        ▼
                          finds due schedules → mints a share link
                          → emails the client → advances next_run
```

## Deploy

From **this folder** (`cron-worker/`), not the project root:

```bash
npm install
npx wrangler secret put CRON_SECRET   # must match the main app's CRON_SECRET
npx wrangler deploy
```

Then set the same secret on the **main** app (from the project root):

```bash
npx wrangler secret put CRON_SECRET
```

Both sides must hold the identical value — the endpoint rejects anything else
with a 401.

## Verify

Trigger a run by hand without waiting for the schedule:

```bash
curl -X POST https://billcrafter-cron.<your-subdomain>.workers.dev/run \
  -H "authorization: Bearer <CRON_SECRET>"
```

A healthy response looks like `{"ok":true,"status":200,"body":{"ok":true,"due":0,"sent":0,"failed":0}}`.

Watch live logs while it runs:

```bash
npx wrangler tail
```

Locally you can simulate the schedule with `npm run dev` and then hitting
`http://localhost:8787/__scheduled`.

## Changing the schedule

Edit `crons` in `wrangler.toml` and redeploy. Cron expressions are **UTC**.

| Goal | Expression |
| --- | --- |
| Daily 09:00 UTC (default) | `0 9 * * *` |
| Twice daily | `0 9,21 * * *` |
| Every hour | `0 * * * *` |

Running more often than daily is safe: each successful send advances the
schedule's `next_run`, so an extra fire finds nothing due rather than
double-sending.

## Notes

- The Worker holds no data and no D1 binding. All logic lives in the main app;
  this is just the alarm clock.
- Non-2xx responses are retried once after 3s. A 4xx (e.g. a mismatched secret)
  is not retried — it's surfaced in the logs instead.
- If `TARGET_URL` or `CRON_SECRET` is missing the run is skipped and logged,
  rather than failing silently.

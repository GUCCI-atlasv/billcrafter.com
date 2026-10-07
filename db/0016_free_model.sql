-- Free model (Sep 2026): no paid plans.
--   no account   -> 1 PDF export per UTC day, keyed by IP
--   free account -> unlimited
--   wrangler d1 execute billcrafter --remote --file=./db/0016_free_model.sql

CREATE TABLE IF NOT EXISTS anon_daily_usage (
  ip          TEXT NOT NULL,
  day         TEXT NOT NULL,   -- 'YYYY-MM-DD' (UTC)
  count       INTEGER NOT NULL DEFAULT 0,
  updated_at  INTEGER NOT NULL,
  PRIMARY KEY (ip, day)
);

-- Nobody is on a paid plan any more; any former Pro/test accounts are ordinary
-- (unlimited) free accounts now.
UPDATE users SET plan = 'free', comp = 0 WHERE plan <> 'free' OR comp <> 0;

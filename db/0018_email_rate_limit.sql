-- Daily outbound email usage counter for anti-abuse rate limiting (max 3/day per user or IP).
--   wrangler d1 execute billcrafter --remote --file=./db/0018_email_rate_limit.sql

CREATE TABLE IF NOT EXISTS email_daily_usage (
  subject     TEXT NOT NULL,   -- e.g. 'outbound:u:<id>' or 'outbound:ip:<addr>'
  day         TEXT NOT NULL,   -- 'YYYY-MM-DD' (UTC)
  count       INTEGER NOT NULL DEFAULT 0,
  updated_at  INTEGER NOT NULL,
  PRIMARY KEY (subject, day)
);

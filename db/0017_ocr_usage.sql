-- OCR daily usage tracking (Guest by IP + Signed-in Member by User ID)
-- Apply: wrangler d1 execute billcrafter --remote --file=./db/0017_ocr_usage.sql

CREATE TABLE IF NOT EXISTS ocr_daily_usage (
  subject     TEXT NOT NULL,   -- 'ip:<addr>' or 'u:<user_id>'
  day         TEXT NOT NULL,   -- 'YYYY-MM-DD' (UTC)
  count       INTEGER NOT NULL DEFAULT 0,
  updated_at  INTEGER NOT NULL,
  PRIMARY KEY (subject, day)
);
CREATE INDEX IF NOT EXISTS idx_ocr_usage_day ON ocr_daily_usage(day);

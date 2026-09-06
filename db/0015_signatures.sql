-- E-signature: signed PDFs in R2, the audit trail in D1 (registered users).
--   wrangler d1 execute billcrafter --remote --file=./db/0015_signatures.sql
--
-- The audit columns exist because an e-signature is only worth as much as the
-- evidence behind it: who consented, to what wording, when, and from where.
-- ESIGN/UETA-style records need intent + consent + attribution + an unaltered
-- copy, so we keep the consent sentence verbatim and a SHA-256 of the exact file
-- that was produced.

CREATE TABLE IF NOT EXISTS signatures (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL,          -- account that signed (registered only)
  user_email    TEXT,
  invoice_id    TEXT,                   -- local invoice id, when signing a saved one
  invoice_no    TEXT,                   -- e.g. INV-0042, for display
  doc_type      TEXT DEFAULT 'invoice', -- invoice | estimate | quote | receipt
  signer_name   TEXT NOT NULL,          -- typed legal name, not the drawing
  signer_role   TEXT DEFAULT 'sender',  -- sender | recipient
  consent_text  TEXT NOT NULL,          -- the exact wording the signer agreed to
  consent_at    INTEGER NOT NULL,       -- epoch ms the box was ticked
  ip            TEXT,
  country       TEXT,
  ua            TEXT,
  r2_key        TEXT NOT NULL,          -- object key of the signed PDF
  sha256        TEXT NOT NULL,          -- hash of the signed PDF (tamper evidence)
  bytes         INTEGER,
  created_at    INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sig_user    ON signatures(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sig_invoice ON signatures(invoice_id);

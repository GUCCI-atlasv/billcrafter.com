// Single source of truth for BillCrafter's free-tier allowances.
// Imported by server quota enforcers, client workbenches, Terms, and copy helpers
// so PDF export limits and AI OCR scan limits never drift out of sync.

export const QUOTA_POLICY = {
  pdfGuestDaily: 1,
  pdfMemberDaily: null, // null = unlimited PDF exports with a free account
  ocrGuestDaily: 3,
  ocrMemberDaily: 20,
  ocrGuestBatchMax: 3,
  ocrMemberBatchMax: 10,
  emailDailyLimit: 3, // outbound invoice email anti-abuse cap per day
};

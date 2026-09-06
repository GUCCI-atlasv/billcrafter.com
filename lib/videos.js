// YouTube videos shown on the site, and the source for their VideoObject schema.
//
// uploadDate and duration are read from YouTube's own page metadata
// (`meta[itemprop="uploadDate"]` / `[itemprop="duration"]`) — not estimated.
// Google REQUIRES uploadDate: shipping a VideoObject without it triggers a
// "Missing field uploadDate" error in Search Console, which is what happened when
// these first went live with the field blank. videoSchema() below now refuses to
// emit anything for an entry that has no uploadDate, so an incomplete video can
// never produce invalid markup again.
//
// When adding a video, read both values off its watch page rather than guessing:
//   uploadDate: "2026-07-26T02:25:49-07:00"   (ISO 8601 with offset)
//   duration:   "PT0M16S"                     (ISO 8601 duration)

export const CHANNEL_URL = "https://www.youtube.com/@CCCSTUDIO-t6i";

export const VIDEOS = [
  {
    id: "7yJDBRTYyDM",
    title: "Create a Professional Invoice in Minutes",
    // Shown under the thumbnail and used as the schema description. Adjust if it
    // doesn't match what the finished cut actually shows.
    blurb: "A full walkthrough: fill in the invoice, pick a template, and download a clean PDF — without creating an account.",
    uploadDate: "2026-07-26T02:25:49-07:00",
    duration: "PT0M16S",
  },
  {
    id: "CzalxPefH54",
    title: "Skip the Forms. Edit Your Invoice Directly",
    blurb: "Most tools make you fill in a form and hope the output looks right. BillCrafter lets you type straight onto the document — what you see is what downloads.",
    uploadDate: "2026-07-26T02:29:53-07:00",
    duration: "PT0M16S",
  },
  {
    id: "dONgyoVZA7E",
    title: "Spend Less Time Invoicing. Get Paid Faster.",
    blurb: "Reuse your business details, saved clients and past invoices so every invoice after the first one takes seconds.",
    uploadDate: "2026-07-26T02:34:01-07:00",
    duration: "PT0M16S",
  },
];

// maxresdefault is the true 16:9 still, but YouTube only generates it for videos
// uploaded in HD — the component falls back to hqdefault if it 404s.
export const thumb = (id) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
export const thumbFallback = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
export const watchUrl = (id) => `https://www.youtube.com/watch?v=${id}`;
// youtube-nocookie: no tracking cookies are set unless the visitor actually
// presses play, which keeps the embeds out of cookie-consent scope in the EU.
export const embedUrl = (id) => `https://www.youtube-nocookie.com/embed/${id}`;

// schema.org VideoObject per video — or null when the entry isn't complete.
//
// uploadDate is REQUIRED by Google. Emitting a VideoObject without it doesn't
// just forfeit the rich result, it raises a "Missing field uploadDate" error in
// Search Console — which is exactly what happened when these were first shipped
// with the dates left blank. Returning null here means an incomplete entry is
// simply not described as a video: no invalid markup, no error. Fill in the date
// and the full schema (and rich-result eligibility) switches on by itself.
export function videoSchema(v) {
  if (!v?.uploadDate) return null;
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `${v.title} | BillCrafter`,
    description: v.blurb,
    thumbnailUrl: [thumb(v.id), thumbFallback(v.id)],
    contentUrl: watchUrl(v.id),
    embedUrl: embedUrl(v.id),
    uploadDate: v.uploadDate,
    ...(v.duration ? { duration: v.duration } : {}),
    publisher: { "@id": "https://billcrafter.com/#organization" },
    isFamilyFriendly: true,
  };
}

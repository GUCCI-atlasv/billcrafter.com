// The invoice manager is a "use client" page, and client components can't export
// metadata — so the noindex lives here in a server layout instead. This is the
// private signed-in area (saved invoices, clients, business profile) and must
// never appear in search results.
//
// Deliberately NOT blocked in robots.txt: a Disallow would stop crawlers from
// reading this noindex, and a URL blocked in robots.txt can still be indexed if
// something links to it. Allowing the crawl so it sees "noindex" is the reliable
// way to keep the page out of the index.
export const metadata = {
  title: "Invoice manager",
  robots: { index: false, follow: false },
};

export default function InvoiceManagerLayout({ children }) {
  return children;
}

// /admin is a "use client" page and can't export metadata itself, so the noindex
// lives here. robots.txt also disallows /admin — belt and braces, since this one
// is staff-only and there's no reason for a crawler to fetch it at all.
export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return children;
}

import Link from "next/link";
import { LogoMark } from "@/components/Logo";

export const metadata = { title: "Page not found", robots: { index: false } };

// Deliberately self-contained: no SiteNav / SiteFooter, and therefore no client
// components. The 404 boundary is rendered on demand for every unknown URL, so
// it must have the smallest possible dependency graph — if this page can't
// render, the request hangs instead of returning a 404.
export default function NotFound() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "40px 24px" }}>
      <div style={{ textAlign: "center", maxWidth: 460 }}>
        <Link href="/" className="logo" style={{ justifyContent: "center", marginBottom: 26, display: "flex" }}>
          <LogoMark /> <span className="wordmark">BillCrafter</span>
        </Link>
        <div style={{ fontSize: 66, fontWeight: 600, letterSpacing: "-.03em", color: "var(--ink)", lineHeight: 1 }}>404</div>
        <h1 style={{ marginTop: 10, fontSize: 24 }}>Page not found</h1>
        <p className="sub" style={{ margin: "10px auto 0", color: "var(--muted)", fontSize: 15 }}>
          The page you’re looking for doesn’t exist or may have moved.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 24, flexWrap: "wrap" }}>
          <Link className="btn btn-solid" href="/">Create an invoice</Link>
          <Link className="btn btn-ghost" href="/templates">Browse templates</Link>
        </div>
        <p style={{ marginTop: 28, fontSize: 12.5, color: "var(--faint)" }}>
          <Link href="/contact" style={{ textDecoration: "underline" }}>Contact support</Link>
        </p>
      </div>
    </main>
  );
}

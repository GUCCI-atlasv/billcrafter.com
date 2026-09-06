import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { RELEASES, LATEST } from "@/lib/changelog";
import { fmtDate } from "@/lib/site";

export const metadata = {
  title: "Changelog",
  description: "What's new in BillCrafter — a running record of features, improvements and fixes to the free invoice generator.",
  alternates: { canonical: "/changelog" },
  openGraph: {
    title: "BillCrafter Changelog",
    description: "A running record of what's new in the free invoice generator.",
    type: "website",
    images: [{ url: `/og?title=${encodeURIComponent("What's new")}&eyebrow=${encodeURIComponent("Changelog")}`, width: 1200, height: 630, alt: "BillCrafter changelog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BillCrafter Changelog",
    description: "A running record of what's new in the free invoice generator.",
    images: [`/og?title=${encodeURIComponent("What's new")}&eyebrow=${encodeURIComponent("Changelog")}`],
  },
};

// Static: the log is edited in the repo, so a redeploy publishes it. (A runtime
// revalidate would force the Cloudflare worker to re-render on demand, which the
// read-only static-assets cache can't persist — see open-next.config.)
export const dynamic = "force-static";

const LABEL = { new: "New", improved: "Improved", fixed: "Fixed" };

export default function Changelog() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "BillCrafter Changelog",
    url: "https://billcrafter.com/changelog",
    description: "A running record of features, improvements and fixes in BillCrafter.",
    ...(LATEST ? { dateModified: LATEST } : {}),
    publisher: { "@id": "https://billcrafter.com/#organization" },
  };

  return (
    <>
      <JsonLd data={schema} />
      <SiteNav />
      <main>
        <section className="hero">
          <div className="wrap" style={{ maxWidth: 760 }}>
            <div className="hero-head">
              <div className="eyebrow">Changelog</div>
              <h1>What&apos;s new in BillCrafter.</h1>
              <p className="sub">
                Every change that reaches the product, newest first. BillCrafter is built by
                CCC STUDIO — if something here doesn&apos;t work the way it reads,{" "}
                <Link href="/contact">tell us</Link>.
              </p>
            </div>
          </div>
        </section>

        <section className="band" style={{ paddingTop: 8 }}>
          <div className="wrap" style={{ maxWidth: 760 }}>
            <ol className="log">
              {RELEASES.map((r) => (
                <li className="log-entry" key={`${r.date}-${r.title}`}>
                  <div className="log-when">
                    <time dateTime={r.date}>{fmtDate(r.date)}</time>
                  </div>
                  <div className="log-body">
                    <h2 className="log-title">{r.title}</h2>
                    <ul className="log-items">
                      {r.items.map(([tag, text]) => (
                        <li key={text}>
                          <span className={`log-tag log-tag--${tag}`}>{LABEL[tag] || tag}</span>
                          <span className="log-text">{text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>

            <p className="muted" style={{ fontSize: 13, marginTop: 34 }}>
              This log starts at launch on July 11, 2026. Earlier design work lived only in the repo.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

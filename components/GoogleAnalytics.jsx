"use client";

// Google Analytics 4. Skipped on routes where it would do harm:
//  - /render/*  headless Chrome loads this to build PDFs and waits for network
//               idle, so a tag there slows every export and counts bot visits;
//  - /i/*       invoice share links — the secret token is in the URL and would
//               be sent to Google as page_location;
//  - /admin     internal.
import Script from "next/script";
import { usePathname } from "next/navigation";

const GA_ID = "G-HXYSH8V2T3";
const SKIP = [/^\/render\//, /^\/i\//, /^\/admin(\/|$)/];

export default function GoogleAnalytics() {
  const path = usePathname() || "/";
  if (SKIP.some((re) => re.test(path))) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}

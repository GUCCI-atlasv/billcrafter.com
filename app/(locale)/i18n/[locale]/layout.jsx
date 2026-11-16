import { notFound } from "next/navigation";
import RootShell, { sharedMetadata, sharedViewport } from "@/components/RootShell";
import { LOCALE_CODES, DEFAULT_LOCALE, isLocale, getLocale } from "@/lib/i18n";

export const metadata = sharedMetadata;
export const viewport = sharedViewport;

export function generateStaticParams() {
  return LOCALE_CODES.filter((c) => c !== DEFAULT_LOCALE).map((locale) => ({ locale }));
}

export const dynamicParams = true;

export default async function LocalizedRootLayout({ children, params }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const loc = getLocale(locale);
  const langTag = loc.hreflang || loc.code || "en";
  return <RootShell lang={langTag}>{children}</RootShell>;
}

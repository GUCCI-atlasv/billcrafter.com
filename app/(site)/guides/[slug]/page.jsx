import { notFound } from "next/navigation";
import GuideArticleView from "@/components/GuideArticleView";
import { GUIDES, getGuide } from "@/lib/guides";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  return {
    title: { absolute: g.metaTitle },
    description: g.metaDescription,
    alternates: { canonical: `/guides/${g.slug}` },
    openGraph: {
      title: g.metaTitle,
      description: g.metaDescription,
      url: `https://billcrafter.com/guides/${g.slug}`,
      type: "article",
      images: [{ url: `/og/${g.slug}.png`, width: 1200, height: 630, alt: g.h1 }],
    },
    twitter: {
      card: "summary_large_image",
      title: g.metaTitle,
      description: g.metaDescription,
      images: [`/og/${g.slug}.png`],
    },
  };
}

export default async function GuideDetailPage({ params }) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();
  return <GuideArticleView guide={g} />;
}

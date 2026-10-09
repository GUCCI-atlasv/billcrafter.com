// Renders a JSON-LD <script> for structured data (Organization, WebSite,
// SoftwareApplication, FAQPage, Article, …). Server-rendered into the HTML so AI
// crawlers and search engines read it without executing JavaScript.
import { AUTHOR, PUBLISHER, SITE_PUBLISHED, SITE_UPDATED } from "@/lib/site";

export default function JsonLd({ data }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here (our own data, no user input in the graph).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Build a schema.org FAQPage from an array of [question, answer] pairs.
export function faqSchema(pairs) {
  if (!pairs || !pairs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pairs.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

// Build a schema.org HowTo from the "how it works" steps. `steps` is
// [title, body, image?][] — image is an absolute or site-relative URL; omit it
// for a step with no screenshot. `name`/`description` head the whole HowTo.
export function howToSchema({ name, description, steps, url, locale = "en" }) {
  if (!steps || !steps.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    ...(description ? { description } : {}),
    ...(url ? { mainEntityOfPage: url } : {}),
    inLanguage: locale,
    step: steps.map(([title, body, image], i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: title,
      text: body,
      ...(image ? { image: image.startsWith("http") ? image : `https://billcrafter.com${image}` } : {}),
    })),
  };
}

// Build a schema.org Article for a content page. Adds the author + publisher +
// datePublished/dateModified that the GEO audit flagged as missing (provenance
// and freshness signals AI engines use to decide whether to cite a page).
export function articleSchema({ headline, description, url }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    ...(description ? { description } : {}),
    ...(url ? { mainEntityOfPage: url, url } : {}),
    author: { "@type": "Person", name: AUTHOR.name, jobTitle: AUTHOR.role, description: AUTHOR.description, url: AUTHOR.url },
    publisher: { "@type": "Organization", name: PUBLISHER, "@id": "https://billcrafter.com/#organization" },
    datePublished: SITE_PUBLISHED,
    dateModified: SITE_UPDATED,
    isAccessibleForFree: true,
    inLanguage: "en",
  };
}

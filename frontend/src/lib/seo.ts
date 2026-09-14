import type { Metadata } from "next";
import { siteConfig } from "@/data/site";
import type { Locale } from "@/types";

interface PageMeta {
  title: string;
  description: string;
  path: string;
  locale?: Locale;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  keywords?: string[];
}

/**
 * Build SEO metadata for a page. `path` should be locale-relative,
 * e.g. "/about". The canonical URL is built from the site URL and,
 * for non-default locales, the locale prefix.
 */
export function buildMetadata({
  title,
  description,
  path,
  locale = "en",
  image,
  type = "website",
  publishedTime,
  keywords,
}: PageMeta): Metadata {
  // Every page is served under a locale prefix (`/en/...`, `/mr/...`); the
  // bare root `/` redirects to `/en`, so canonical + hreflang URLs always
  // include the locale prefix.
  const localized = path === "/" ? `/${locale}` : `/${locale}${path}`;
  const canonicalUrl = `${siteConfig.url}${localized}`;
  const langUrl = (l: "en" | "mr", p: string) =>
    p === "/" ? `${siteConfig.url}/${l}` : `${siteConfig.url}/${l}${p}`;

  const languages: Record<string, string> = {};
  languages[siteConfig.localeDefault] = langUrl(siteConfig.localeDefault, path);
  languages.mr = langUrl("mr", path);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type,
      ...(publishedTime && { publishedTime }),
      ...(image && { images: [{ url: image, width: 1200, height: 630 }] }),
      locale: locale === "mr" ? "mr_IN" : "en_IN",
      siteName: siteConfig.name,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image && { images: [image] }),
    },
  };
}

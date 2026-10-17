import type { Metadata } from "next";
import { siteConfig } from "@/data/site";
import type { Locale, LocalizedText } from "@/types";

interface PageMeta {
  title: string;
  description: string;
  path: string;
  locale?: Locale;
  alternateLocales?: Locale[];
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  keywords?: string[];
}

function normalizePath(path: string): string {
  const pathname = path.split(/[?#]/, 1)[0] || "/";
  const segments = pathname.split("/").filter(Boolean);
  return segments.length ? `/${segments.join("/")}` : "/";
}

export function getLocalizedUrl(path: string, locale: Locale): string {
  const normalizedPath = normalizePath(path);
  return `${siteConfig.url}/${locale}${normalizedPath === "/" ? "" : normalizedPath}`;
}

export function getAvailableLocales(
  ...translations: (LocalizedText | undefined)[]
): Locale[] {
  return siteConfig.locales.filter((locale) =>
    translations.every((translation) => !translation || translation[locale]?.trim()),
  );
}

export function buildMetadata({
  title,
  description,
  path,
  locale = "en",
  alternateLocales = [...siteConfig.locales],
  image,
  type = "website",
  publishedTime,
  keywords,
}: PageMeta): Metadata {
  const canonicalUrl = getLocalizedUrl(path, locale);
  const languages = Object.fromEntries(
    alternateLocales.map((alternateLocale) => [
      alternateLocale,
      getLocalizedUrl(path, alternateLocale),
    ]),
  );
  const localizedSiteName = locale === "mr" ? siteConfig.nameMarathi : siteConfig.name;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title: `${title} | ${localizedSiteName}`,
      description,
      url: canonicalUrl,
      type,
      ...(publishedTime && { publishedTime }),
      ...(image && { images: [{ url: image, width: 1200, height: 630 }] }),
      locale: locale === "mr" ? "mr_IN" : "en_IN",
      siteName: localizedSiteName,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: `${title} | ${localizedSiteName}`,
      description,
      ...(image && { images: [image] }),
    },
  };
}

export function serializeJsonLd(value: Record<string, unknown>): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

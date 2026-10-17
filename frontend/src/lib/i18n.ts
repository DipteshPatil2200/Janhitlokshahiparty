import type { Locale, LocalizedText } from "@/types";
import { siteConfig } from "@/data/site";

export function getLocalizedText(text: LocalizedText | undefined, locale: Locale): string {
  if (!text) return "";
  return text[locale] || text[siteConfig.localeDefault] || "";
}

/**
 * Prepend the locale prefix to a path.
 *
 * Routing strategy: every page lives under `/[lang]` (e.g. `/en/...`,
 * `/mr/...`), and the bare root `/` redirects to the default locale
 * (`/en`). Paths passed here are always un-prefixed (e.g. `/about`,
 * `/news`); this helper returns the fully localized URL.
 */
export function localizePath(path: string, locale: Locale): string {
  if (path === "/") return `/${locale}`;
  // Avoid double-prefixing if the caller already passed a localized path.
  if (path === `/${locale}` || path.startsWith(`/${locale}/`)) return path;
  return `/${locale}${path}`;
}

export function getLocaleFromPath(pathname: string): Locale {
  const first = pathname.split("/")[1] as Locale | undefined;
  if (first && siteConfig.locales.includes(first)) return first;
  return siteConfig.localeDefault;
}

/**
 * Strip the leading locale prefix (e.g. `/en` or `/mr`) to get the
 * canonical, un-prefixed path. Every route is localized, so the prefix is
 * always removed when present.
 */
export function stripLocalePrefix(pathname: string): string {
  const locale = getLocaleFromPath(pathname);
  const prefix = `/${locale}`;
  if (locale && (pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return pathname.slice(prefix.length) || "/";
  }
  return pathname;
}

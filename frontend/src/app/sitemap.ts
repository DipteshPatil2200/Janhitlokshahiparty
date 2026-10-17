import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import { getSitemapContent } from "@/lib/api";
import {
  getAvailableLocales,
  getLocalizedUrl,
} from "@/lib/seo";
import type { Locale } from "@/types";

export const dynamic = "force-dynamic";

const staticPaths = [
  "/",
  "/about",
  "/leadership",
  "/vision",
  "/organization",
  "/news",
  "/campaigns",
  "/events",
  "/gallery",
  "/videos",
  "/documents",
  "/join-us",
  "/volunteer",
  "/donation",
  "/contact",
  "/privacy",
  "/terms",
  "/disclaimer",
];

interface SitemapRoute {
  path: string;
  locales: Locale[];
}

function localizedAlternates(
  route: SitemapRoute,
): NonNullable<MetadataRoute.Sitemap[number]["alternates"]> {
  return {
    languages: Object.fromEntries(
      route.locales.map((locale) => [locale, getLocalizedUrl(route.path, locale)]),
    ),
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { news, leaders, campaigns, events, galleries } = await getSitemapContent();

  const routes: SitemapRoute[] = staticPaths.map((path) => ({
    path,
    locales: [...siteConfig.locales],
  }));

  routes.push(
    ...news.map((item) => ({
      path: `/news/${item.slug}`,
      locales: getAvailableLocales(item.title),
    })),
    ...leaders.map((leader) => ({
      path: `/leadership/${leader.slug}`,
      locales: getAvailableLocales(leader.name),
    })),
    ...campaigns.map((campaign) => ({
      path: `/campaigns/${campaign.slug}`,
      locales: getAvailableLocales(campaign.title),
    })),
    ...galleries.map((album) => ({
      path: `/gallery/${album.slug}`,
      locales: getAvailableLocales(album.title),
    })),
    ...events.map((event) => ({
      path: `/events/${event.slug}`,
      locales: getAvailableLocales(event.title),
    })),
  );

  const uniqueRoutes = new Map(routes.map((route) => [route.path, route]));
  return Array.from(uniqueRoutes.values()).flatMap((route) =>
    route.locales.map((locale: Locale) => ({
      url: getLocalizedUrl(route.path, locale),
      alternates: localizedAlternates(route),
    })),
  );
}

import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import { getNewsListSafe } from "@/data/news";
import { getLeaders } from "@/data/leaders";
import { getCampaigns } from "@/data/campaigns";
import { getGalleryAlbums } from "@/data/gallery";
import { getEvents } from "@/data/campaigns";

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Dynamic detail slugs (best-effort; safe fns never throw).
  const [news, leaders, campaigns, albums, events] = await Promise.all([
    getNewsListSafe(500),
    getLeaders(),
    getCampaigns(),
    getGalleryAlbums(),
    getEvents(),
  ]);

  const detailPaths: string[] = [
    ...news.map((n) => `/news/${n.slug}`),
    ...leaders.map((l) => `/leadership/${l.slug}`),
    ...campaigns.map((c) => `/campaigns/${c.slug}`),
    ...albums.map((a) => `/gallery/${a.slug}`),
    ...events.map((e) => `/events/${e.slug}`),
  ];

  const allPaths = [...staticPaths, ...detailPaths];

  const localizedUrl = (locale: "en" | "mr", p: string) =>
    p === "/" ? `${siteConfig.url}/${locale}` : `${siteConfig.url}/${locale}${p}`;

  const entries = allPaths.flatMap((path) => {
    const entry = (locale: "en" | "mr"): MetadataRoute.Sitemap[number] => ({
      url: localizedUrl(locale, path),
      lastModified: now,
      changeFrequency: "weekly",
      priority: path === "/" ? 1 : path.startsWith("/news/") ? 0.7 : 0.8,
    });
    return [entry("en"), entry("mr")];
  });

  return entries;
}

import type { NewsItem, NewsCategory } from "@/types";
import { getNews, getNewsBySlug as apiGetNewsBySlug } from "@/lib/api";

const categoryLabels: Record<NewsCategory, string> = {
  "press-release": "Press Release",
  statement: "Statement",
  event: "Event",
  update: "Update",
};

export function getCategoryLabel(category: NewsCategory): string {
  return categoryLabels[category];
}

export async function getNewsList(count = 50): Promise<NewsItem[]> {
  const items = await getNews();
  return items.slice(0, count);
}

export async function getNewsListSafe(count = 50): Promise<NewsItem[]> {
  try {
    return await getNewsList(count);
  } catch {
    return [];
  }
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | undefined> {
  try {
    return await apiGetNewsBySlug(slug);
  } catch {
    return undefined;
  }
}
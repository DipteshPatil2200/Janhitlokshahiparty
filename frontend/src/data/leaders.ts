import type { Leader } from "@/types";
import {
  getLeaders as apiGetLeaders,
  getLeaderBySlug as apiGetLeaderBySlug,
} from "@/lib/api";

export async function getLeaders(): Promise<Leader[]> {
  try {
    return await apiGetLeaders();
  } catch {
    return [];
  }
}

export async function getLeaderBySlug(slug: string): Promise<Leader | undefined> {
  try {
    return await apiGetLeaderBySlug(slug);
  } catch {
    return undefined;
  }
}

export async function getFeaturedLeaders(count?: number): Promise<Leader[]> {
  const all = await getLeaders();
  const featured = all.filter((l) => l.featured);
  const sorted = featured.length ? featured : all;
  return (count ? sorted.slice(0, count) : sorted).sort((a, b) => a.order - b.order);
}
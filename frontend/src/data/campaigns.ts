import type { Campaign, EventItem } from "@/types";
import {
  getCampaigns as apiGetCampaigns,
  getCampaignBySlug as apiGetCampaignBySlug,
  mapCampaign,
  getEvents as apiGetEvents,
  getEventBySlug,
} from "@/lib/api";

export async function getCampaigns(): Promise<Campaign[]> {
  try {
    return await apiGetCampaigns();
  } catch {
    return [];
  }
}

export async function getCampaignBySlug(slug: string): Promise<Campaign | undefined> {
  try {
    return mapCampaign(await apiGetCampaignBySlug(slug));
  } catch {
    return undefined;
  }
}

export async function getEvents(): Promise<EventItem[]> {
  try {
    return await apiGetEvents();
  } catch {
    return [];
  }
}

export async function getEventDetails(slug: string): Promise<EventItem | undefined> {
  try {
    return await getEventBySlug(slug);
  } catch {
    return undefined;
  }
}

export async function getUpcomingEvents(): Promise<EventItem[]> {
  const all = await getEvents();
  return all
    .filter((e) => e.status === "upcoming")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
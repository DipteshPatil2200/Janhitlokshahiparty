import type { GalleryAlbum, GalleryCategory, VideoItem, DocumentItem } from "@/types";
import {
  getGalleries,
  getGalleryBySlug as apiGetGalleryBySlug,
  getVideos as apiGetVideos,
  getDocuments as apiGetDocuments,
} from "@/lib/api";

export const galleryCategories: GalleryCategory[] = [
  { slug: "events", title: { en: "Events", mr: "कार्यक्रम" } },
  { slug: "campaigns", title: { en: "Campaigns", mr: "मोहिमा" } },
  { slug: "meetings", title: { en: "Meetings", mr: "सभा" } },
];

export async function getGalleryAlbums(): Promise<GalleryAlbum[]> {
  try {
    return await getGalleries();
  } catch {
    return [];
  }
}

export async function getGalleryAlbumBySlug(slug: string): Promise<GalleryAlbum | undefined> {
  try {
    return await apiGetGalleryBySlug(slug);
  } catch {
    return undefined;
  }
}

export async function getVideos(): Promise<VideoItem[]> {
  try {
    return await apiGetVideos();
  } catch {
    return [];
  }
}

export async function getDocuments(): Promise<DocumentItem[]> {
  try {
    return await apiGetDocuments();
  } catch {
    return [];
  }
}
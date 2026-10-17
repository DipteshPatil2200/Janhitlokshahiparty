import { adminFetch } from "./admin";

export type CollectionId =
  | "news"
  | "leaders"
  | "campaigns"
  | "events"
  | "videos"
  | "documents"
  | "organization"
  | "social-links";

export const COLLECTION_ENDPOINT: Record<CollectionId, string> = {
  news: "/news",
  leaders: "/leaders",
  campaigns: "/campaigns",
  events: "/events",
  videos: "/videos",
  documents: "/documents",
  organization: "/organization",
  "social-links": "/social-links",
};

/** Strip Mongo/system fields before sending to the backend. */
export function toPayload(doc: any): any {
  const { id, _id, createdAt, updatedAt, __v, ...rest } = doc || {};
  return rest;
}

export async function listCollection<T = any>(c: CollectionId): Promise<T[]> {
  const data = await adminFetch<{ items: T[] }>(
    `${COLLECTION_ENDPOINT[c]}?limit=100&sort=createdAt`
  );
  return data.items || [];
}

export async function createCollection(c: CollectionId, body: any): Promise<any> {
  return adminFetch(COLLECTION_ENDPOINT[c], {
    method: "POST",
    body: JSON.stringify(toPayload(body)),
  });
}

export async function updateCollection(
  c: CollectionId,
  id: string,
  body: any
): Promise<any> {
  return adminFetch(`${COLLECTION_ENDPOINT[c]}/${id}`, {
    method: "PUT",
    body: JSON.stringify(toPayload(body)),
  });
}

export async function deleteCollection(c: CollectionId, id: string): Promise<void> {
  await adminFetch(`${COLLECTION_ENDPOINT[c]}/${id}`, { method: "DELETE" });
}

export interface DashboardStats {
  counts: {
    news: number;
    leaders: number;
    campaigns: number;
    events: number;
    gallery: number;
    videos: number;
    documents: number;
    joins: number;
    volunteers: number;
    contacts: number;
  };
  pending: {
    pendingJoins: number;
    pendingVolunteers: number;
    unreadContacts: number;
  };
}

export function getDashboardStats(): Promise<DashboardStats> {
  return adminFetch<DashboardStats>("/dashboard/stats");
}
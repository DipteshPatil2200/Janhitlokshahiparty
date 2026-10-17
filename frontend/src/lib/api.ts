import type {
  NewsItem,
  Leader,
  Campaign,
  EventItem,
  GalleryAlbum,
  VideoItem,
  DocumentItem,
  OrgNode,
  BankDetails,
  LocalizedText,
  SocialLink,
  ContactInfo,
} from "@/types";

/** Base URL of the REST backend. Overridable via env. */
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export class ApiError extends Error {
  status: number;
  details?: string[];
  constructor(status: number, message: string, details?: string[]) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
      cache: "no-store",
    });
  } catch (e) {
    throw new ApiError(
      0,
      "Unable to reach the server. Please check that the backend API is running."
    );
  }
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    let details: string[] | undefined;
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
      if (Array.isArray(data?.details)) details = data.details;
    } catch {
      /* ignore */
    }
    throw new ApiError(res.status, message, details);
  }
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => fetchJson<T>(path),
  post: <T>(path: string, body: unknown) =>
    fetchJson<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    fetchJson<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    fetchJson<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  del: <T>(path: string) => fetchJson<T>(path, { method: "DELETE" }),
};

// =============================================================
// TYPES from the backend API (matching Mongoose documents)
// =============================================================

export interface ApiLocalized {
  en?: string;
  mr?: string;
}

export interface ApiNews extends ApiLocalizedMaybe {
  _id: string;
  slug: string;
  title: ApiLocalized;
  excerpt?: ApiLocalized;
  content: ApiLocalized;
  category?: string;
  coverImage?: string;
  publishedAt?: string;
  author?: string;
  source?: string;
  featured?: boolean;
  tags?: string[];
}

export type ApiLocalizedMaybe = Record<string, unknown>;

export interface ApiLeader {
  _id: string;
  slug: string;
  name: ApiLocalized;
  designation?: ApiLocalized;
  bio?: ApiLocalized;
  photo?: string;
  order?: number;
  featured?: boolean;
  isActive?: boolean;
}

export interface ApiCampaign {
  _id: string;
  slug: string;
  title: ApiLocalized;
  description?: ApiLocalized;
  image?: string;
  objectives?: ApiLocalized[];
  status?: string;
  featured?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface ApiEvent {
  _id: string;
  slug: string;
  title: ApiLocalized;
  description?: ApiLocalized;
  image?: string;
  date: string;
  status?: string;
  location?: ApiLocalized;
  featured?: boolean;
}

export interface ApiGallery {
  _id: string;
  slug: string;
  title: ApiLocalized;
  description?: ApiLocalized;
  coverImage?: string;
  category?: string;
  createdAt?: string;
  images?: { _id: string; url: string; caption?: string; alt?: string; order?: number }[];
}

export interface ApiVideo {
  _id: string;
  youtubeId: string;
  title: ApiLocalized;
  description?: ApiLocalized;
  category?: string;
  thumbnail?: string;
  featured?: boolean;
  publishedAt?: string;
}

export interface ApiDocument {
  _id: string;
  slug: string;
  title: ApiLocalized;
  description?: ApiLocalized;
  category?: string;
  fileUrl?: string;
  fileSize?: number;
  publishedAt?: string;
}

export interface ApiOrgUnit {
  _id: string;
  name: ApiLocalized;
  slug: string;
  type: string;
  parentId?: string | null;
  inChargeName?: string;
  children?: ApiOrgUnit[];
}

export interface ApiDonation {
  heading?: ApiLocalized;
  intro?: ApiLocalized;
  qrImage?: string;
  upiId?: string;
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
  branch?: string;
  ifsc?: string;
  chequeImage?: string;
  instructions?: { en?: string[]; mr?: string[] };
}

export interface ApiSiteSettings {
  siteName?: ApiLocalized;
  tagline?: ApiLocalized;
  announcement?: ApiLocalized;
  announcementEnabled?: boolean;
  contactPhone?: string;
  contactEmail?: string;
  address?: ApiLocalized;
  heroTitle?: ApiLocalized;
  heroSubtitle?: ApiLocalized;
  heroImage?: string;
  about?: ApiLocalized;
  aboutImage?: string;
  vision?: { en?: string[]; mr?: string[] };
  mission?: { en?: string[]; mr?: string[] };
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
}

export interface ApiBundle {
  settings: ApiSiteSettings;
  donation?: ApiDonation;
  socials?: { platform: string; url: string }[];
  featuredNews?: ApiNews[];
  latestNews?: ApiNews[];
  featuredLeaders?: ApiLeader[];
  campaigns?: ApiCampaign[];
  upcomingEvents?: ApiEvent[];
  featuredVideos?: ApiVideo[];
  galleries?: ApiGallery[];
  pastEvents?: ApiEvent[];
}

// =============================================================
// Mappers: backend → frontend types
// =============================================================

export function lt(v: ApiLocalized | undefined, fallback = ""): LocalizedText {
  return { en: v?.en || fallback, mr: v?.mr || fallback };
}

const CATEGORY_MAP: Record<string, string> = {
  announcement: "update",
  event: "event",
  "press-release": "press-release",
  statement: "statement",
  policy: "update",
  youth: "update",
  organizational: "update",
};

export function mapNews(n: ApiNews): NewsItem {
  return {
    slug: n.slug,
    title: lt(n.title),
    category: (CATEGORY_MAP[(n.category || "").toLowerCase()] || "update") as
      | "press-release"
      | "statement"
      | "event"
      | "update",
    date: n.publishedAt || new Date().toISOString(),
    featuredImage: n.coverImage || undefined,
    excerpt: lt(n.excerpt),
    content: lt(n.content),
    tags: n.tags || [],
    author: { en: n.author || "", mr: n.author || "" },
    source: { en: n.source || "", mr: n.source || "" },
  };
}

export function mapLeader(l: ApiLeader): Leader {
  return {
    slug: l.slug,
    name: lt(l.name),
    designation: lt(l.designation),
    photo: l.photo || "",
    bio: lt(l.bio),
    order: l.order ?? 0,
    featured: !!l.featured,
  };
}

export function mapCampaign(c: ApiCampaign): Campaign {
  return {
    slug: c.slug,
    title: lt(c.title),
    tagline: lt(c.title),
    description: lt(c.description),
    image: c.image || undefined,
    status: (["active", "upcoming", "planned", "completed"].includes(c.status || "")
      ? c.status
      : "active") as Campaign["status"],
  };
}

export function mapEvent(e: ApiEvent): EventItem {
  return {
    slug: e.slug,
    title: lt(e.title),
    description: lt(e.description),
    date: e.date,
    location: lt(e.location) || undefined,
    image: e.image || undefined,
    status: (e.status === "past" ? "completed" : "upcoming") as EventItem["status"],
  };
}

function isLikelyImage(url?: string): boolean {
  if (!url) return false;
  // Heuristic: a real image URL usually ends in an image extension, or is a
  // local/public upload (which the backend serves with a real file). A bare
  // social-page link (e.g. facebook.com/photo?=...) is NOT an image.
  if (/\.(jpe?g|png|webp|gif|avif|svg)(\?|$)/i.test(url)) return true;
  // Backend uploads are served under /api/uploads/ (absolute or relative).
  return /\/api\/uploads\//i.test(url) || url.startsWith("/uploads/");
}

export function mapAlbum(g: ApiGallery): GalleryAlbum {
  const stored = (g.images || [])
    .map((i) => i.url)
    .filter((u): u is string => typeof u === "string" && u.length > 0);
  const coverUrl = isLikelyImage(g.coverImage) ? g.coverImage : stored[0];
  return {
    slug: g.slug,
    title: lt(g.title),
    category: g.category || "General",
    date: g.createdAt || new Date().toISOString(),
    cover: coverUrl || undefined,
    description: lt(g.description),
    images: (g.images || []).map((i) => ({
      src: i.url,
      alt: { en: i.alt || i.caption || "", mr: i.alt || i.caption || "" },
    })),
  };
}

export function mapVideo(v: ApiVideo): VideoItem {
  return {
    id: v._id,
    title: lt(v.title),
    description: lt(v.description),
    youtubeId: v.youtubeId,
    thumbnail: v.thumbnail || undefined,
    date: v.publishedAt,
  };
}

export function mapDocument(d: ApiDocument): DocumentItem {
  const sizeMB = d.fileSize ? `${(d.fileSize / 1024 / 1024).toFixed(1)} MB` : "";
  return {
    slug: d.slug,
    title: lt(d.title),
    type: d.category || "Document",
    size: sizeMB || undefined,
    url: d.fileUrl || "",
    date: d.publishedAt,
  };
}

export function mapBank(d: ApiDonation | undefined): BankDetails {
  return {
    accountName: d?.accountName || "",
    accountNumber: d?.accountNumber || "",
    bankName: d?.bankName || "",
    branch: d?.branch || "",
    ifsc: d?.ifsc || "",
    upiId: d?.upiId || "",
    qrImage: d?.qrImage || "",
    chequeImage: d?.chequeImage || "",
    instructions:
      (d?.instructions?.en || []).map((x, i) => ({
        en: x,
        mr: d?.instructions?.mr?.[i] || "",
      })) || [],
  };
}

export function mapOrgTree(tree: ApiOrgUnit[]): OrgNode[] {
  return tree.map((u) => ({
    name: lt(u.name),
    level: u.type,
    description: { en: u.inChargeName || "", mr: u.inChargeName || "" },
    children: u.children ? mapOrgTree(u.children) : undefined,
  }));
}

export function mapSocials(
  socials?: { platform: string; url: string }[],
  settings?: ApiSiteSettings
): SocialLink[] {
  const list: SocialLink[] = (socials || [])
    .filter((s) => s?.url && s.url !== "#")
    .map((s) => ({
      platform: (["facebook", "twitter", "instagram", "youtube", "telegram", "whatsapp"].includes(
        s.platform
      )
        ? s.platform
        : "facebook") as SocialLink["platform"],
      label: s.platform.charAt(0).toUpperCase() + s.platform.slice(1),
      href: s.url || "#",
    }));
  if (settings?.facebookUrl && settings.facebookUrl !== "#") list.push({ platform: "facebook", label: "Facebook", href: settings.facebookUrl });
  if (settings?.twitterUrl && settings.twitterUrl !== "#") list.push({ platform: "twitter", label: "X", href: settings.twitterUrl });
  if (settings?.instagramUrl && settings.instagramUrl !== "#") list.push({ platform: "instagram", label: "Instagram", href: settings.instagramUrl });
  if (settings?.youtubeUrl && settings.youtubeUrl !== "#") list.push({ platform: "youtube", label: "YouTube", href: settings.youtubeUrl });
  return list;
}

export function mapContact(settings: ApiSiteSettings): ContactInfo {
  return {
    phone: settings.contactPhone || "",
    email: settings.contactEmail || "",
    address: lt(settings.address),
  };
}

// =============================================================
// Public data fetchers (used by Server Components & client views)
// =============================================================

export async function getSiteSettings(): Promise<ApiSiteSettings> {
  return api.get<ApiSiteSettings>("/site-settings");
}

export async function getPublicBundle(): Promise<ApiBundle> {
  return api.get<ApiBundle>("/public/bundle");
}

export async function getNews(): Promise<NewsItem[]> {
  const data = await api.get<{ items: ApiNews[] }>("/news?limit=50");
  return data.items.map(mapNews);
}

export async function getNewsBySlug(slug: string): Promise<NewsItem> {
  const n = await api.get<ApiNews>(`/news/${slug}`);
  return mapNews(n);
}

export async function getLeaders(): Promise<Leader[]> {
  const data = await api.get<{ items: ApiLeader[] }>("/leaders?limit=100");
  return data.items
    .filter((l) => l.isActive !== false)
    .map(mapLeader)
    .sort((a, b) => a.order - b.order);
}

export async function getLeaderBySlug(slug: string): Promise<Leader> {
  const l = await api.get<ApiLeader>(`/leaders/${slug}`);
  return mapLeader(l);
}

export async function getCampaigns(): Promise<Campaign[]> {
  const data = await api.get<{ items: ApiCampaign[] }>("/campaigns?limit=100");
  return data.items.map(mapCampaign);
}

export async function getCampaignBySlug(slug: string): Promise<ApiCampaign> {
  return api.get<ApiCampaign>(`/campaigns/${slug}`);
}

export async function getEvents(): Promise<EventItem[]> {
  const data = await api.get<{ items: ApiEvent[] }>("/events?limit=100");
  return data.items.map(mapEvent);
}

export async function getEventBySlug(slug: string): Promise<EventItem> {
  const e = await api.get<ApiEvent>(`/events/${slug}`);
  return mapEvent(e);
}

export async function getGalleries(): Promise<GalleryAlbum[]> {
  const data = await api.get<{ items: ApiGallery[] }>("/gallery?withImages=true");
  return data.items.map(mapAlbum);
}

export async function getGalleryBySlug(slug: string): Promise<GalleryAlbum> {
  const data = await api.get<{ gallery: ApiGallery; images: any[] }>(`/gallery/${slug}`);
  return mapAlbum({ ...data.gallery, images: data.images });
}

export async function getVideos(): Promise<VideoItem[]> {
  const data = await api.get<{ items: ApiVideo[] }>("/videos?limit=100");
  return data.items.map(mapVideo);
}

export async function getDocuments(): Promise<DocumentItem[]> {
  const data = await api.get<{ items: ApiDocument[] }>("/documents?limit=100");
  return data.items.map(mapDocument);
}

export async function getOrgTree(): Promise<OrgNode[]> {
  const data = await api.get<{ tree: ApiOrgUnit[] }>("/organization/tree");
  return mapOrgTree(data.tree);
}

export async function getDonationSettings(): Promise<BankDetails> {
  const d = await api.get<ApiDonation>("/donation-settings");
  return mapBank(d);
}

// =============================================================
// Form submissions (public POST)
// =============================================================

export interface SubmissionResult {
  ok: boolean;
  id?: string;
  error?: string;
}

async function postForm<T extends { ok: boolean; id?: string; error?: string }>(
  path: string,
  body: Record<string, unknown>
): Promise<T> {
  try {
    const d = await api.post<{ _id: string }>(path, body);
    return { ok: true, id: String(d._id) } as T;
  } catch (e) {
    const err = e instanceof ApiError ? e.message : "Something went wrong";
    return { ok: false, error: err } as T;
  }
}

export function submitJoinRequest(body: Record<string, unknown>): Promise<SubmissionResult> {
  return postForm("/join-requests", body);
}

export function submitVolunteerRequest(body: Record<string, unknown>): Promise<SubmissionResult> {
  return postForm("/volunteer-requests", body);
}

export function submitContactMessage(body: Record<string, unknown>): Promise<SubmissionResult> {
  return postForm("/contact-messages", body);
}
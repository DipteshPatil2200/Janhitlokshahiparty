// =============================================================
// CONTENT MODEL TYPES
// -------------------------------------------------------------
// These types mirror what an admin/CMS would provide later.
// The frontend reads ONLY from these types via the /data layer,
// so swapping static files for a database/API requires no UI changes.
// =============================================================

export type Locale = "en" | "mr";

export interface LocalizedText {
  en: string;
  mr: string;
}

export interface Seo {
  title: string;
  description: string;
  keywords?: string[];
}

export interface NavItem {
  label: LocalizedText;
  href: string;
  items?: { label: LocalizedText; href: string }[];
}

export interface Announcement {
  enabled: boolean;
  text: LocalizedText;
  href?: string;
}

export interface SocialLink {
  platform: "facebook" | "twitter" | "instagram" | "youtube" | "telegram" | "whatsapp";
  label: string;
  href: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: LocalizedText;
  workingHours?: LocalizedText;
}

export interface Leader {
  slug: string;
  name: LocalizedText;
  designation: LocalizedText;
  photo: string;
  bio: LocalizedText;
  order: number;
  featured?: boolean;
  socials?: { label: string; href: string }[];
}

export type NewsCategory = "press-release" | "statement" | "event" | "update";

export interface NewsItem {
  slug: string;
  title: LocalizedText;
  category: NewsCategory;
  date: string; // ISO
  featuredImage?: string;
  excerpt: LocalizedText;
  content: LocalizedText; // markdown-ish plain text
  tags?: string[];
  author?: LocalizedText;
  source?: LocalizedText;
}

export interface Campaign {
  slug: string;
  title: LocalizedText;
  tagline: LocalizedText;
  description: LocalizedText;
  image?: string;
  status: "active" | "upcoming" | "planned" | "completed";
  cta?: { label: LocalizedText; href: string };
}

export interface EventItem {
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  date: string; // ISO
  location?: LocalizedText;
  image?: string;
  status: "upcoming" | "completed";
}

export interface OrgNode {
  name: LocalizedText;
  level: string;
  description?: LocalizedText;
  children?: OrgNode[];
}

export interface GalleryCategory {
  slug: string;
  title: LocalizedText;
}

export interface GalleryAlbum {
  slug: string;
  title: LocalizedText;
  category: string;
  date: string;
  cover?: string;
  description?: LocalizedText;
  images: { src: string; alt: LocalizedText }[];
}

export interface VideoItem {
  id: string;
  title: LocalizedText;
  description?: LocalizedText;
  youtubeId: string;
  thumbnail?: string;
  date?: string;
}

export interface DocumentItem {
  slug: string;
  title: LocalizedText;
  type: string;
  size?: string;
  url: string;
  date?: string;
}

export interface BankDetails {
  accountName: string;
  accountNumber: string;
  bankName: string;
  branch: string;
  ifsc: string;
  upiId: string;
  qrImage?: string;
  chequeImage?: string;
  instructions: LocalizedText[];
}

export type VolunteerCategoryId =
  | "digital"
  | "social-media"
  | "ground"
  | "event"
  | "youth";

export interface VolunteerCategory {
  id: VolunteerCategoryId;
  name: LocalizedText;
  description: LocalizedText;
}

// Mirrors the backend SiteSettings document (models/SiteSettings.ts).
// All public values are optional so pages fall back to static config.
export interface SiteSettings {
  siteName?: LocalizedText;
  tagline?: LocalizedText;
  announcement?: LocalizedText;
  announcementEnabled?: boolean;
  logo?: string;
  contactPhone?: string;
  contactEmail?: string;
  address?: LocalizedText;
  mapEmbedUrl?: string;
  heroTitle?: LocalizedText;
  heroSubtitle?: LocalizedText;
  heroImage?: string;
  about?: LocalizedText;
  aboutImage?: string;
  vision?: { en?: string[]; mr?: string[] };
  mission?: { en?: string[]; mr?: string[] };
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
}

export interface ResolvedSiteSettings {
  settings: SiteSettings;
  siteName: LocalizedText;
  tagline: LocalizedText;
  description: LocalizedText;
  logo?: string;
}

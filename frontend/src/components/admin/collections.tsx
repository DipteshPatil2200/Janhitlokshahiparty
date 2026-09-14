import type { AdminField } from "./resource-admin";
import type { CollectionId } from "../../lib/admin-crud";

export type Role =
  | "super_admin"
  | "content_manager"
  | "media_manager"
  | "organization_manager";

export interface CollectionSpec {
  id: CollectionId;
  label: string;
  singular: string;
  roles: Role[];
  fields: AdminField[];
  viewBase?: string; // public preview base path, e.g. "en/news"
}

const t = (
  key: string,
  label: string,
  opts: Omit<Partial<AdminField>, "kind" | "key" | "label"> = {},
): AdminField => ({ kind: "text", key, label, ...opts });

const local = (
  key: string,
  label: string,
  as?: "text" | "textarea",
): AdminField =>
  ({ kind: "localized", key, label, ...(as ? { as } : {}) }) as AdminField;

const img = (key: string, label: string): AdminField =>
  ({ kind: "image", key, label }) as AdminField;

const bool = (key: string, label: string): AdminField =>
  ({ kind: "boolean", key, label }) as AdminField;

export const COLLECTIONS: CollectionSpec[] = [
  {
    id: "news",
    label: "News",
    singular: "News item",
    roles: ["content_manager"],
    viewBase: "en/news",
    fields: [
      { ...local("title", "Title"), inList: true },
      t("slug", "Slug"),
      t("category", "Category"),
      { ...img("coverImage", "Cover image"), inList: true },
      t("author", "Author"),
      t("source", "Source"),
      t("publishedAt", "Published date (ISO)"),
      local("excerpt", "Excerpt", "textarea"),
      local("content", "Content", "textarea"),
      bool("isPublished", "Published"),
      bool("featured", "Featured"),
      { kind: "tags", key: "tags", label: "Tags (comma separated)" },
    ],
  },
  {
    id: "leaders",
    label: "Leadership",
    singular: "Leader",
    roles: ["content_manager"],
    viewBase: "en/leadership",
    fields: [
      { ...local("name", "Name"), inList: true },
      t("slug", "Slug"),
      local("designation", "Designation"),
      { ...img("photo", "Photo"), inList: true },
      { kind: "number", key: "order", label: "Display order" },
      { ...t("contact", "Contact"), inList: false },
      bool("isActive", "Active"),
      bool("featured", "Featured"),
      local("bio", "Bio", "textarea"),
    ],
  },
  {
    id: "campaigns",
    label: "Campaigns",
    singular: "Campaign",
    roles: ["content_manager"],
    viewBase: "en/campaigns",
    fields: [
      { ...local("title", "Title"), inList: true },
      t("slug", "Slug"),
      {
        kind: "select",
        key: "status",
        label: "Status",
        options: ["active", "completed", "planned"],
      },
      { ...img("image", "Image"), inList: true },
      t("startDate", "Start date (ISO)"),
      t("endDate", "End date (ISO)"),
      local("description", "Description", "textarea"),
      { kind: "localizedList", key: "objectives", label: "Objectives" },
      { kind: "localizedList", key: "updates", label: "Updates" },
      bool("isPublished", "Published"),
      bool("featured", "Featured"),
    ],
  },
  {
    id: "events",
    label: "Events",
    singular: "Event",
    roles: ["content_manager"],
    viewBase: "en/events",
    fields: [
      { ...local("title", "Title"), inList: true },
      t("slug", "Slug"),
      {
        kind: "select",
        key: "status",
        label: "Status",
        options: ["upcoming", "past"],
      },
      t("date", "Date (ISO)"),
      t("startTime", "Start time"),
      t("endTime", "End time"),
      { ...img("image", "Image"), inList: true },
      local("location", "Location"),
      local("description", "Description", "textarea"),
      bool("isPublished", "Published"),
    ],
  },
  {
    id: "videos",
    label: "Videos",
    singular: "Video",
    roles: ["content_manager"],
    viewBase: "en/videos",
    fields: [
      { ...local("title", "Title"), inList: true },
      t("youtubeId", "YouTube ID"),
      { ...img("thumbnail", "Thumbnail"), inList: true },
      t("category", "Category"),
      t("publishedAt", "Published date (ISO)"),
      local("description", "Description", "textarea"),
      bool("isPublished", "Published"),
      bool("featured", "Featured"),
    ],
  },
  {
    id: "documents",
    label: "Documents",
    singular: "Document",
    roles: ["content_manager"],
    viewBase: "en/documents",
    fields: [
      { ...local("title", "Title"), inList: true },
      t("slug", "Slug"),
      t("category", "Category"),
      t("fileUrl", "File URL"),
      { kind: "number", key: "fileSize", label: "File size (bytes)" },
      t("publishedAt", "Published date (ISO)"),
      local("description", "Description", "textarea"),
      bool("isPublished", "Published"),
    ],
  },
  {
    id: "organization",
    label: "Organization",
    singular: "Unit",
    roles: ["organization_manager"],
    viewBase: "en/organization",
    fields: [
      { ...local("name", "Name"), inList: true },
      t("slug", "Slug"),
      {
        kind: "select",
        key: "type",
        label: "Type",
        options: [
          "state",
          "division",
          "district",
          "assembly",
          "taluka",
          "local",
        ],
      },
      { ...t("inChargeName", "In charge"), inList: true },
      t("parentId", "Parent ID"),
    ],
  },
  {
    id: "social-links",
    label: "Social Links",
    singular: "Link",
    roles: ["media_manager"],
    fields: [
      {
        kind: "select",
        key: "platform",
        label: "Platform",
        options: [
          "facebook",
          "twitter",
          "instagram",
          "youtube",
          "telegram",
          "whatsapp",
        ],
      },
      t("url", "URL"),
      { ...t("order", "Order"), kind: "number" as const },
    ],
  },
];

const ROLES_ANY: Role[] = [
  "super_admin",
  "content_manager",
  "media_manager",
  "organization_manager",
];

function hasRole(spec: { roles: Role[]; id: string }, role: Role): boolean {
  if (role === "super_admin") return true;
  return spec.roles.includes(role);
}

export function canViewCollection(
  id: CollectionId,
  role: Role | undefined,
): boolean {
  const spec = COLLECTIONS.find((c) => c.id === id);
  if (!spec) return false;
  return hasRole(spec, role || "super_admin");
}

export function allowedCollectionSpecs(
  role: Role | undefined,
): CollectionSpec[] {
  return COLLECTIONS.filter((c) => hasRole(c, role || "super_admin"));
}

export { ROLES_ANY };

export type { AdminField };

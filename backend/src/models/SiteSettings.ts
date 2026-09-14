import { Schema, model, models, InferSchemaType } from "mongoose";
import { localizedSchema } from "./common";

/**
 * Single-document site-wide settings: branding, contact info,
 * announcement bar, social links, addresses, map embed, etc.
 */
export const siteSettingsSchema = new Schema(
  {
    siteName: { type: localizedSchema, default: () => ({ en: "Janhit Lokshahi Party", mr: "जनहित लोकशाही पक्ष" }) },
    tagline: { type: localizedSchema, default: () => ({ en: "", mr: "" }) },
    announcement: { type: localizedSchema, default: () => ({ en: "", mr: "" }) },
    announcementEnabled: { type: Boolean, default: false },
    logo: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    contactEmail: { type: String, default: "" },
    address: { type: localizedSchema, default: () => ({ en: "", mr: "" }) },
    mapEmbedUrl: { type: String, default: "" },
    heroTitle: { type: localizedSchema, default: () => ({ en: "", mr: "" }) },
    heroSubtitle: { type: localizedSchema, default: () => ({ en: "", mr: "" }) },
    heroImage: { type: String, default: "" },
    about: { type: localizedSchema, default: () => ({ en: "", mr: "" }) },
    vision: {
      type: new Schema(
        {
          en: { type: [String], default: [] },
          mr: { type: [String], default: [] },
        },
        { _id: false }
      ),
      default: () => ({ en: [], mr: [] }),
    },
    mission: {
      type: new Schema(
        {
          en: { type: [String], default: [] },
          mr: { type: [String], default: [] },
        },
        { _id: false }
      ),
      default: () => ({ en: [], mr: [] }),
    },
    facebookUrl: { type: String, default: "" },
    twitterUrl: { type: String, default: "" },
    instagramUrl: { type: String, default: "" },
    youtubeUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export type SiteSettingsDoc = InferSchemaType<typeof siteSettingsSchema> & { _id: unknown };

export const SiteSettings = models.SiteSettings || model("SiteSettings", siteSettingsSchema);

export async function getSiteSettings() {
  let s = await SiteSettings.findOne().lean();
  if (!s) {
    await SiteSettings.create({});
    s = await SiteSettings.findOne().lean();
  }
  return s;
}

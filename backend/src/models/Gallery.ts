import { Schema, model, models, InferSchemaType } from "mongoose";
import { localizedSchema } from "./common";

export const gallerySchema = new Schema(
  {
    title: { type: localizedSchema, required: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: localizedSchema, default: () => ({ en: "", mr: "" }) },
    coverImage: { type: String, default: "" },
    category: { type: String, default: "General", trim: true },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type GalleryDoc = InferSchemaType<typeof gallerySchema> & { _id: unknown };

export const Gallery = models.Gallery || model("Gallery", gallerySchema);

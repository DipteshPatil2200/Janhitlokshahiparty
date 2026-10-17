import { Schema, model, models, InferSchemaType } from "mongoose";
import { localizedSchema } from "./common";

export const newsSchema = new Schema(
  {
    title: { type: localizedSchema, required: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    excerpt: { type: localizedSchema, default: () => ({ en: "", mr: "" }) },
    content: { type: localizedSchema, required: true },
    category: { type: String, default: "General", trim: true },
    coverImage: { type: String, default: "" },
    author: { type: String, default: "" },
    source: { type: String, default: "" },
    publishedAt: { type: Date, default: Date.now },
    isPublished: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

newsSchema.index({ isPublished: 1, publishedAt: -1 });

export type NewsDoc = InferSchemaType<typeof newsSchema> & { _id: unknown };

export const News = models.News || model("News", newsSchema);


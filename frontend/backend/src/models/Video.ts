import { Schema, model, models, InferSchemaType } from "mongoose";
import { localizedSchema } from "./common";

export const videoSchema = new Schema(
  {
    title: { type: localizedSchema, required: true },
    youtubeId: { type: String, required: true, trim: true },
    thumbnail: { type: String, default: "" },
    category: { type: String, default: "General", trim: true },
    description: { type: localizedSchema, default: () => ({ en: "", mr: "" }) },
    isPublished: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

videoSchema.index({ publishedAt: -1 });

export type VideoDoc = InferSchemaType<typeof videoSchema> & { _id: unknown };

export const Video = models.Video || model("Video", videoSchema);

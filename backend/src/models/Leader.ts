import { Schema, model, models, InferSchemaType } from "mongoose";
import { localizedSchema } from "./common";

export const leaderSchema = new Schema(
  {
    name: { type: localizedSchema, required: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    designation: { type: localizedSchema, default: () => ({ en: "", mr: "" }) },
    bio: { type: localizedSchema, default: () => ({ en: "", mr: "" }) },
    photo: { type: String, default: "" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    socials: { type: localizedSchema, default: () => ({ en: "", mr: "" }) },
    contact: { type: String, default: "" },
  },
  { timestamps: true }
);

leaderSchema.index({ order: 1 });

export type LeaderDoc = InferSchemaType<typeof leaderSchema> & { _id: unknown };

export const Leader = models.Leader || model("Leader", leaderSchema);


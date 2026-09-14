import { Schema, model, models, InferSchemaType } from "mongoose";

export const socialLinkSchema = new Schema(
  {
    platform: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type SocialLinkDoc = InferSchemaType<typeof socialLinkSchema> & { _id: unknown };

export const SocialLink = models.SocialLink || model("SocialLink", socialLinkSchema);

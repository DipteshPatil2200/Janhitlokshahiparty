import { Schema, model, models, InferSchemaType } from "mongoose";
import { localizedSchema } from "./common";

export const eventSchema = new Schema(
  {
    title: { type: localizedSchema, required: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: localizedSchema, default: () => ({ en: "", mr: "" }) },
    image: { type: String, default: "" },
    date: { type: Date, required: true },
    startTime: { type: String, default: "" },
    endTime: { type: String, default: "" },
    location: { type: localizedSchema, default: () => ({ en: "", mr: "" }) },
    status: { type: String, enum: ["upcoming", "past"], default: "upcoming" },
    isPublished: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    galleryIds: { type: [Schema.Types.ObjectId], ref: "Gallery", default: [] },
    campaignId: { type: Schema.Types.ObjectId, ref: "Campaign" },
  },
  { timestamps: true }
);

eventSchema.index({ date: 1 });

export type EventDoc = InferSchemaType<typeof eventSchema> & { _id: unknown };

export const Event = models.Event || model("Event", eventSchema);


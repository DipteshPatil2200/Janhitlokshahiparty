import { Schema, model, models, InferSchemaType } from "mongoose";
import { localizedSchema } from "./common";

const localizedTextArray = {
  type: [localizedSchema],
  default: [],
};

export const campaignSchema = new Schema(
  {
    title: { type: localizedSchema, required: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: localizedSchema, default: () => ({ en: "", mr: "" }) },
    image: { type: String, default: "" },
    objectives: { ...localizedTextArray },
    status: { type: String, enum: ["active", "completed", "planned"], default: "active" },
    startDate: { type: Date },
    endDate: { type: Date },
    isPublished: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    updates: { ...localizedTextArray },
    galleryIds: { type: [Schema.Types.ObjectId], ref: "Gallery", default: [] },
    newsIds: { type: [Schema.Types.ObjectId], ref: "News", default: [] },
  },
  { timestamps: true }
);


export type CampaignDoc = InferSchemaType<typeof campaignSchema> & { _id: unknown };

export const Campaign = models.Campaign || model("Campaign", campaignSchema);


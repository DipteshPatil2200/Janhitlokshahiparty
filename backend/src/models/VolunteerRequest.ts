import { Schema, model, models, InferSchemaType } from "mongoose";

export const volunteerRequestSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 200 },
    mobile: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, default: "" },
    district: { type: String, default: "" },
    city: { type: String, default: "" },
    categories: {
      type: [String],
      enum: ["digital", "social-media", "ground", "event", "youth", "other"],
      default: [],
    },
    availability: { type: String, default: "" },
    message: { type: String, default: "", maxlength: 8000 },
    status: { type: String, enum: ["new", "contacted", "approved", "rejected"], default: "new" },
  },
  { timestamps: true }
);

volunteerRequestSchema.index({ status: 1, createdAt: -1 });

export type VolunteerRequestDoc = InferSchemaType<typeof volunteerRequestSchema> & { _id: unknown };

export const VolunteerRequest =
  models.VolunteerRequest || model("VolunteerRequest", volunteerRequestSchema);

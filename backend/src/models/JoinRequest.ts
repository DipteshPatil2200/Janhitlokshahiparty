import { Schema, model, models, InferSchemaType } from "mongoose";

export const joinRequestSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 200 },
    mobile: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, default: "" },
    district: { type: String, default: "" },
    taluka: { type: String, default: "" },
    city: { type: String, default: "" },
    message: { type: String, default: "", maxlength: 8000 },
    status: { type: String, enum: ["new", "contacted", "approved", "rejected"], default: "new" },
  },
  { timestamps: true }
);

joinRequestSchema.index({ status: 1, createdAt: -1 });

export type JoinRequestDoc = InferSchemaType<typeof joinRequestSchema> & { _id: unknown };

export const JoinRequest = models.JoinRequest || model("JoinRequest", joinRequestSchema);

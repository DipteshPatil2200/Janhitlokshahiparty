import { Schema, model, models, InferSchemaType } from "mongoose";

export const contactMessageSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    mobile: { type: String, default: "" },
    subject: { type: String, default: "" },
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "read", "replied"], default: "new" },
  },
  { timestamps: true }
);

contactMessageSchema.index({ status: 1, createdAt: -1 });

export type ContactMessageDoc = InferSchemaType<typeof contactMessageSchema> & { _id: unknown };

export const ContactMessage =
  models.ContactMessage || model("ContactMessage", contactMessageSchema);

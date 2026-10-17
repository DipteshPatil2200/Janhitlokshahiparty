import { Schema, model, models, InferSchemaType } from "mongoose";
import { localizedSchema } from "./common";

export const documentSchema = new Schema(
  {
    title: { type: localizedSchema, required: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: localizedSchema, default: () => ({ en: "", mr: "" }) },
    category: { type: String, default: "General", trim: true },
    fileUrl: { type: String, default: "" },
    fileSize: { type: Number, default: 0 }, // bytes
    isPublished: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);


export type DocumentDoc = InferSchemaType<typeof documentSchema> & { _id: unknown };

export const DocumentModel = models.Document || model("Document", documentSchema);


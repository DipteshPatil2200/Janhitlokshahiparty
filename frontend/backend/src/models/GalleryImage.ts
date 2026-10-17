import { Schema, model, models, InferSchemaType } from "mongoose";

export const galleryImageSchema = new Schema(
  {
    galleryId: { type: Schema.Types.ObjectId, ref: "Gallery", required: true, index: true },
    url: { type: String, default: "" },
    caption: { type: String, default: "" },
    alt: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

galleryImageSchema.index({ galleryId: 1, order: 1 });

export type GalleryImageDoc = InferSchemaType<typeof galleryImageSchema> & { _id: unknown };

export const GalleryImage =
  models.GalleryImage || model("GalleryImage", galleryImageSchema);

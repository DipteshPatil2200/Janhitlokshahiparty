import { Schema, model, models, InferSchemaType } from "mongoose";
import { localizedSchema } from "./common";

export const orgUnitSchema = new Schema(
  {
    name: { type: localizedSchema, required: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    type: {
      type: String,
      enum: ["state", "division", "district", "assembly", "taluka", "local"],
      required: true,
    },
    parentId: { type: Schema.Types.ObjectId, ref: "OrganizationUnit", default: null },
    inChargeName: { type: String, default: "" },
    description: { type: localizedSchema, default: () => ({ en: "", mr: "" }) },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

orgUnitSchema.index({ parentId: 1 });
orgUnitSchema.index({ type: 1 });

export type OrgUnitDoc = InferSchemaType<typeof orgUnitSchema> & { _id: unknown };

export const OrganizationUnit =
  models.OrganizationUnit || model("OrganizationUnit", orgUnitSchema);

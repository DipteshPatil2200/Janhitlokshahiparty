import { Schema, model, models, InferSchemaType } from "mongoose";
import { localizedSchema } from "./common";

/**
 * Single-document settings for the Donation page.
 * Holds ONLY officially provided financial details. Stored as editable so the
 * admin can update without code changes. Never fabricate financial data.
 */
export const donationSettingsSchema = new Schema(
  {
    heading: { type: localizedSchema, default: () => ({ en: "", mr: "" }) },
    intro: { type: localizedSchema, default: () => ({ en: "", mr: "" }) },
    qrImage: { type: String, default: "" },
    upiId: { type: String, default: "" },
    accountName: { type: String, default: "" },
    accountNumber: { type: String, default: "" },
    bankName: { type: String, default: "" },
    branch: { type: String, default: "" },
    ifsc: { type: String, default: "" },
    chequeImage: { type: String, default: "" },
    instructions: {
      type: new Schema(
        {
          en: { type: [String], default: [] },
          mr: { type: [String], default: [] },
        },
        { _id: false }
      ),
      default: () => ({ en: [], mr: [] }),
    },
  },
  { timestamps: true }
);

export type DonationSettingsDoc = InferSchemaType<typeof donationSettingsSchema> & { _id: unknown };

export const DonationSettings =
  models.DonationSettings || model("DonationSettings", donationSettingsSchema);

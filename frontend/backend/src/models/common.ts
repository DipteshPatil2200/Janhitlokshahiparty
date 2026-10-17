import { Schema } from "mongoose";

/**
 * Reusable sub-documents/schemas used across models.
 */

/** Bilingual text: { en, mr } — both required but can be empty strings. */
const localizedFields = {
  en: { type: String, default: "", trim: true },
  mr: { type: String, default: "", trim: true },
} as const;

/** A localized object (title/description etc.) typed schema. */
export const localizedSchema = new Schema(localizedFields, { _id: false });
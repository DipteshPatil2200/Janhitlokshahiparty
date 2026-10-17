import { Schema, model, models, InferSchemaType } from "mongoose";
import { localizedSchema } from "./common";

export const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["super_admin", "content_manager", "media_manager", "organization_manager"],
      default: "content_manager",
    },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

export type UserDoc = InferSchemaType<typeof userSchema> & { _id: unknown };

export const User = models.User || model("User", userSchema);

/** Serialized (safe) user object — never expose passwordHash. */
export function toPublicUser(u: any) {
  return {
    id: String(u._id),
    name: u.name,
    email: u.email,
    role: u.role,
    isActive: u.isActive,
    lastLoginAt: u.lastLoginAt,
    createdAt: u.createdAt,
  };
}

export { localizedSchema };

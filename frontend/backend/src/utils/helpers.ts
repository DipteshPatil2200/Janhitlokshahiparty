import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn } as any);
}

/** Create a URL-safe slug from a string; falls back to a timestamp if empty. */
export function slugify(input: string): string {
  const s = input
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return s || `item-${Date.now()}`;
}

/** Pick only defined keys from body to avoid overwriting with undefined. */
export function pickDefined(obj: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(obj)) {
    if (obj[k] !== undefined) out[k] = obj[k];
  }
  return out;
}

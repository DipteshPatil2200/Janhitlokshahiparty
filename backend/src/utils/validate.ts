import { AppError } from "../middleware/error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_RE = /^[6-9]\d{9}$/;

function cleanString(v: unknown, maxLen = 1000): string {
  if (v === undefined || v === null) return "";
  const s = String(v).trim();
  return s.slice(0, maxLen);
}

function cleanEmail(v: unknown): string {
  return cleanString(v, 254);
}

function cleanMobile(v: unknown): string {
  return cleanString(v, 15);
}

/**
 * Validate a public citizen submission. `rules` maps each accepted model
 * field to a validator. Unknown / disallowed keys are dropped and a client
 * can never set privileged fields (e.g. `status`).
 */
export function validateSubmission<T extends Record<string, unknown>>(
  body: unknown,
  spec: {
    required: string[];
    emailFields?: string[];
    mobileFields?: string[];
    allow?: string[];
  }
): T {
  const src = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const out: Record<string, unknown> = {};

  const allowed = new Set([
    ...spec.required,
    ...(spec.emailFields || []),
    ...(spec.mobileFields || []),
    ...(spec.allow || []),
  ]);

  const fail = (field: string) => {
    throw new AppError(400, `${field} is required and invalid`);
  };

  for (const field of spec.required) {
    const val = cleanString(src[field]);
    if (!val) fail(field);
    out[field] = val;
  }

  for (const field of spec.emailFields || []) {
    const val = cleanEmail(src[field]);
    if (val && !EMAIL_RE.test(val)) throw new AppError(400, `${field} is not a valid email`);
    out[field] = val;
  }

  for (const field of spec.mobileFields || []) {
    const val = cleanMobile(src[field]);
    if (val && !MOBILE_RE.test(val)) throw new AppError(400, `${field} is not a valid mobile number`);
    out[field] = val;
  }

  for (const field of spec.allow || []) {
    if (src[field] === undefined || src[field] === null) continue;
    const v = src[field];
    if (Array.isArray(v)) {
      out[field] = v.map((item) => cleanString(item, 400));
    } else if (typeof v === "object" && v !== null) {
      out[field] = v;
    } else {
      out[field] = cleanString(v, 8000);
    }
  }

  // Defensive: never let the client set workflow status directly.
  delete out.status;

  void allowed;
  return out as T;
}

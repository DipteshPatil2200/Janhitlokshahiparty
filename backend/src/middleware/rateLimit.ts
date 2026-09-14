import rateLimit from "express-rate-limit";

/** Rate limit for public form submissions (spam protection). */
export const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

/** Rate limit for auth endpoints. */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many login attempts. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

/** General API limiter for admin CRUD. */
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  message: { error: "Too many requests." },
  standardHeaders: true,
  legacyHeaders: false,
});
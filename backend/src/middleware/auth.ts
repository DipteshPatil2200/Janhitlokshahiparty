import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { User } from "../models/User";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

/** Require a valid Bearer token and load the user. */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: missing token" });
    }
    let decoded: any;
    try {
      decoded = jwt.verify(token, env.jwtSecret);
    } catch {
      return res.status(401).json({ error: "Unauthorized: invalid or expired token" });
    }
    const user = await User.findById(decoded.id).lean();
    if (!user || !user.isActive) {
      return res.status(401).json({ error: "Unauthorized: user not found or inactive" });
    }
    req.user = {
      id: String(user._id),
      email: user.email,
      role: user.role,
    };
    next();
  } catch (err) {
    next(err);
  }
}

/** Require one of the given roles. Must run after requireAuth. */
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!roles.includes(req.user.role) && req.user.role !== "super_admin") {
      return res.status(403).json({ error: "Forbidden: insufficient role" });
    }
    next();
  };
}

/**
 * Populate req.user if a valid Bearer token is present, but never reject
 * anonymous requests. Used by public list routes so authenticated admins can
 * see unpublished content while visitors only see published content.
 */
export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return next();
    let decoded: any;
    try {
      decoded = jwt.verify(token, env.jwtSecret);
    } catch {
      return next();
    }
    const user = await User.findById(decoded.id).lean();
    if (user && user.isActive) {
      req.user = {
        id: String(user._id),
        email: user.email,
        role: user.role,
      };
    }
    next();
  } catch {
    next();
  }
}

import express from "express";
import path from "path";
import fs from "fs";
import { env } from "../config/env";

fs.mkdirSync(env.uploadDir, { recursive: true });

// Serve files uploaded to uploads/ at /uploads/*
const staticUploads = express.static(env.uploadDir, {
  maxAge: env.nodeEnv === "production" ? "7d" : 0,
  immutable: false,
  fallthrough: true,
});

// Validate the resolved path stays inside uploadDir (defense in depth).
export default function staticUploadsMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let clean: string;
  try {
    clean = decodeURIComponent(req.path).split(path.sep).join("/");
  } catch {
    // Malformed percent-encoding — reject instead of throwing a 500.
    return res.status(400).json({ error: "Bad request" });
  }
  const root = path.resolve(env.uploadDir);
  const resolved = path.resolve(root, `.${clean}`);
  const within =
    resolved === root ||
    resolved.startsWith(root + path.sep);
  if (!within) {
    return res.status(403).json({ error: "Forbidden" });
  }
  staticUploads(req, res, next);
}
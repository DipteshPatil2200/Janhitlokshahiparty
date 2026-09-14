import type { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { env } from "../config/env";
import { toPublicFileUrl } from "../utils/files";
import { AppError } from "../middleware/error";

/** Upload one or many files; returns public URLs + metadata. */
export function uploadFiles(req: Request, res: Response, next: NextFunction) {
  try {
    const files = (req.files as Express.Multer.File[]) ?? [];
    if (!files.length) throw new AppError(400, "No files uploaded");
    const results = files.map((f) => ({
      url: toPublicFileUrl(path.resolve(f.path)),
      originalName: f.originalname,
      mimeType: f.mimetype,
      size: f.size,
    }));
    res.status(201).json({ files: results });
  } catch (err) {
    next(err);
  }
}

/** Delete an uploaded file by its public URL path. Protected. */
export function deleteFile(req: Request, res: Response, next: NextFunction) {
  try {
    const { url } = req.body;
    if (!url || typeof url !== "string") throw new AppError(400, "url required");
    // Strip a known public prefix (with or without /api) so a bare relative
    // name or public URL resolves back into the upload dir.
    let rel = url;
    const base = env.publicBaseUrl.replace(/\/$/, "");
    for (const prefix of [`${base}/api/uploads/`, `${base}/uploads/`]) {
      if (rel.startsWith(prefix)) {
        rel = rel.slice(prefix.length);
        break;
      }
    }
    const root = path.resolve(env.uploadDir);
    const abs = path.resolve(root, rel);
    const within = abs === root || abs.startsWith(root + path.sep);
    if (!within) throw new AppError(400, "Invalid file path");
    if (fs.existsSync(abs) && fs.statSync(abs).isFile()) fs.unlinkSync(abs);
    res.json({ deleted: true });
  } catch (err) {
    next(err);
  }
}
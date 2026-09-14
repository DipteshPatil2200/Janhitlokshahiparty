import multer from "multer";
import fs from "fs";
import path from "path";
import { env } from "../config/env";

fs.mkdirSync(env.uploadDir, { recursive: true });

const ALLOWED_IMAGES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_DOCS = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

// Extension derived from the *allowed* MIME type, never from the
// client-controlled originalname. Prevents arbitrary HTML/SVG/etc uploads.
const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, env.uploadDir),
  filename: (_req, file, cb) => {
    const ext = EXT_BY_MIME[file.mimetype] || ".bin";
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (ALLOWED_IMAGES.includes(file.mimetype) || ALLOWED_DOCS.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images (jpg/png/webp/gif) and PDF/DOC files are allowed"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: env.maxUploadSizeMb * 1024 * 1024, files: 20 },
});
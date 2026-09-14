import path from "path";
import { env } from "../config/env";

/**
 * Given a stored file path (either absolute or inside uploadDir), return a
 * public URL path that the frontend can use to load the file.
 */
export function toPublicFileUrl(storedPath: string): string {
  if (!storedPath) return "";
  if (/^https?:\/\//.test(storedPath)) return storedPath;
  // Resolve both branches against the upload dir so the containment check is
  // done on a consistent, normalized absolute path.
  const root = path.resolve(env.uploadDir);
  const abs = path.isAbsolute(storedPath)
    ? path.resolve(storedPath)
    : path.resolve(root, storedPath);
  const rootWithSep = root + path.sep;
  const within = abs === root || abs.startsWith(rootWithSep);
  if (within) {
    const rel = path.relative(root, abs).split(path.sep).join("/");
    return `${env.publicBaseUrl}/api/uploads/${rel}`;
  }
  return storedPath;
}
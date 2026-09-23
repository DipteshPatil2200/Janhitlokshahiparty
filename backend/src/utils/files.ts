/**
 * Return the public URL for a stored file.
 *
 * Cloudinary uploads already provide a permanent HTTPS URL,
 * so no local upload path conversion is required.
 */
export function toPublicFileUrl(storedPath: string): string {
  if (!storedPath) return "";

  if (/^https?:\/\//i.test(storedPath)) {
    return storedPath;
  }

  return storedPath;
}
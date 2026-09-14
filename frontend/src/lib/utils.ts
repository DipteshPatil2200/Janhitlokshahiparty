import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Central image URL resolver used across the whole site so every image is
 * built consistently (absolute upload URL, public relative path, cloud URL,
 * or blank when missing). Prevents the same image bug from reappearing on
 * different pages.
 */
export function getImageUrl(src?: string | null): string {
  if (!src || typeof src !== "string") return "";
  const trimmed = src.trim();
  if (!trimmed) return "";
  // Already a fully qualified URL (http/https, or a scheme-relative //host).
  if (/^(https?:)?\/\//i.test(trimmed)) return trimmed;
  // Public-relative path served by the same origin (e.g. /brand/logo.png).
  if (trimmed.startsWith("/")) return trimmed;
  // Bare upload filename/relative path → resolve against the backend uploads
  // root so it always points at a real, publicly served file.
  const uploadRoot = "/api/uploads/";
  return `${uploadRoot}${trimmed.replace(/^\.?\//, "")}`;
}

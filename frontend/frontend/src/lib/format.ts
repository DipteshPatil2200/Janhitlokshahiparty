import type { Locale } from "@/types";

export function formatDate(iso: string, locale: Locale): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(locale === "mr" ? "mr-IN" : "en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

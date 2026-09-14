"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";
import { localizePath } from "@/lib/i18n";

export default function NotFound() {
  const pathname = usePathname();
  const isMr = pathname === "/mr" || (pathname || "").startsWith("/mr/");
  const L = isMr ? "mr" : "en";

  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      {/* Emblem-inspired mark */}
      <span className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-brand-400 bg-green-800">
        <span className="absolute -inset-1 rounded-full border border-brand-500/40" aria-hidden="true" />
        <span className="font-display text-lg font-extrabold text-brand-200">JL</span>
      </span>
      <h1 className="mt-6 text-6xl font-extrabold text-ink">404</h1>
      <p className="mt-2 text-lg font-semibold text-ink">
        {L === "mr" ? "पृष्ठ सापडले नाही" : "Page not found"}
      </p>
      <p className="mt-2 max-w-md text-ink-muted">
        {L === "mr"
          ? "आपण शोधत असलेले पृष्ठ अस्तित्वात नाही किंवा हलवले गेले आहे."
          : "The page you are looking for does not exist or has been moved."}
      </p>
      <Link
        href={localizePath("/", L)}
        className="mt-8 inline-flex items-center gap-2 rounded-md bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-600"
      >
        <Home className="h-4 w-4" aria-hidden="true" />
        {L === "mr" ? "मुख्यपृष्ठावर परत या" : "Return Home"}
      </Link>
    </section>
  );
}

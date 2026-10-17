"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import type { Locale } from "@/types";
import { getLocaleFromPath, localizePath, stripLocalePrefix } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const pathname = usePathname();
  const currentLocale = getLocaleFromPath(pathname);
  const basePath = stripLocalePrefix(pathname);

  const targetLocale: Locale = currentLocale === "mr" ? "en" : "mr";
  const targetHref = localizePath(basePath, targetLocale);

  return (
    <Link
      href={targetHref}
      aria-label={
        targetLocale === "mr" ? "Switch to Marathi" : "Switch to English"
      }
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-ink-muted hover:bg-stone-100 hover:text-ink",
        className
      )}
    >
      <Languages className="h-4 w-4" aria-hidden="true" />
      <span>{targetLocale === "mr" ? "मराठी" : "English"}</span>
    </Link>
  );
}

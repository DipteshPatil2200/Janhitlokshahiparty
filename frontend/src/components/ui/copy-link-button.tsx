"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";
import type { Locale } from "@/types";

interface Props {
  url: string;
  locale: Locale;
}

export function CopyLinkButton({ url, locale }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard?.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={locale === "mr" ? "दुवा कॉपी करा" : "Copy link"}
      className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-ink-muted hover:bg-stone-100"
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-600" aria-hidden="true" />
      ) : (
        <Link2 className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );
}

// components/donation/cheque-image.tsx
"use client";

import * as React from "react";
import { Maximize2, X } from "lucide-react";
import { SmartImage } from "@/components/ui/smart-image";

export function ChequeImage({
  src,
  locale,
}: {
  src?: string;
  locale: "en" | "mr";
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => src && setOpen(true)}
        disabled={!src}
        className="group relative block w-full overflow-hidden rounded-2xl border border-border bg-white p-4 shadow-card disabled:cursor-default"
        aria-label={
          locale === "mr" ? "धनादेश मोठा करून पहा" : "Zoom in on cheque"
        }
        aria-haspopup="dialog"
      >
        {src ? (
          <SmartImage
            src={src}
            fit="contain"
            alt={locale === "mr" ? "देणगी धनादेश" : "Donation Cheque"}
            className="max-h-[360px] w-full"
          />
        ) : (
          <div className="flex max-h-[360px] min-h-[200px] w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500">
            {locale === "mr"
              ? "[अधिकृत धनादेश प्रतिमा]"
              : "[Official Cheque Image]"}
          </div>
        )}
        <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow opacity-0 transition-opacity group-hover:opacity-100">
          <Maximize2 className="h-4 w-4" aria-hidden="true" />
        </span>
      </button>

      {open && src ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={locale === "mr" ? "धनादेश प्रतिमा" : "Cheque image"}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={locale === "mr" ? "बंद करा" : "Close"}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
          <div
            className="max-h-full max-w-full overflow-auto rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={locale === "mr" ? "देणगी धनादेश" : "Donation Cheque"}
              className="max-h-[88vh] max-w-full object-contain"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}

"use client";

import * as React from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SmartImage } from "@/components/ui/smart-image";
import type { Locale } from "@/types";

interface LightboxProps {
  images: { src: string; alt: string }[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  locale: Locale;
}

export function ImageLightbox({
  images,
  index,
  onClose,
  onNavigate,
  locale,
}: LightboxProps) {
  const current = images[index];

  const goPrev = React.useCallback(() => {
    onNavigate((index - 1 + images.length) % images.length);
  }, [index, images.length, onNavigate]);

  const goNext = React.useCallback(() => {
    onNavigate((index + 1) % images.length);
  }, [index, images.length, onNavigate]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, goPrev, goNext]);

  if (!current) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={locale === "mr" ? "छायाचित्र पूर्ण पहा" : "Full image view"}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={locale === "mr" ? "बंद करा" : "Close"}
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
      >
        <X className="h-6 w-6" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={goPrev}
        aria-label="Previous image"
        className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
      >
        <ChevronLeft className="h-6 w-6" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={goNext}
        aria-label="Next image"
        className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
      >
        <ChevronRight className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="max-h-full w-full max-w-5xl">
        <div
          className={cn(
            "flex h-full max-h-[78vh] w-full items-center justify-center overflow-hidden rounded-lg"
          )}
        >
          <SmartImage
            src={current.src}
            fit="contain"
            fallback="[Image]"
            alt={current.alt}
            className="max-h-[78vh] w-auto"
          />
        </div>
        <p className="mt-3 text-center text-sm text-stone-300">
          {current.alt}
          <span className="ml-2 text-stone-500">
            {index + 1} / {images.length}
          </span>
        </p>
      </div>
    </div>
  );
}

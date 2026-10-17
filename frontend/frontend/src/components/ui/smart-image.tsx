"use client";

import * as React from "react";
import Image, { type ImageProps } from "next/image";
import { Camera } from "lucide-react";
import { cn, getImageUrl } from "@/lib/utils";

interface SmartImageProps extends Omit<ImageProps, "src" | "placeholder"> {
  src?: string | null;
  fit?: "contain" | "cover";
  /**
   * Fallback label shown when no src is provided (official image pending) or
   * when the image fails to load (broken/expired URL).
   */
  fallback?: string;
}

/**
 * Image wrapper that:
 * - Normalizes every `src` through the central getImageUrl helper.
 * - Renders a clean, layout-preserving placeholder when no official image
 *   `src` is available OR when the image fails to load (so users never see a
 *   broken browser image icon or an empty box).
 * - Uses `object-contain` (default) so full images (QR, cheque, documents,
 *   faces/logos) are never cropped. Use fit="cover" only when cropping is OK.
 */
export function SmartImage({
  src,
  fit = "contain",
  fallback = "[Image]",
  className,
  alt,
  ...props
}: SmartImageProps) {
  const srcString = getImageUrl(src);
  const isExternal = /^(https?:)?\/\//i.test(srcString);
  const [failed, setFailed] = React.useState(false);

  // Reset failure state whenever the source changes (e.g. lightbox navigation).
  React.useEffect(() => {
    setFailed(false);
  }, [srcString]);

  if (!srcString) {
    return <ImagePlaceholder fallback={fallback} alt={alt} className={className} />;
  }

  if (isExternal) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={srcString}
        alt={typeof alt === "string" ? alt : ""}
        className={cn("h-full w-full", fit === "contain" ? "object-contain" : "object-cover", className)}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }

  if (failed) {
    return <ImagePlaceholder fallback={fallback} alt={alt} className={className} />;
  }

  return (
    <Image
      src={srcString}
      alt={typeof alt === "string" ? alt : ""}
      width={1600}
      height={900}
      onError={() => setFailed(true)}
      className={cn(
        "h-full w-full",
        fit === "contain" ? "object-contain" : "object-cover",
        className
      )}
      {...props}
    />
  );
}

function ImagePlaceholder({
  fallback,
  alt,
  className,
}: {
  fallback: string;
  alt?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-2 bg-stone-100 text-stone-400",
        className
      )}
      role="img"
      aria-label={typeof alt === "string" ? alt : fallback}
    >
      <Camera className="h-8 w-8" aria-hidden="true" />
      <span className="px-4 text-center text-sm">{fallback}</span>
    </div>
  );
}

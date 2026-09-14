"use client";

import * as React from "react";
import Link from "next/link";
import { galleryCategories } from "@/data/gallery";
import { getLocalizedText, localizePath } from "@/lib/i18n";
import { SmartImage } from "@/components/ui/smart-image";
import { ImageLightbox } from "@/components/ui/image-lightbox";
import { cn } from "@/lib/utils";
import type { GalleryAlbum, Locale } from "@/types";

export function AlbumCard({
  album,
  locale,
  onOpen,
}: {
  album: GalleryAlbum;
  locale: Locale;
  onOpen: (album: GalleryAlbum, imageIndex: number) => void;
}) {
  const title = getLocalizedText(album.title, locale);
  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-white shadow-card transition-shadow duration-200 hover:shadow-lg">
      <button
        type="button"
        onClick={() => onOpen(album, 0)}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-stone-100"
        aria-label={`${locale === "mr" ? "अल्बम पहा" : "Open album"}: ${title}`}
      >
        <SmartImage
          src={album.cover || album.images[0]?.src || null}
          fit="cover"
          fallback={locale === "mr" ? "[अल्बम]" : "[Album]"}
          alt={title}
          className="transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </button>
      <div className="p-4">
        <Link
          href={localizePath(`/gallery/${album.slug}`, locale)}
          className="block font-semibold text-ink hover:text-brand-700"
        >
          {title}
        </Link>
        <p className="mt-1 text-xs text-ink-muted">
          {album.images.length}{" "}
          {locale === "mr" ? "छायाचित्रे" : "photos"}
        </p>
      </div>
    </article>
  );
}

export function GalleryView({
  locale,
  albums,
}: {
  locale: Locale;
  albums: GalleryAlbum[];
}) {
  const [activeCat, setActiveCat] = React.useState("all");
  const [lightbox, setLightbox] = React.useState<{
    images: { src: string; alt: string }[];
    index: number;
  } | null>(null);

  const filtered = albums.filter(
    (a) => activeCat === "all" || a.category === activeCat
  );

  const openAlbum = (album: GalleryAlbum, imageIndex: number) => {
    const images = album.images.map((img) => ({
      src: img.src,
      alt: getLocalizedText(img.alt, locale),
    }));
    setLightbox({ images, index: imageIndex });
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCat("all")}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
            activeCat === "all"
              ? "border-brand-700 bg-brand-700 text-white"
              : "border-border bg-white text-ink-soft hover:bg-stone-100"
          )}
        >
          {locale === "mr" ? "सर्व" : "All"}
        </button>
        {galleryCategories.map((c) => (
          <button
            key={c.slug}
            onClick={() => setActiveCat(c.slug)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              activeCat === c.slug
                ? "border-brand-700 bg-brand-700 text-white"
                : "border-border bg-white text-ink-soft hover:bg-stone-100"
            )}
          >
            {getLocalizedText(c.title, locale)}
          </button>
        ))}
      </div>

      {filtered.length ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((album) => (
            <AlbumCard
              key={album.slug}
              album={album}
              locale={locale}
              onOpen={openAlbum}
            />
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-border bg-paper p-12 text-center text-ink-muted">
          {locale === "mr"
            ? "छायाचित्रे लवकरच उपलब्ध होतील."
            : "Photographs will be available soon."}
        </p>
      )}

      {lightbox ? (
        <ImageLightbox
          images={lightbox.images}
          index={lightbox.index}
          locale={locale}
          onClose={() => setLightbox(null)}
          onNavigate={(i) => setLightbox((prev) => (prev ? { ...prev, index: i } : prev))}
        />
      ) : null}
    </div>
  );
}

export function GalleryAlbumView({
  album,
  locale,
}: {
  album: GalleryAlbum;
  locale: Locale;
}) {
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);

  const images = album.images.map((img) => ({
    src: img.src,
    alt: getLocalizedText(img.alt, locale),
  }));

  if (!images.length) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-paper p-12 text-center text-ink-muted">
        {locale === "mr"
          ? "या अल्बमात सध्या छायाचित्रे नाहीत."
          : "This album has no photographs yet."}
      </p>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setLightboxIndex(i)}
          className="group block aspect-[4/3] w-full overflow-hidden rounded-lg border border-border bg-stone-100 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2"
            aria-label={`${locale === "mr" ? "छायाचित्र पहा" : "View photo"}: ${img.alt}`}
          >
            <SmartImage
              src={img.src}
              fit="cover"
              fallback={locale === "mr" ? "[छायाचित्र]" : "[Photo]"}
              alt={img.alt}
              className="transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>

      {lightboxIndex !== null ? (
        <ImageLightbox
          images={images}
          index={lightboxIndex}
          locale={locale}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      ) : null}
    </div>
  );
}

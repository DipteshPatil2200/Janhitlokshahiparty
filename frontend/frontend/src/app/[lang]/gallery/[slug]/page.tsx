import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/page-header";
import { getLocalizedText, localizePath } from "@/lib/i18n";
import { getGalleryAlbumBySlug } from "@/data/gallery";
import { GalleryAlbumView } from "@/components/gallery/gallery-view";
import { formatDate } from "@/lib/format";
import type { Locale } from "@/types";

interface Props {
  params: { lang: string; slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const album = await getGalleryAlbumBySlug(params.slug);
  if (!album) return {};
  return buildMetadata({
    title: getLocalizedText(album.title, locale),
    description: getLocalizedText(album.description, locale),
    path: `/gallery/${album.slug}`,
    locale,
  });
}

export default async function GalleryAlbumPage({ params }: Props) {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const album = await getGalleryAlbumBySlug(params.slug);
  if (!album) notFound();

  const L = locale;

  return (
    <>
      <PageHeader
        eyebrow={L === "mr" ? "छायाचित्रे" : "Gallery"}
        title={getLocalizedText(album.title, L)}
        description={getLocalizedText(album.description, L)}
      />
      <div className="section container-page">
        <div className="mx-auto max-w-6xl">
          <p className="mb-8 flex items-center gap-2 text-xs text-ink-muted">
            <ImageIcon className="h-4 w-4" aria-hidden="true" />
            {album.images.length} {L === "mr" ? "छायाचित्रे" : "photos"}
            {album.date ? ` · ${formatDate(album.date, L)}` : ""}
          </p>
          <GalleryAlbumView album={album} locale={locale} />

          <Link
            href={localizePath("/gallery", locale)}
            className="mt-12 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {L === "mr" ? "सर्व छायाचित्रे" : "All Photos"}
          </Link>
        </div>
      </div>
    </>
  );
}
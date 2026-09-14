import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/page-header";
import { GalleryView } from "@/components/gallery/gallery-view";
import { getGalleryAlbums } from "@/data/gallery";
import type { Locale } from "@/types";

interface Props {
  params: { lang: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const isMr = locale === "mr";
  return buildMetadata({
    title: isMr ? "फोटो गॅलरी" : "Photo Gallery",
    description: isMr
      ? "जनहित लोकशाही पक्षाची छायाचित्रे."
      : "Photographs of Janhit Lokshahi Party.",
    path: "/gallery",
    locale,
  });
}

export default async function GalleryPage({ params }: Props) {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const albums = await getGalleryAlbums();

  return (
    <>
      <PageHeader
        eyebrow={locale === "mr" ? "छायाचित्रे" : "Gallery"}
        title={locale === "mr" ? "फोटो गॅलरी" : "Photo Gallery"}
        description={
          locale === "mr"
            ? "पक्षाच्या कार्यक्रमांचे महत्वाचे क्षण."
            : "Key moments from our programmes and campaigns."
        }
      />
      <div className="section container-page">
        <GalleryView locale={locale} albums={albums} />
      </div>
    </>
  );
}

import type { Metadata } from "next";
import { Play, Youtube } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/page-header";
import { getVideos } from "@/data/gallery";
import { getLocalizedText } from "@/lib/i18n";
import { SmartImage } from "@/components/ui/smart-image";
import { formatDate } from "@/lib/format";
import type { Locale } from "@/types";

interface Props {
  params: { lang: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const isMr = locale === "mr";
  return buildMetadata({
    title: isMr ? "व्हिडिओ" : "Videos",
    description: isMr
      ? "जनहित लोकशाही पक्षाचे व्हिडिओ."
      : "Videos of Janhit Lokshahi Party.",
    path: "/videos",
    locale,
  });
}

export default async function VideosPage({ params }: Props) {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const videos = await getVideos();

  return (
    <>
      <PageHeader
        eyebrow={locale === "mr" ? "व्हिडिओ" : "Videos"}
        title={locale === "mr" ? "व्हिडिओ गॅलरी" : "Video Gallery"}
        description={
          locale === "mr"
            ? "पक्षाचे महत्वाचे व्हिडिओ."
            : "Important videos from the party."
        }
      />
      <div className="section container-page">
        {videos.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((v) => {
              const title = getLocalizedText(v.title, locale);
              return (
                <a
                  key={v.id}
                  href={`https://www.youtube.com/watch?v=${v.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group overflow-hidden rounded-xl border border-border bg-white shadow-card"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-stone-900">
                    {v.thumbnail ? (
                      <SmartImage
                        src={v.thumbnail}
                        fit="cover"
                        fallback="[Video]"
                        alt={title}
                        className="transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Youtube className="h-10 w-10 text-white/70" aria-hidden="true" />
                      </div>
                    )}
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-brand-700 shadow-lg transition-transform group-hover:scale-110">
                        <Play className="h-6 w-6 fill-current" aria-hidden="true" />
                      </span>
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-ink">{title}</h3>
                    {v.date ? (
                      <p className="mt-1 text-xs text-ink-muted">
                        {formatDate(v.date, locale)}
                      </p>
                    ) : null}
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-border bg-paper p-12 text-center text-ink-muted">
            {locale === "mr"
              ? "व्हिडिओ लवकरच उपलब्ध होतील."
              : "Videos will be available soon."}
          </p>
        )}
      </div>
    </>
  );
}

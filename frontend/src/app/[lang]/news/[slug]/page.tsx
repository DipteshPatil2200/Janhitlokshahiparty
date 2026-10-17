import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, ArrowLeft, Facebook, Twitter, Send } from "lucide-react";
import { CopyLinkButton } from "@/components/ui/copy-link-button";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/page-header";
import { getLocalizedText, localizePath } from "@/lib/i18n";
import { getNewsBySlug, getNewsListSafe, getCategoryLabel } from "@/data/news";
import { SmartImage } from "@/components/ui/smart-image";
import { formatDate } from "@/lib/format";
import type { Locale } from "@/types";
import { NewsCard } from "@/components/cards/news-card";

interface Props {
  params: { lang: string; slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const item = await getNewsBySlug(params.slug);
  if (!item) return {};
  return buildMetadata({
    title: getLocalizedText(item.title, locale),
    description: getLocalizedText(item.excerpt, locale),
    path: `/news/${item.slug}`,
    locale,
    type: "article",
    publishedTime: item.date,
    image: item.featuredImage,
  });
}

export default async function NewsDetailPage({ params }: Props) {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const item = await getNewsBySlug(params.slug);
  if (!item) notFound();

  const allNews = await getNewsListSafe();
  const related = allNews
    .filter((n) => n.slug !== item.slug)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ""}/${locale === "en" ? "" : "mr/"}news/${item.slug}`;
  const L = locale;

  return (
    <>
      <PageHeader
        eyebrow={getCategoryLabel(item.category)}
        title={getLocalizedText(item.title, L)}
      />
      <article className="section container-page">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-muted">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              <time dateTime={item.date}>{formatDate(item.date, L)}</time>
            </span>
            {item.author ? (
              <span>
                {L === "mr" ? "लेखक" : "Author"}:
                {getLocalizedText(item.author, L)}
              </span>
            ) : null}
            {item.source ? (
              <span>
                {L === "mr" ? "स्रोत" : "Source"}:
                {getLocalizedText(item.source, L)}
              </span>
            ) : null}
          </div>

          {item.featuredImage ? (
            <div className="mt-6 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-stone-100">
              <SmartImage
                fit="cover"
                src={item.featuredImage}
                alt={getLocalizedText(item.title, L)}
              />
            </div>
          ) : null}

          <div className="mt-8 max-w-none">
            <p className="whitespace-pre-line text-lg leading-relaxed text-ink-soft">
              {getLocalizedText(item.content, L)}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-6">
            <span className="text-sm font-medium text-ink-muted">
              {L === "mr" ? "शेअर करा:" : "Share:"}
            </span>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-ink-muted hover:bg-stone-100"
            >
              <Facebook className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on X"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-ink-muted hover:bg-stone-100"
            >
              <Twitter className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Telegram"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-ink-muted hover:bg-stone-100"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
            </a>
            <CopyLinkButton url={shareUrl} locale={locale} />
          </div>

          <Link
            href={localizePath("/news", locale)}
            className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {L === "mr" ? "सर्व बातम्या" : "All News"}
          </Link>
        </div>

        {related.length ? (
          <div className="mx-auto mt-16 max-w-6xl">
            <h2 className="text-2xl font-bold text-ink">
              {L === "mr" ? "संबंधित बातम्या" : "Related News"}
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {related.map((r) => (
                <NewsCard key={r.slug} item={r} locale={locale} />
              ))}
            </div>
          </div>
        ) : null}
      </article>
    </>
  );
}

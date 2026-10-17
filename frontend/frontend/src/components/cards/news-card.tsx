import Link from "next/link";
import { Calendar } from "lucide-react";
import { getLocalizedText, localizePath } from "@/lib/i18n";
import { SmartImage } from "@/components/ui/smart-image";
import { getCategoryLabel } from "@/data/news";
import type { NewsItem, Locale } from "@/types";
import { formatDate } from "@/lib/format";

export function NewsCard({ item, locale }: { item: NewsItem; locale: Locale }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-card transition-shadow hover:shadow-elevated">
      <Link
        href={localizePath(`/news/${item.slug}`, locale)}
        className="relative block aspect-[16/10] w-full overflow-hidden bg-stone-100"
        aria-hidden="true"
        tabIndex={-1}
      >
        <SmartImage
          src={item.featuredImage || null}
          fit="cover"
          fallback="[News Image]"
          alt={getLocalizedText(item.title, locale)}
          className="transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <span className="absolute left-3 top-3 rounded bg-brand-700 px-2 py-0.5 text-xs font-semibold text-white">
          {getCategoryLabel(item.category)}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-ink-muted">
          <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
          <time dateTime={item.date}>{formatDate(item.date, locale)}</time>
        </div>
        <h3 className="mt-2 text-lg font-semibold leading-snug text-ink">
          <Link
            href={localizePath(`/news/${item.slug}`, locale)}
            className="transition-colors hover:text-brand-700"
          >
            {getLocalizedText(item.title, locale)}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-muted">
          {getLocalizedText(item.excerpt, locale)}
        </p>
      </div>
    </article>
  );
}

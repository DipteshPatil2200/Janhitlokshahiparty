import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/page-header";
import { getLocalizedText, localizePath } from "@/lib/i18n";
import { getEventDetails, getEvents } from "@/data/campaigns";
import { SmartImage } from "@/components/ui/smart-image";
import { formatDate } from "@/lib/format";
import { EventCard } from "@/components/cards/event-card";
import type { Locale } from "@/types";

interface Props {
  params: { lang: string; slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const item = await getEventDetails(params.slug);
  if (!item) return {};
  return buildMetadata({
    title: getLocalizedText(item.title, locale),
    description: getLocalizedText(item.description, locale),
    path: `/events/${item.slug}`,
    locale,
    type: "article",
    publishedTime: item.date,
  });
}

export default async function EventDetailPage({ params }: Props) {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const item = await getEventDetails(params.slug);
  if (!item) notFound();

  const L = locale;
  const all = await getEvents();
  const related = all.filter((e) => e.slug !== item.slug).slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow={L === "mr" ? "कार्यक्रम" : "Event"}
        title={getLocalizedText(item.title, L)}
        description={getLocalizedText(item.description, L)}
      />
      <article className="section container-page">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-muted">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              <time dateTime={item.date}>{formatDate(item.date, L)}</time>
            </span>
            {item.location ? (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {getLocalizedText(item.location, L)}
              </span>
            ) : null}
          </div>

          {item.image ? (
            <div className="mt-6 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-stone-100">
              <SmartImage
                fit="cover"
                src={item.image}
                alt={getLocalizedText(item.title, L)}
              />
            </div>
          ) : null}

          <div className="mt-8">
            <p className="whitespace-pre-line text-lg leading-relaxed text-ink-soft">
              {getLocalizedText(item.description, L)}
            </p>
          </div>

          <Link
            href={localizePath("/events", locale)}
            className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {L === "mr" ? "सर्व कार्यक्रम" : "All Events"}
          </Link>
        </div>

        {related.length ? (
          <div className="mx-auto mt-16 max-w-6xl">
            <h2 className="text-2xl font-bold text-ink">
              {L === "mr" ? "इतर कार्यक्रम" : "Other Events"}
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {related.map((e) => (
                <EventCard key={e.slug} event={e} locale={locale} />
              ))}
            </div>
          </div>
        ) : null}
      </article>
    </>
  );
}
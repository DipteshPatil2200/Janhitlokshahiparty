import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/page-header";
import { EventCard } from "@/components/cards/event-card";
import { getEvents, getUpcomingEvents } from "@/data/campaigns";
import type { Locale } from "@/types";

interface Props {
  params: { lang: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const isMr = locale === "mr";
  return buildMetadata({
    title: isMr ? "कार्यक्रम" : "Events",
    description: isMr
      ? "जनहित लोकशाही पक्षाचे कार्यक्रम."
      : "Events of Janhit Lokshahi Party.",
    path: "/events",
    locale,
  });
}

export default async function EventsPage({ params }: Props) {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const upcoming = await getUpcomingEvents();
  const past = (await getEvents()).filter((e) => e.status === "completed");

  return (
    <>
      <PageHeader
        eyebrow={locale === "mr" ? "कार्यक्रम" : "Events"}
        title={locale === "mr" ? "पक्षाचे कार्यक्रम" : "Party Events"}
        description={
          locale === "mr"
            ? "आगामी व पार पडलेले कार्यक्रम."
            : "Upcoming and past programmes."
        }
      />
      <div className="section container-page">
        {upcoming.length ? (
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-ink">
              {locale === "mr" ? "आगामी कार्यक्रम" : "Upcoming Events"}
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {upcoming.map((e) => (
                <EventCard key={e.slug} event={e} locale={locale} />
              ))}
            </div>
          </div>
        ) : null}

        {past.length ? (
          <div>
            <h2 className="mb-6 text-2xl font-bold text-ink">
              {locale === "mr" ? "पार पडलेले" : "Past Events"}
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {past.map((e) => (
                <EventCard key={e.slug} event={e} locale={locale} />
              ))}
            </div>
          </div>
        ) : null}

        {!upcoming.length && !past.length ? (
          <p className="rounded-xl border border-dashed border-border bg-paper p-12 text-center text-ink-muted">
            {locale === "mr"
              ? "कार्यक्रमांची माहिती लवकरच उपलब्ध होईल."
              : "Event information will be available soon."}
          </p>
        ) : null}
      </div>
    </>
  );
}

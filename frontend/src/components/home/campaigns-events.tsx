import { getCampaigns, getUpcomingEvents } from "@/data/campaigns";
import { SectionHeading } from "@/components/ui/section-heading";
import { LinkButton } from "@/components/ui/button";
import { CampaignCard } from "@/components/cards/campaign-card";
import { EventCard } from "@/components/cards/event-card";
import type { Locale } from "@/types";

export async function CampaignsSection({ locale }: { locale: Locale }) {
  const shown = (await getCampaigns()).slice(0, 3);
  return (
    <section className="section container-page">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow={locale === "mr" ? "मोहिमा" : "Campaigns"}
          heading={locale === "mr" ? "आमच्या मोहिमा" : "Our Campaigns"}
          description={
            locale === "mr"
              ? "जनहितासाठी सुरू असलेल्या उपक्रम."
              : "Initiatives working for the public interest."
          }
        />
        <LinkButton href="/campaigns" locale={locale} variant="outline" className="shrink-0">
          {locale === "mr" ? "सर्व मोहिमा" : "All Campaigns"}
          <span aria-hidden="true">→</span>
        </LinkButton>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {shown.map((c) => (
          <CampaignCard key={c.slug} campaign={c} locale={locale} />
        ))}
      </div>
    </section>
  );
}

export async function EventsSection({ locale }: { locale: Locale }) {
  const upcoming = (await getUpcomingEvents()).slice(0, 2);
  return (
    <section className="section bg-paper">
      <div className="container-page">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow={locale === "mr" ? "कार्यक्रम" : "Events"}
            heading={locale === "mr" ? "आगामी कार्यक्रम" : "Upcoming Events"}
            description={
              locale === "mr"
                ? "पक्षाचे आगामी कार्यक्रम."
                : "Join us at our upcoming programmes."
            }
          />
          <LinkButton href="/events" locale={locale} variant="outline" className="shrink-0">
            {locale === "mr" ? "सर्व कार्यक्रम" : "All Events"}
            <span aria-hidden="true">→</span>
          </LinkButton>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {upcoming.map((e) => (
            <EventCard key={e.slug} event={e} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}

import { getFeaturedLeaders } from "@/data/leaders";
import { localizePath } from "@/lib/i18n";
import { SectionHeading } from "@/components/ui/section-heading";
import { LinkButton } from "@/components/ui/button";
import { LeaderCard } from "@/components/cards/leader-card";
import type { Locale } from "@/types";

export async function LeadershipSection({ locale }: { locale: Locale }) {
  const featured = (await getFeaturedLeaders()).slice(0, 4);
  return (
    <section className="section container-page">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow={locale === "mr" ? "नेते" : "Leadership"}
          heading={
            locale === "mr" ? (
              "पक्षाचे नेतृत्व"
            ) : (
              "Party Leadership"
            )
          }
          description={
            locale === "mr"
              ? "पक्षाच्या नेतृत्वाची ओळख."
              : "Meet the people leading our party."
          }
        />
        <LinkButton href="/leadership" locale={locale} variant="outline" className="shrink-0">
          {locale === "mr" ? "सर्व नेते" : "All Leaders"}
          <span aria-hidden="true">→</span>
        </LinkButton>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((leader) => (
          <LeaderCard key={leader.slug} leader={leader} locale={locale} />
        ))}
      </div>
    </section>
  );
}

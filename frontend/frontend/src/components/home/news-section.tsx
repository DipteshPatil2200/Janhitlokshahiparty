import { getNewsListSafe } from "@/data/news";
import { SectionHeading } from "@/components/ui/section-heading";
import { LinkButton } from "@/components/ui/button";
import { NewsCard } from "@/components/cards/news-card";
import type { Locale } from "@/types";

export async function NewsSection({ locale }: { locale: Locale }) {
  const items = (await getNewsListSafe(3)).slice(0, 3);
  return (
    <section className="section bg-paper">
      <div className="container-page">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow={locale === "mr" ? "ताज्या बातम्या" : "Latest News"}
            heading={locale === "mr" ? "बातम्या व अद्ययावत" : "News & Updates"}
            description={
              locale === "mr"
                ? "पक्षाच्या नवीनतम घडामोडी."
                : "The latest developments from the party."
            }
          />
          <LinkButton href="/news" locale={locale} variant="outline" className="shrink-0">
            {locale === "mr" ? "सर्व बातम्या" : "All News"}
            <span aria-hidden="true">→</span>
          </LinkButton>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <NewsCard key={item.slug} item={item} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/page-header";
import { LeaderCard } from "@/components/cards/leader-card";
import { getLeaders } from "@/data/leaders";
import type { Locale } from "@/types";

interface Props {
  params: { lang: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const isMr = locale === "mr";
  return buildMetadata({
    title: isMr ? "नेते" : "Leadership",
    description: isMr
      ? "जनहित लोकशाही पक्षाचे नेते."
      : "Leadership of Janhit Lokshahi Party.",
    path: "/leadership",
    locale,
  });
}

export default async function LeadershipPage({ params }: Props) {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const sorted = (await getLeaders()).sort((a, b) => a.order - b.order);

  return (
    <>
      <PageHeader
        eyebrow={locale === "mr" ? "नेते" : "Leadership"}
        title={locale === "mr" ? "पक्षाचे नेतृत्व" : "Party Leadership"}
        description={
          locale === "mr"
            ? "जनहित लोकशाही पक्षाच्या नेतृत्वाची ओळख."
            : "Meet the leadership of Janhit Lokshahi Party."
        }
      />
      <div className="section container-page">
        {sorted.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {sorted.map((leader) => (
              <LeaderCard key={leader.slug} leader={leader} locale={locale} />
            ))}
          </div>
        ) : (
          <p className="text-center text-ink-muted">
            {locale === "mr"
              ? "नेतेत्वाची माहिती लवकरच उपलब्ध होईल."
              : "Leadership information will be available soon."}
          </p>
        )}
      </div>
    </>
  );
}

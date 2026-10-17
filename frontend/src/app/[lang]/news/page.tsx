import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/page-header";
import { NewsList } from "@/components/news/news-list";
import { getNewsListSafe } from "@/data/news";
import type { Locale } from "@/types";

interface Props {
  params: { lang: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const isMr = locale === "mr";
  return buildMetadata({
    title: isMr ? "बातम्या" : "News",
    description: isMr
      ? "जनहित लोकशाही पक्षाच्या ताज्या बातम्या."
      : "Latest news from Janhit Lokshahi Party.",
    path: "/news",
    locale,
  });
}

export default async function NewsPage({ params }: Props) {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const items = await getNewsListSafe();

  return (
    <>
      <PageHeader
        eyebrow={locale === "mr" ? "मीडिया" : "Media"}
        title={locale === "mr" ? "बातम्या व अद्ययावत" : "News & Updates"}
        description={
          locale === "mr"
            ? "पक्षाच्या नवीनतम घडामोडी."
            : "The latest news and updates from the party."
        }
      />
      <div className="section container-page">
        <NewsList locale={locale} items={items} />
      </div>
    </>
  );
}

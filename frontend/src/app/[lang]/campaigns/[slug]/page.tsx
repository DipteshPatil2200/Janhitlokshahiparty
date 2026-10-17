import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/page-header";
import { getLocalizedText, localizePath } from "@/lib/i18n";
import { getCampaignBySlug, getCampaigns } from "@/data/campaigns";
import { SmartImage } from "@/components/ui/smart-image";
import { LinkButton } from "@/components/ui/button";
import { CampaignCard } from "@/components/cards/campaign-card";
import type { Locale } from "@/types";

interface Props {
  params: { lang: string; slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const item = await getCampaignBySlug(params.slug);
  if (!item) return {};
  return buildMetadata({
    title: getLocalizedText(item.title, locale),
    description: getLocalizedText(item.description, locale),
    path: `/campaigns/${item.slug}`,
    locale,
  });
}

export default async function CampaignDetailPage({ params }: Props) {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const item = await getCampaignBySlug(params.slug);
  if (!item) notFound();

  const L = locale;
  const all = await getCampaigns();
  const related = all.filter((c) => c.slug !== item.slug).slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow={L === "mr" ? "मोहीम" : "Campaign"}
        title={getLocalizedText(item.title, L)}
        description={getLocalizedText(item.tagline, L)}
      />
      <article className="section container-page">
        <div className="mx-auto max-w-3xl">
          {item.image ? (
            <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-stone-100">
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
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <LinkButton href="/join-us" locale={L} variant="primary">
              {L === "mr" ? "सामील व्हा" : "Join the Campaign"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </LinkButton>
            <Link
              href={localizePath("/campaigns", locale)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:underline"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {L === "mr" ? "सर्व मोहिमा" : "All Campaigns"}
            </Link>
          </div>
        </div>

        {related.length ? (
          <div className="mx-auto mt-16 max-w-6xl">
            <h2 className="text-2xl font-bold text-ink">
              {L === "mr" ? "इतर मोहिमा" : "Other Campaigns"}
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {related.map((c) => (
                <CampaignCard key={c.slug} campaign={c} locale={locale} />
              ))}
            </div>
          </div>
        ) : null}
      </article>
    </>
  );
}
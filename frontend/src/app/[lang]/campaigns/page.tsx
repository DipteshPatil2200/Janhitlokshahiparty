import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/page-header";
import { CampaignCard } from "@/components/cards/campaign-card";
import { getCampaigns } from "@/data/campaigns";
import type { Locale } from "@/types";

interface Props {
  params: { lang: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const isMr = locale === "mr";
  return buildMetadata({
    title: isMr ? "मोहिमा" : "Campaigns",
    description: isMr
      ? "जनहित लोकशाही पक्षाच्या मोहिमा."
      : "Campaigns of Janhit Lokshahi Party.",
    path: "/campaigns",
    locale,
  });
}

export default async function CampaignsPage({ params }: Props) {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const campaigns = await getCampaigns();

  return (
    <>
      <PageHeader
        eyebrow={locale === "mr" ? "मोहिमा" : "Campaigns"}
        title={locale === "mr" ? "आमच्या मोहिमा" : "Our Campaigns"}
        description={
          locale === "mr"
            ? "जनहितासाठी सुरू असलेल्या उपक्रम."
            : "Initiatives working for the public interest."
        }
      />
      <div className="section container-page">
        {campaigns.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((c) => (
              <CampaignCard key={c.slug} campaign={c} locale={locale} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-border bg-paper p-12 text-center text-ink-muted">
            {locale === "mr"
              ? "मोहिमांची माहिती लवकरच उपलब्ध होईल."
              : "Campaign information will be available soon."}
          </p>
        )}
      </div>
    </>
  );
}

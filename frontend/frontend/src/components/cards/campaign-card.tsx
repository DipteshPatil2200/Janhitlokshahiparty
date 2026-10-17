import Link from "next/link";
import { getLocalizedText, localizePath } from "@/lib/i18n";
import { ArrowRight } from "lucide-react";
import { SmartImage } from "@/components/ui/smart-image";
import type { Campaign, Locale } from "@/types";

const statusStyles: Record<Campaign["status"], string> = {
  active: "bg-emerald-100 text-emerald-700",
  upcoming: "bg-amber-100 text-amber-700",
  planned: "bg-sky-100 text-sky-700",
  completed: "bg-stone-100 text-stone-600",
};

export function CampaignCard({ campaign, locale }: { campaign: Campaign; locale: Locale }) {
  return (
    <Link
      href={localizePath(`/campaigns/${campaign.slug}`, locale)}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-card transition-shadow hover:shadow-elevated"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-100">
        <SmartImage
          src={campaign.image || null}
          fit="cover"
          fallback="[Campaign Image]"
          alt={getLocalizedText(campaign.title, locale)}
          className="transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <span
          className={`absolute right-3 top-3 rounded px-2 py-0.5 text-xs font-semibold ${statusStyles[campaign.status]}`}
        >
          {campaign.status === "active"
            ? locale === "mr" ? "सुरू" : "Active"
            : campaign.status === "upcoming"
            ? locale === "mr" ? "आगामी" : "Upcoming"
            : campaign.status === "planned"
            ? locale === "mr" ? "नियोजित" : "Planned"
            : locale === "mr" ? "संपन्न" : "Completed"}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-ink">
          {getLocalizedText(campaign.title, locale)}
        </h3>
        <p className="mt-1 text-sm font-medium text-brand-700">
          {getLocalizedText(campaign.tagline, locale)}
        </p>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-muted">
          {getLocalizedText(campaign.description, locale)}
        </p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ink group-hover:text-brand-700">
          {locale === "mr" ? "अधिक जाणून घ्या" : "Learn More"}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

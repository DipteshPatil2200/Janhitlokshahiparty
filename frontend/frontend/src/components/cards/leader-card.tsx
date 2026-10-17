import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getLocalizedText, localizePath } from "@/lib/i18n";
import { SmartImage } from "@/components/ui/smart-image";
import type { Leader, Locale } from "@/types";

export function LeaderCard({ leader, locale }: { leader: Leader; locale: Locale }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-white shadow-card transition-shadow hover:shadow-elevated">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-100">
        <SmartImage
          src={leader.photo || null}
          fit="cover"
          fallback={getLocalizedText(leader.name, locale) || "[Leader Photo]"}
          alt={getLocalizedText(leader.name, locale)}
          className="transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-ink">
          {getLocalizedText(leader.name, locale)}
        </h3>
        <p className="mt-1 text-sm font-medium text-brand-700">
          {getLocalizedText(leader.designation, locale)}
        </p>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-muted">
          {getLocalizedText(leader.bio, locale)}
        </p>
        <Link
          href={localizePath(`/leadership/${leader.slug}`, locale)}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ink transition-colors hover:text-brand-700"
        >
          {locale === "mr" ? "पूर्ण प्रोफाइल" : "Full Profile"}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

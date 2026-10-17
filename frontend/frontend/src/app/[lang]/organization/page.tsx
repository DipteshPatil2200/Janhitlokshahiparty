import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/page-header";
import { orgLevels, getOrgRoot } from "@/data/organization";
import { LinkButton } from "@/components/ui/button";
import type { Locale, OrgNode } from "@/types";

interface Props {
  params: { lang: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const isMr = locale === "mr";
  return buildMetadata({
    title: isMr ? "संघटना" : "Organization",
    description: isMr
      ? "जनहित लोकशाही पक्षाची संघटनात्मक रचना."
      : "Organisational structure of Janhit Lokshahi Party.",
    path: "/organization",
    locale,
  });
}

function levelLabel(level: string, locale: "en" | "mr"): string {
  const l = orgLevels.find((x) => x.id === level);
  return l ? (locale === "mr" ? l.label.mr : l.label.en) : level;
}

function OrgBranch({ node, locale }: { node: OrgNode; locale: Locale }) {
  const children = node.children ?? [];
  return (
    <div>
      <div className="mx-auto max-w-sm rounded-lg border border-border bg-brand-50 px-4 py-3 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
          {locale === "mr" ? levelLabel(node.level, "mr") : levelLabel(node.level, "en")}
        </p>
        <p className="mt-0.5 font-semibold text-ink">
          {locale === "mr" ? node.name.mr : node.name.en}
        </p>
      </div>
      {children.length ? (
        <div>
          <div className="my-2 flex justify-center text-ink-muted">
            <ChevronDown className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {children.map((child) => (
              <OrgBranch key={child.name.en + child.level} node={child} locale={locale} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default async function OrganizationPage({ params }: Props) {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const orgRoot = await getOrgRoot();

  return (
    <>
      <PageHeader
        eyebrow={locale === "mr" ? "संघटना" : "Organization"}
        title={locale === "mr" ? "महाराष्ट्र संघटना" : "Maharashtra Organization"}
        description={
          locale === "mr"
            ? "राज्यापासून स्थानिक पातळीपर्यंतची आमची रचना."
            : "Our structure from the state down to the local level."
        }
      />
      <div className="section container-page">
        <OrgBranch node={orgRoot} locale={locale} />

        <div className="mt-16 rounded-2xl border border-dashed border-border bg-paper p-8 text-center">
          <h2 className="text-xl font-bold text-ink">
            {locale === "mr" ? "संघटना माहिती" : "Organization Information"}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-ink-muted">
            {locale === "mr"
              ? "अधिकृत संघटनात्मक माहिती पक्षाकडून मिळाल्यावर येथे जोडली जाईल. तोपर्यंत वरील रचना ही उदाहरणात्मक आहे."
              : "Official organisational data will be added here once provided by the party. Until then, the structure above is illustrative only."}
          </p>
          <div className="mt-6">
            <LinkButton href="/contact" locale={locale} variant="outline">
              {locale === "mr" ? "संपर्क साधा" : "Contact Us"}
            </LinkButton>
          </div>
        </div>
      </div>
    </>
  );
}

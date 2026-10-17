import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/page-header";
import { getLocalizedText } from "@/lib/i18n";
import { getLeaderBySlug } from "@/data/leaders";
import { SmartImage } from "@/components/ui/smart-image";
import type { Locale } from "@/types";

interface Props {
  params: { lang: string; slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const leader = await getLeaderBySlug(params.slug);
  if (!leader) return {};
  return buildMetadata({
    title: getLocalizedText(leader.name, locale),
    description: getLocalizedText(leader.designation, locale),
    path: `/leadership/${leader.slug}`,
    locale,
  });
}

export default async function LeaderDetailPage({ params }: Props) {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const leader = await getLeaderBySlug(params.slug);

  if (!leader) notFound();

  const L = locale;
  return (
    <>
      <PageHeader
        eyebrow={L === "mr" ? "नेते" : "Leadership"}
        title={getLocalizedText(leader.name, L)}
        description={getLocalizedText(leader.designation, L)}
      />
      <div className="section container-page">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="overflow-hidden rounded-2xl border border-border bg-stone-100 lg:sticky lg:top-28 lg:self-start">
            <div className="aspect-[4/5] w-full">
              <SmartImage
                fit="cover"
                src={leader.photo || null}
                fallback={getLocalizedText(leader.name, L)}
                alt={getLocalizedText(leader.name, L)}
              />
            </div>
          </div>
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-ink">
              {getLocalizedText(leader.name, L)}
            </h1>
            <p className="mt-2 text-lg font-medium text-brand-700">
              {getLocalizedText(leader.designation, L)}
            </p>
            <div className="mt-6 space-y-4 border-t border-border pt-6">
              <p className="leading-relaxed text-ink-soft">
                {getLocalizedText(leader.bio, L)}
              </p>
            </div>
            {leader.socials?.length ? (
              <div className="mt-6 flex flex-wrap gap-3">
                {leader.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-stone-100"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

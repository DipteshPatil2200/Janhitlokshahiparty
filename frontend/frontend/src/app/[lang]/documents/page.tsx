import type { Metadata } from "next";
import { FileText, Download } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/page-header";
import { getDocuments } from "@/data/gallery";
import { getLocalizedText } from "@/lib/i18n";
import { formatDate } from "@/lib/format";
import type { Locale } from "@/types";

interface Props {
  params: { lang: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const isMr = locale === "mr";
  return buildMetadata({
    title: isMr ? "कागदपत्रे" : "Documents",
    description: isMr
      ? "जनहित लोकशाही पक्षाची महत्वाची कागदपत्रे."
      : "Important documents of Janhit Lokshahi Party.",
    path: "/documents",
    locale,
  });
}

export default async function DocumentsPage({ params }: Props) {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const documents = await getDocuments();

  return (
    <>
      <PageHeader
        eyebrow={locale === "mr" ? "कागदपत्रे" : "Documents"}
        title={locale === "mr" ? "कागदपत्रे व प्रकाशने" : "Documents & Publications"}
        description={
          locale === "mr"
            ? "पक्षाची महत्वाची कागदपत्रे डाउनलोड करा."
            : "Download important documents from the party."
        }
      />
      <div className="section container-page">
        {documents.length ? (
          <ul className="mx-auto max-w-3xl space-y-4">
            {documents.map((d) => (
              <li key={d.slug}>
                <a
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-xl border border-border bg-white p-5 shadow-card transition-shadow hover:shadow-elevated"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                    <FileText className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="flex-1">
                    <span className="block font-semibold text-ink">
                      {getLocalizedText(d.title, locale)}
                    </span>
                    <span className="mt-0.5 block text-xs text-ink-muted">
                      {d.type}
                      {d.size ? ` · ${d.size}` : ""}
                      {d.date ? ` · ${formatDate(d.date, locale)}` : ""}
                    </span>
                  </span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-ink-soft hover:bg-stone-100">
                    <Download className="h-4 w-4" aria-hidden="true" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-xl border border-dashed border-border bg-paper p-12 text-center text-ink-muted">
            {locale === "mr"
              ? "कागदपत्रे लवकरच उपलब्ध होतील."
              : "Documents will be available soon."}
          </p>
        )}
      </div>
    </>
  );
}

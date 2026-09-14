import type { Metadata } from "next";
import { UserPlus, ShieldCheck, Users } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/page-header";
import { JoinUsForm } from "@/components/forms/join-us-form";
import type { Locale } from "@/types";

interface Props {
  params: { lang: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const isMr = locale === "mr";
  return buildMetadata({
    title: isMr ? "सामील व्हा" : "Join Us",
    description: isMr
      ? "जनहित लोकशाही पक्षात सदस्य व्हा."
      : "Become a member of Janhit Lokshahi Party.",
    path: "/join-us",
    locale,
  });
}

export default function JoinUsPage({ params }: Props) {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const L = locale;

  const perks = [
    { icon: Users, text: { en: "Be part of a people-centric movement", mr: "लोकाभिमुख चळवळीचा भाग व्हा" } },
    { icon: ShieldCheck, text: { en: "Contribute to transparent governance", mr: "पारदर्शक शासनात योगदान द्या" } },
    { icon: UserPlus, text: { en: "Participate in party activities", mr: "पक्षाच्या कार्यात सहभागी व्हा" } },
  ];

  return (
    <>
      <PageHeader
        eyebrow={L === "mr" ? "सामील व्हा" : "Join Us"}
        title={L === "mr" ? "पक्षात सामील व्हा" : "Join the Party"}
        description={
          L === "mr"
            ? "जनहिताच्या चळवळीचा भाग व्हा. खालील फॉर्म भरा."
            : "Be part of the public-interest movement. Fill in the form below."
        }
      />

      <div className="section container-page">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-border bg-white p-6 shadow-card md:p-8">
              <JoinUsForm locale={locale} />
            </div>
          </div>
          <aside className="space-y-4">
            <h2 className="text-lg font-bold text-ink">
              {L === "mr" ? "सदस्यत्वाचे फायदे" : "Membership Benefits"}
            </h2>
            <ul className="space-y-3">
              {perks.map((p) => {
                const Icon = p.icon;
                return (
                  <li
                    key={p.text.en}
                    className="flex items-start gap-3 rounded-xl border border-border bg-paper p-4"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-medium text-ink">
                      {L === "mr" ? p.text.mr : p.text.en}
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="rounded-xl border border-dashed border-border bg-paper p-5 text-sm text-ink-muted">
              {L === "mr"
                ? "अधिकृत सदस्यत्व अटींची माहिती पक्षाकडून उपलब्ध होईल."
                : "Official membership terms will be available from the party."}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

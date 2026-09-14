import { Target, Compass, ShieldCheck, Users } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { LinkButton } from "@/components/ui/button";
import type { Locale, SiteSettings } from "@/types";

export function VisionMission({ locale, settings }: { locale: Locale; settings?: SiteSettings }) {
  const L = locale;
  const visionLines = settings?.vision?.[L] || [];
  const missionLines = settings?.mission?.[L] || [];

  const values = [
    {
      icon: Compass,
      title: { en: "Our Vision", mr: "आमची दृष्टी" },
      desc: {
        en: visionLines.length
          ? visionLines.join(" ")
          : "[Official vision statement to be provided by the party.]",
        mr: visionLines.length
          ? visionLines.join(" ")
          : "[अधिकृत दृष्टी विधान पक्षाकडून दिले जाईल.]",
      },
    },
    {
      icon: Target,
      title: { en: "Our Mission", mr: "आमचे ध्येय" },
      desc: {
        en: missionLines.length
          ? missionLines.join(" ")
          : "[Official mission statement to be provided by the party.]",
        mr: missionLines.length
          ? missionLines.join(" ")
          : "[अधिकृत ध्येय विधान पक्षाकडून दिले जाईल.]",
      },
    },
    {
      icon: ShieldCheck,
      title: { en: "Integrity", mr: "प्रामाणिकपणा" },
      desc: {
        en: "Transparency and honesty in public life.",
        mr: "सार्वजनिक जीवनात पारदर्शकता आणि प्रामाणिकपणा.",
      },
    },
    {
      icon: Users,
      title: { en: "Public Interest", mr: "जनहित" },
      desc: {
        en: "Every decision centres on the welfare of the people.",
        mr: "प्रत्येक निर्णय जनतेच्या कल्याणाला केंद्रस्थानी ठेवून.",
      },
    },
  ] as const;

  return (
    <section className="section bg-paper">
      <div className="container-page">
        <SectionHeading
          eyebrow={L === "mr" ? "आमची दृष्टी व ध्येय" : "Vision & Mission"}
          heading={
            L === "mr" ? (
              "आमची मूल्ये आणि उद्दिष्टे"
            ) : (
              "Our Values and Objectives"
            )
          }
          description={
            L === "mr"
              ? "जनहित, न्याय, पारदर्शकता आणि सर्वांचा सहभाग या मूल्यांवर पक्षाची भूमिका उभी आहे."
              : "The party stands on the values of public interest, justice, transparency, and participation of all."
          }
          align="center"
          className="mx-auto"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title.en}
                className="rounded-xl border border-border bg-white p-6 shadow-card"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-700 text-white">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-ink">
                  {L === "mr" ? v.title.mr : v.title.en}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {L === "mr" ? v.desc.mr : v.desc.en}
                </p>
              </div>
            );
          })}
        </div>
        <div className="mt-10 text-center">
          <LinkButton href="/vision" locale={L} variant="outline">
            {L === "mr" ? "दृष्टी पृष्ठ पहा" : "View Vision Page"}
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
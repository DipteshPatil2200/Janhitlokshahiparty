import type { Metadata } from "next";
import { Compass, Target, Scale, TreePine, BookOpenCheck, Users } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Locale } from "@/types";

interface Props {
  params: { lang: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const isMr = locale === "mr";
  return buildMetadata({
    title: isMr ? "दृष्टी व ध्येय" : "Vision & Mission",
    description: isMr
      ? "जनहित लोकशाही पक्षाची दृष्टी, ध्येय व मूल्ये."
      : "Vision, mission and values of Janhit Lokshahi Party.",
    path: "/vision",
    locale,
  });
}

const pillars = [
  { icon: Scale, title: { en: "Justice", mr: "न्याय" } },
  { icon: TreePine, title: { en: "Environment", mr: "पर्यावरण" } },
  { icon: BookOpenCheck, title: { en: "Education", mr: "शिक्षण" } },
  { icon: Users, title: { en: "Public Participation", mr: "जनसहभाग" } },
];

export default function VisionPage({ params }: Props) {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const L = locale;

  const values = [
    { title: { en: "Public Interest (Janhit)", mr: "जनहित" }, body: { en: "Every policy and decision must serve the welfare of the common people. [Official statement to be provided.]", mr: "प्रत्येक धोरण व निर्णय सामान्य जनतेच्या कल्याणासाठी असावा. [अधिकृत विधान दिले जाईल.]" } },
    { title: { en: "Transparency", mr: "पारदर्शकता" }, body: { en: "Open and accountable governance at every level.", mr: "प्रत्येक स्तरावर मोकळे व जबाबदार शासन." } },
    { title: { en: "Inclusivity", mr: "सर्वसमावेशकता" }, body: { en: "Development that leaves no one behind.", mr: "कोणालाही मागे न ठेवणारा विकास." } },
    { title: { en: "Integrity", mr: "प्रामाणिकपणा" }, body: { en: "Honesty and ethics in public life.", mr: "सार्वजनिक जीवनात प्रामाणिकपणा व नैतिकता." } },
  ];

  return (
    <>
      <PageHeader
        eyebrow={L === "mr" ? "दृष्टी व ध्येय" : "Vision & Mission"}
        title={L === "mr" ? "आमची दृष्टी" : "Our Vision"}
        description={
          L === "mr"
            ? "जनहिताला केंद्रस्थानी ठेवणारे महाराष्ट्र घडवण्याचा आमचा संकल्प."
            : "Our resolve to build a Maharashtra centred on the public interest."
        }
      />

      <div className="section container-page">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-brand-50 p-8 md:p-10">
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-700 text-white">
              <Compass className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-2xl font-bold text-ink">
              {L === "mr" ? "आमची दृष्टी" : "Our Vision"}
            </h2>
            <p className="mt-3 leading-relaxed text-ink-soft">
              {L === "mr"
                ? "[अधिकृत दृष्टी विधान पक्षाकडून दिले जाईल.]"
                : "[Official vision statement to be provided by the party.]"}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-paper p-8 md:p-10">
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-ink text-white">
              <Target className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-2xl font-bold text-ink">
              {L === "mr" ? "आमचे ध्येय" : "Our Mission"}
            </h2>
            <p className="mt-3 leading-relaxed text-ink-soft">
              {L === "mr"
                ? "[अधिकृत ध्येय विधान पक्षाकडून दिले जाईल.]"
                : "[Official mission statement to be provided by the party.]"}
            </p>
          </div>
        </div>

        <div className="mt-12">
          <SectionHeading
            eyebrow={L === "mr" ? "मूल्ये" : "Values"}
            heading={L === "mr" ? "आमची मूल्ये" : "Our Values"}
            description={
              L === "mr"
                ? "आमच्या प्रत्येक कार्याचा पाया ही मूल्ये आहेत."
                : "These values form the foundation of all our work."
            }
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.title.en} className="rounded-xl border border-border bg-white p-6 shadow-card">
                <h3 className="text-lg font-semibold text-ink">
                  {L === "mr" ? v.title.mr : v.title.en}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {L === "mr" ? v.body.mr : v.body.en}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <SectionHeading
            eyebrow={L === "mr" ? "प्राधान्यक्रम" : "Focus Areas"}
            heading={L === "mr" ? "आमचे प्राधान्यक्रम" : "Our Focus Areas"}
          />
          <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title.en}
                  className="flex flex-col items-center gap-3 rounded-xl border border-border bg-white p-6 text-center shadow-card"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="font-semibold text-ink">
                    {L === "mr" ? p.title.mr : p.title.en}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

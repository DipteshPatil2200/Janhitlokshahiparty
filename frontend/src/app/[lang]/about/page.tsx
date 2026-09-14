import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeading } from "@/components/ui/section-heading";
import { LinkButton } from "@/components/ui/button";
import { SmartImage } from "@/components/ui/smart-image";
import { getSiteSettings, mapContact } from "@/lib/api";
import type { Locale } from "@/types";

interface Props {
  params: { lang: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const isMr = locale === "mr";
  return buildMetadata({
    title: isMr ? "आमच्याविषयी" : "About Us",
    description: isMr
      ? "जनहित लोकशाही पक्ष, महाराष्ट्र यांच्याविषयी."
      : "About Janhit Lokshahi Party, Maharashtra.",
    path: "/about",
    locale,
  });
}

export default async function AboutPage({ params }: Props) {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const L = locale;

  let settings;
  let contact;
  try {
    const s = await getSiteSettings();
    settings = s;
    contact = mapContact(s);
  } catch {
    settings = undefined;
    contact = undefined;
  }
  const aboutText = settings?.about?.[L] || "[Official introduction to be provided by the party.]";

  const sections = [
    {
      title: { en: "Who We Are", mr: "आम्ही कोण आहोत" },
      body: {
        en: aboutText,
        mr: settings?.about?.mr || aboutText,
      },
    },
    {
      title: { en: "Our Principles", mr: "आमची तत्त्वे" },
      body: {
        en: "We are guided by the principles of public interest, transparency, accountability, and inclusive development. [Official statement to be provided.]",
        mr: "जनहित, पारदर्शकता, जबाबदारी आणि सर्वसमावेशक विकास या तत्त्वांनी आम्ही मार्गदर्शित होतो. [अधिकृत विधान दिले जाईल.]",
      },
    },
    {
      title: { en: "Our Journey", mr: "आमचा प्रवास" },
      body: {
        en: "[Official party history to be provided by the party.]",
        mr: "[अधिकृत पक्षाचा इतिहास पक्षाकडून दिला जाईल.]",
      },
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow={L === "mr" ? "आमच्याविषयी" : "About Us"}
        title={L === "mr" ? "आमच्याविषयी" : "About Janhit Lokshahi Party"}
        description={
          L === "mr"
            ? "जनहित लोकशाही पक्ष, महाराष्ट्र — जनतेच्या आवाजासाठी वचनबद्ध."
            : "Janhit Lokshahi Party, Maharashtra — committed to the voice of the people."
        }
      />

      <div className="section container-page">
        <div className="mb-12 grid items-center gap-10 lg:grid-cols-2">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-stone-100">
            <SmartImage
              src={settings?.aboutImage || null}
              fit="cover"
              fallback={L === "mr" ? "[अधिकृत छायाचित्र]" : "[Official Photo]"}
              alt={L === "mr" ? "पक्षाच्या अधिकृत कार्यक्रमातील छायाचित्र" : "Official party programme"}
            />
          </div>
          <div className="space-y-8">
            {sections.map((s) => (
              <div key={s.title.en}>
                <h2 className="text-2xl font-bold text-ink">
                  {L === "mr" ? s.title.mr : s.title.en}
                </h2>
                <p className="mt-3 leading-relaxed text-ink-soft text-pretty">
                  {L === "mr" ? s.body.mr : s.body.en}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-paper p-8 md:p-10">
          <SectionHeading
            eyebrow={L === "mr" ? "संपर्क" : "Contact"}
            heading={L === "mr" ? "अधिक माहितीसाठी" : "For More Information"}
            description={
              L === "mr"
                ? "अधिकृत माहितीसाठी कृपया आमच्याशी संपर्क साधा."
                : "Please contact us for official information."
            }
          />
          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
            <a href={`tel:${contact?.phone || ""}`} className="font-medium text-brand-700 hover:underline">
              {contact?.phone || "—"}
            </a>
            <a href={`mailto:${contact?.email || ""}`} className="font-medium text-brand-700 hover:underline">
              {contact?.email || "—"}
            </a>
            <LinkButton href="/contact" locale={L} variant="outline" size="sm">
              {L === "mr" ? "संपर्क पृष्ठ" : "Contact Page"}
            </LinkButton>
          </div>
        </div>
      </div>
    </>
  );
}

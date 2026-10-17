import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/page-header";
import type { Locale } from "@/types";

interface Props {
  params: { lang: string; slug: string };
}

const legalDocs = {
  privacy: {
    title: { en: "Privacy Policy", mr: "गोपनीयता धोरण" },
    description: {
      en: "Read how this website handles information submitted through its forms.",
      mr: "या संकेतस्थळावरील फॉर्मद्वारे दिलेल्या माहितीचा वापर कसा केला जातो ते वाचा.",
    },
    sections: [
      {
        heading: { en: "Information We Collect", mr: "आम्ही गोळा करत असलेली माहिती" },
        body: {
          en: "When you submit forms on this website, we collect only the information you provide (such as name, contact details and messages). [Complete policy to be provided.]",
          mr: "या संकेतस्थळावर फॉर्म भरताना तुम्ही दिलेली माहिती (जसे नाव, संपर्क तपशील व संदेश) आम्ही गोळा करतो. [संपूर्ण धोरण दिले जाईल.]",
        },
      },
    ],
  },
  terms: {
    title: { en: "Terms of Use", mr: "वापराच्या अटी" },
    description: {
      en: "Review the terms for accessing and using the Janhit Lokshahi Party website.",
      mr: "जनहित लोकशाही पक्षाच्या संकेतस्थळाचा वापर करण्याच्या अटी जाणून घ्या.",
    },
    sections: [
      {
        heading: { en: "Acceptance of Terms", mr: "अटींची मान्यता" },
        body: {
          en: "By accessing this website you agree to these terms. [Complete terms to be provided.]",
          mr: "या संकेतस्थळाचा वापर करून तुम्ही या अटींना सहमती देता. [संपूर्ण अटी दिल्या जातील.]",
        },
      },
    ],
  },
  disclaimer: {
    title: { en: "Disclaimer", mr: "अस्वीकरण" },
    description: {
      en: "Read the general information and limitations that apply to this website.",
      mr: "या संकेतस्थळावरील सामान्य माहिती आणि तिच्या मर्यादांविषयी वाचा.",
    },
    sections: [
      {
        heading: { en: "General Information", mr: "सामान्य माहिती" },
        body: {
          en: "This website provides general information. [Complete disclaimer to be provided.]",
          mr: "हे संकेतस्थळ सामान्य माहिती पुरवते. [संपूर्ण अस्वीकरण दिले जाईल.]",
        },
      },
    ],
  },
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const doc = legalDocs[params.slug as keyof typeof legalDocs];
  if (!doc) return {};
  return buildMetadata({
    title: locale === "mr" ? doc.title.mr : doc.title.en,
    description: locale === "mr" ? doc.description.mr : doc.description.en,
    path: `/${params.slug}`,
    locale,
  });
}

export default function LegalPage({ params }: Props) {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const doc = legalDocs[params.slug as keyof typeof legalDocs];
  if (!doc) notFound();

  return (
    <>
      <PageHeader
        eyebrow={locale === "mr" ? "कायदेशीर" : "Legal"}
        title={locale === "mr" ? doc.title.mr : doc.title.en}
      />
      <div className="section container-page">
        <div className="mx-auto max-w-3xl space-y-8">
          {doc.sections.map((s) => (
            <section key={s.heading.en}>
              <h2 className="text-xl font-bold text-ink">
                {locale === "mr" ? s.heading.mr : s.heading.en}
              </h2>
              <p className="mt-3 leading-relaxed text-ink-soft">
                {locale === "mr" ? s.body.mr : s.body.en}
              </p>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}

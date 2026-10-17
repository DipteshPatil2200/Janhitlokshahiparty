import type { Metadata } from "next";
import { HeartHandshake } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/page-header";
import { VolunteerForm } from "@/components/forms/volunteer-form";
import type { Locale } from "@/types";

interface Props {
  params: { lang: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const isMr = locale === "mr";
  return buildMetadata({
    title: isMr ? "स्वयंसेवक" : "Volunteer",
    description: isMr
      ? "जनहित लोकशाही पक्षासोबत स्वयंसेवक व्हा."
      : "Volunteer with Janhit Lokshahi Party.",
    path: "/volunteer",
    locale,
  });
}

export default function VolunteerPage({ params }: Props) {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const L = locale;

  return (
    <>
      <PageHeader
        eyebrow={L === "mr" ? "स्वयंसेवक" : "Volunteer"}
        title={L === "mr" ? "स्वयंसेवक व्हा" : "Become a Volunteer"}
        description={
          L === "mr"
            ? "आपला वेळ व कौशल्य जनहितासाठी द्या. आजच नोंदणी करा."
            : "Give your time and skills to the public interest. Register today."
        }
      />

      <div className="section container-page">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-border bg-white p-6 shadow-card md:p-8">
              <VolunteerForm locale={locale} />
            </div>
          </div>
          <aside className="rounded-xl bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-white">
            <HeartHandshake className="h-10 w-10 text-brand-200" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-bold">
              {L === "mr" ? "तुमचे योगदान महत्त्वाचे" : "Your Contribution Matters"}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-100">
              {L === "mr"
                ? "प्रत्येक स्वयंसेवकाचा सहभाग आमच्या जनहित कार्याला बळ देतो. तुम्ही कोणताही कौशल्य सेट घेऊन या — तुमच्यासाठी एक भूमिका निश्चित आहे."
                : "Every volunteer strengthens our work for the people. Whatever your skills, there is a role for you."}
            </p>
          </aside>
        </div>
      </div>
    </>
  );
}

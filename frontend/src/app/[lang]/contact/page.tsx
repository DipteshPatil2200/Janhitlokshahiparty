import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/page-header";
import { getSiteSettings, mapContact } from "@/lib/api";
import { getLocalizedText } from "@/lib/i18n";
import { ContactForm } from "@/components/forms/contact-form";
import type { Locale } from "@/types";

interface Props {
  params: { lang: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const isMr = locale === "mr";
  return buildMetadata({
    title: isMr ? "संपर्क" : "Contact",
    description: isMr
      ? "जनहित लोकशाही पक्षाशी संपर्क साधा."
      : "Contact Janhit Lokshahi Party.",
    path: "/contact",
    locale,
  });
}

export default async function ContactPage({ params }: Props) {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const L = locale;

  let contact;
  try {
    contact = mapContact(await getSiteSettings());
  } catch {
    contact = undefined;
  }
  const phone = contact?.phone || "—";
  const email = contact?.email || "—";
  const address = contact?.address;

  const cards = [
    {
      icon: Phone,
      label: L === "mr" ? "दूरध्वनी" : "Phone",
      value: phone,
      href: `tel:${phone}`,
    },
    {
      icon: Mail,
      label: L === "mr" ? "ईमेल" : "Email",
      value: email,
      href: `mailto:${email}`,
    },
    {
      icon: MapPin,
      label: L === "mr" ? "मुख्यालय" : "Head Office",
      value: address ? getLocalizedText(address, L) : "—",
    },
    {
      icon: Clock,
      label: L === "mr" ? "कार्यालयीन वेळ" : "Office Hours",
      value: (L === "mr" ? "[वेळ]" : "[Hours]"),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow={L === "mr" ? "संपर्क" : "Contact"}
        title={L === "mr" ? "आमच्याशी संपर्क साधा" : "Contact Us"}
        description={
          L === "mr"
            ? "अधिकृत माहितीसाठी कृपया संपर्क साधा."
            : "Please reach out to us for official information."
        }
      />

      <div className="section container-page">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-ink">
              {L === "mr" ? "संपर्क माहिती" : "Contact Information"}
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {cards.map((c) => {
                const Icon = c.icon;
                return (
                  <div
                    key={c.label}
                    className="rounded-xl border border-border bg-white p-5 shadow-card"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                      {c.label}
                    </p>
                    {c.href ? (
                      <a
                        href={c.href}
                        className="mt-1 block font-medium text-ink hover:text-brand-700"
                      >
                        {c.value}
                      </a>
                    ) : (
                      <p className="mt-1 font-medium text-ink">{c.value}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-card md:p-8">
            <h2 className="text-2xl font-bold text-ink">
              {L === "mr" ? "संदेश पाठवा" : "Send a Message"}
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              {L === "mr"
                ? "खालील फॉर्म भरा, आम्ही लवकरात लवकर उत्तर देऊ."
                : "Fill out the form and we will get back to you as soon as possible."}
            </p>
            <div className="mt-6">
              <ContactForm locale={locale} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

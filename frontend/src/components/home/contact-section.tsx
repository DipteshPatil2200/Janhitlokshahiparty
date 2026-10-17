import { Phone, Mail, MapPin } from "lucide-react";
import { contact as staticContact } from "@/data/site";
import { getLocalizedText } from "@/lib/i18n";
import { SectionHeading } from "@/components/ui/section-heading";
import { LinkButton } from "@/components/ui/button";
import type { Locale, SiteSettings } from "@/types";

export function ContactSection({ locale, settings }: { locale: Locale; settings?: SiteSettings }) {
  const contact = {
    phone: settings?.contactPhone || staticContact.phone,
    email: settings?.contactEmail || staticContact.email,
    address: {
      en: settings?.address?.en || staticContact.address.en,
      mr: settings?.address?.mr || staticContact.address.mr,
    },
  };
  const items = [
    {
      icon: Phone,
      label: locale === "mr" ? "दूरध्वनी" : "Phone",
      value: contact.phone,
      href: `tel:${contact.phone}`,
    },
    {
      icon: Mail,
      label: locale === "mr" ? "ईमेल" : "Email",
      value: contact.email,
      href: `mailto:${contact.email}`,
    },
    {
      icon: MapPin,
      label: locale === "mr" ? "पत्ता" : "Address",
      value: getLocalizedText(contact.address, locale),
    },
  ];

  return (
    <section className="section bg-paper">
      <div className="container-page">
        <SectionHeading
          eyebrow={locale === "mr" ? "संपर्क" : "Contact"}
          heading={locale === "mr" ? "आमच्याशी संपर्क साधा" : "Get in Touch"}
          description={
            locale === "mr"
              ? "कृपया अधिकृत माहितीसाठी आमच्याशी संपर्क साधा."
              : "Please reach out to us for official information."
          }
          align="center"
          className="mx-auto"
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {items.map((c) => {
            const Icon = c.icon;
            const inner = (
              <div className="flex h-full flex-col items-center gap-3 rounded-xl border border-border bg-white p-6 text-center shadow-card">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  {c.label}
                </span>
                <span className="text-sm font-medium text-ink">{c.value}</span>
              </div>
            );
            return c.href ? (
              <a key={c.label} href={c.href} className="block">
                {inner}
              </a>
            ) : (
              <div key={c.label}>{inner}</div>
            );
          })}
        </div>
        <div className="mt-8 text-center">
          <LinkButton href="/contact" locale={locale} variant="outline">
            {locale === "mr" ? "संपर्क पृष्ठ पहा" : "Contact Page"}
          </LinkButton>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Send,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import {
  siteConfig,
  nav as navItems,
  socials as staticSocials,
  contact as staticContact,
  siteFooter,
} from "@/data/site";
import { getLocalizedText, localizePath } from "@/lib/i18n";
import { Logo } from "@/components/logo";
import type { ContactInfo, Locale, SiteSettings, SocialLink } from "@/types";

const socialIcons = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  telegram: Send,
  whatsapp: Mail,
};

export function Footer({
  locale,
  socials,
  contact,
  settings,
}: {
  locale: Locale;
  socials?: SocialLink[];
  contact?: ContactInfo;
  settings?: SiteSettings;
}) {
  const L = locale;
  const socialItems = (socials?.length ? socials : staticSocials).filter(
    (s) => s.href && s.href !== "#"
  );
  const contactInfo = contact ?? staticContact;
  const siteName = settings?.siteName?.[L] || (L === "mr" ? siteConfig.nameMarathi : siteConfig.name);
  const description =
    settings?.about?.[L] || (L === "mr" ? siteConfig.description.mr : siteConfig.description.en);
  return (
    <footer className="border-t border-white/10 bg-green-900 text-green-100">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="[&_span]:!text-white">
              <Logo locale={L} settings={settings} />
            </div>
            <p className="text-sm leading-relaxed text-green-100/80">
              {description}
            </p>
            <div className="flex gap-2">
              {socialItems.map((s) => {
                const Icon = socialIcons[s.platform];
                return (
                  <a
                    key={s.platform}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-md bg-white/10 text-green-100 transition-colors hover:bg-brand-500 hover:text-white"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gold-light">
              {L === "mr" ? "संपर्क" : "Contact"}
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-light" aria-hidden="true" />
                <span>{getLocalizedText(contactInfo.address, L)}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-gold-light" aria-hidden="true" />
                <a href={`tel:${contactInfo.phone}`} className="hover:text-white">
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-gold-light" aria-hidden="true" />
                <a href={`mailto:${contactInfo.email}`} className="hover:text-white">
                  {contactInfo.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gold-light">
              {L === "mr" ? "द्रुत दुवे" : "Quick Links"}
            </h3>
            <ul className="grid grid-cols-1 gap-2 text-sm">
              {navItems.slice(0, 6).map((item) => (
                <li key={item.href}>
                  <Link
                    href={localizePath(item.href, L)}
                    className="text-green-100/80 transition-colors hover:text-white"
                  >
                    {getLocalizedText(item.label, L)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gold-light">
              {L === "mr" ? "समर्थन करा" : "Get Involved"}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={localizePath("/join-us", L)} className="text-green-100/80 hover:text-white">
                  {L === "mr" ? "पक्षात सामील व्हा" : "Join the Party"}
                </Link>
              </li>
              <li>
                <Link href={localizePath("/volunteer", L)} className="text-green-100/80 hover:text-white">
                  {L === "mr" ? "स्वयंसेवक व्हा" : "Volunteer"}
                </Link>
              </li>
              <li>
                <Link href={localizePath("/donation", L)} className="text-green-100/80 hover:text-white">
                  {L === "mr" ? "देणगी द्या" : "Donate"}
                </Link>
              </li>
              <li>
                <Link href={localizePath("/contact", L)} className="text-green-100/80 hover:text-white">
                  {L === "mr" ? "संपर्क साधा" : "Contact"}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-green-200/60">
            © {new Date().getFullYear()} {siteName}.{" "}
            {L === "mr" ? "सर्व हक्क राखीव." : "All rights reserved."}
          </p>
          <ul className="flex flex-wrap items-center gap-4 text-xs">
            {siteFooter.legal.map((l) => (
              <li key={l.href}>
                <Link
                  href={localizePath(l.href, L)}
                  className="text-green-200/60 transition-colors hover:text-white"
                >
                  {getLocalizedText(l.label, L)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

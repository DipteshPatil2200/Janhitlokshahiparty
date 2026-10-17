import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/data/site";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  getSiteSettings,
  getPublicBundle,
  mapContact,
  mapSocials,
} from "@/lib/api";
import type { Locale, SiteSettings } from "@/types";

// Root layout for a locale segment (en/mr).

interface Props {
  children: React.ReactNode;
  params: { lang: string };
}

// Fetch the single settings document (the public/site-settings endpoint is
// uncached and fast). Falls back to static config if the API is offline.
async function loadSettings(): Promise<SiteSettings | null> {
  try {
    const s = await getSiteSettings();
    return s as SiteSettings;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = params.lang as "en" | "mr";
  const isMr = lang === "mr";
  const settings = await loadSettings();

  const siteName = settings?.siteName?.[lang] || (isMr ? siteConfig.nameMarathi : siteConfig.name);
  const tagline = settings?.tagline?.[lang] || (isMr ? siteConfig.tagline.mr : siteConfig.tagline.en);
  const description =
    settings?.about?.[lang] || (isMr ? siteConfig.description.mr : siteConfig.description.en);

  const title = `${siteName}${tagline ? ` · ${tagline}` : ""}`;

  return {
    title: { default: title, template: `%s · ${siteName}` },
    description,
    openGraph: {
      title,
      description,
      locale: isMr ? "mr_IN" : "en_IN",
      alternateLocale: isMr ? "en_IN" : "mr_IN",
      type: "website",
      siteName,
      images: settings?.logo ? [{ url: settings.logo }] : undefined,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#B15000",
};

export default async function LocaleLayout({ children, params }: Props) {
  const lang = (params.lang === "mr" ? "mr" : "en") as Locale;

  // Content comes from the backend. If the API is briefly unavailable we fall
  // back to the static config so the site still renders.
  let announcement;
  let socials;
  let contact;
  let pageSettings: SiteSettings | undefined;
  try {
    const [settings, bundle] = await Promise.all([
      getSiteSettings(),
      getPublicBundle(),
    ]);
    pageSettings = settings as SiteSettings;
    announcement = {
      enabled: !!settings.announcementEnabled,
      text: {
        en: settings.announcement?.en || "",
        mr: settings.announcement?.mr || "",
      },
      href: "/about" as const,
    };
    socials = mapSocials(bundle.socials, settings);
    contact = mapContact(settings);
  } catch {
    announcement = undefined;
    socials = undefined;
    contact = undefined;
  }

  return (
    <LocaleProvider locale={lang}>
      <div className="flex min-h-screen flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:shadow"
        >
          {lang === "mr" ? "मुख्य सामग्रीकडे जा" : "Skip to main content"}
        </a>
        <Header locale={lang} announcement={announcement} settings={pageSettings} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer
          locale={lang}
          socials={socials}
          contact={contact}
          settings={pageSettings}
        />
      </div>
    </LocaleProvider>
  );
}

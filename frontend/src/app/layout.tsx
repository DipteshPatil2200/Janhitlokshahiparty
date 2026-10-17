import type { Metadata, Viewport } from "next";
import { Inter as FontInter } from "next/font/google";
import { Mukta as FontMukta } from "next/font/google";
import { headers } from "next/headers";
import { siteConfig } from "@/data/site";
import { serializeJsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = FontInter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mukta = FontMukta({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mukta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
    verification: {

    google: "zZDATTtbn6EjENBkEFree78RDYrkY21Tac9jxNX3RZM",

  },
  title: {
    default: `${siteConfig.name} · ${siteConfig.tagline.en}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description.en,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} · ${siteConfig.tagline.en}`,
    description: siteConfig.description.en,
    url: siteConfig.url,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} · ${siteConfig.tagline.en}`,
    description: siteConfig.description.en,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#B15000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const headerList = headers();
  const locale = (headerList.get("x-locale") === "mr" ? "mr" : "en") as "en" | "mr";
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.name,
        url: siteConfig.url,
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        name: locale === "mr" ? siteConfig.nameMarathi : siteConfig.name,
        url: siteConfig.url,
        inLanguage: locale === "mr" ? "mr-IN" : "en-IN",
        publisher: { "@id": `${siteConfig.url}/#organization` },
      },
    ],
  };

  return (
    <html lang={locale} className={cn(inter.variable, mukta.variable)}>
      <body className="min-h-screen bg-white font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}

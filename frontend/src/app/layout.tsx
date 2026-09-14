import type { Metadata, Viewport } from "next";
import { Inter as FontInter } from "next/font/google";
import { Mukta as FontMukta } from "next/font/google";
import { headers } from "next/headers";
import { siteConfig } from "@/data/site";
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
  return (
    <html lang={locale} className={cn(inter.variable, mukta.variable)}>
      <body className="min-h-screen bg-white font-sans">{children}</body>
    </html>
  );
}

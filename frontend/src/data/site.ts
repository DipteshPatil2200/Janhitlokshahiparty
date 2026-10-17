import type {
  Announcement,
  ContactInfo,
  NavItem,
  SocialLink,
} from "@/types";

// =============================================================
// SITE CONFIGURATION (single source of truth)
// -------------------------------------------------------------
// PLACEHOLDER data until official content is provided.
// Replace values below as the party supplies official details.
// =============================================================

export const siteConfig = {
  name: "Janhit Lokshahi Party",
  nameMarathi: "जनहित लोकशाही पक्ष",
  shortName: "JLP",
  // Official domain — replace when confirmed.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://janhit-lokshahi.in",
  tagline: {
    en: "For the Public Interest (Janhit)",
    mr: "जनहितासाठी",
  },
  description: {
    en: "Official website of Janhit Lokshahi Party, Maharashtra.",
    mr: "जनहित लोकशाही पक्ष, महाराष्ट्र यांचे अधिकृत संकेतस्थळ.",
  },
  localeDefault: "en" as const,
  locales: ["en", "mr"] as const,
} as const;

export const announcement: Announcement = {
  enabled: true,
  text: {
    en: "Welcome to the official website of Janhit Lokshahi Party, Maharashtra.",
    mr: "जनहित लोकशाही पक्ष, महाराष्ट्र यांच्या अधिकृत संकेतस्थळावर आपले स्वागत आहे.",
  },
  href: "/about",
};

export const nav: NavItem[] = [
  { label: { en: "Home", mr: "मुखपृष्ठ" }, href: "/" },
  { label: { en: "About", mr: "आमच्याविषयी" }, href: "/about" },
  {
    label: { en: "Leadership", mr: "नेते" },
    href: "/leadership",
  },
  { label: { en: "Vision", mr: "दृष्टी" }, href: "/vision" },
  { label: { en: "Organization", mr: "संघटना" }, href: "/organization" },
  {
    label: { en: "Media", mr: "मीडिया" },
    href: "/news",
    items: [
      { label: { en: "News", mr: "बातम्या" }, href: "/news" },
      { label: { en: "Campaigns", mr: "मोहिमा" }, href: "/campaigns" },
      { label: { en: "Events", mr: "कार्यक्रम" }, href: "/events" },
      { label: { en: "Gallery", mr: "छायाचित्रे" }, href: "/gallery" },
      { label: { en: "Videos", mr: "व्हिडिओ" }, href: "/videos" },
      { label: { en: "Documents", mr: "कागदपत्रे" }, href: "/documents" },
    ],
  },
  { label: { en: "Donate", mr: "देणगी" }, href: "/donation" },
  { label: { en: "Contact", mr: "संपर्क" }, href: "/contact" },
];

export const socials: SocialLink[] = [
  { platform: "facebook", label: "Facebook", href: "#" },
  { platform: "twitter", label: "Twitter / X", href: "#" },
  { platform: "instagram", label: "Instagram", href: "#" },
  { platform: "youtube", label: "YouTube", href: "#" },
  { platform: "telegram", label: "Telegram", href: "#" },
  { platform: "whatsapp", label: "WhatsApp", href: "#" },
];

// PLACEHOLDER contact details — update with official information.
export const contact: ContactInfo = {
  phone: "+91-XXXXXXXXXX",
  email: "contact@janhitlokshahi.in",
  address: {
    en: "[Official Address, Placeholder] Maharashtra, India",
    mr: "[अधिकृत पत्ता, प्लेसहोल्डर] महाराष्ट्र, भारत",
  },
};

export const siteFooter = {
  legal: [
    { label: { en: "Privacy Policy", mr: "गोपनीयता धोरण" }, href: "/privacy" },
    { label: { en: "Terms of Use", mr: "वापराच्या अटी" }, href: "/terms" },
    { label: { en: "Disclaimer", mr: "अस्वीकरण" }, href: "/disclaimer" },
  ],
};

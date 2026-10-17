import Link from "next/link";
import { UserPlus, HeartHandshake, HandCoins, Eye, Newspaper } from "lucide-react";
import { getLocalizedText, localizePath } from "@/lib/i18n";
import type { Locale } from "@/types";

const actions = [
  {
    key: "join",
    icon: UserPlus,
    title: { en: "Join Us", mr: "सामील व्हा" },
    desc: { en: "Become a member of the party", mr: "पक्षाचे सदस्य व्हा" },
    href: "/join-us",
    accent: "bg-brand-500/10 text-brand-700 group-hover:bg-brand-500 group-hover:text-white",
  },
  {
    key: "volunteer",
    icon: HeartHandshake,
    title: { en: "Volunteer", mr: "स्वयंसेवक" },
    desc: { en: "Contribute your time and skills", mr: "आपला वेळ व कौशल्य द्या" },
    href: "/volunteer",
    accent: "bg-green-700/10 text-green-700 group-hover:bg-green-700 group-hover:text-white",
  },
  {
    key: "donate",
    icon: HandCoins,
    title: { en: "Donate", mr: "देणगी" },
    desc: { en: "Support the people's cause", mr: "जनहित कार्यास साथ द्या" },
    href: "/donation",
    accent: "bg-brand-500/10 text-brand-700 group-hover:bg-brand-500 group-hover:text-white",
  },
  {
    key: "vision",
    icon: Eye,
    title: { en: "Our Vision", mr: "आमची दृष्टी" },
    desc: { en: "Learn about our values", mr: "आमच्या मूल्यांबद्दल जाणून घ्या" },
    href: "/vision",
    accent: "bg-green-700/10 text-green-700 group-hover:bg-green-700 group-hover:text-white",
  },
  {
    key: "news",
    icon: Newspaper,
    title: { en: "Latest News", mr: "ताज्या बातम्या" },
    desc: { en: "Stay informed", mr: "माहितीत राहा" },
    href: "/news",
    accent: "bg-brand-500/10 text-brand-700 group-hover:bg-brand-500 group-hover:text-white",
  },
];

export function QuickActions({ locale }: { locale: Locale }) {
  return (
    <section className="container-page relative z-20 -mt-10">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <li key={a.key}>
              <Link
                href={localizePath(a.href, locale)}
                className="group flex h-full flex-col items-start gap-3 rounded-xl border border-border bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-elevated"
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-lg transition-colors ${a.accent}`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-semibold text-ink">
                    {getLocalizedText(a.title, locale)}
                  </span>
                  <span className="mt-0.5 block text-sm text-ink-muted">
                    {getLocalizedText(a.desc, locale)}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

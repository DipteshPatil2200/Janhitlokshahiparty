// "use client";

// import * as React from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Menu, X, ChevronRight } from "lucide-react";
// import { announcement as staticAnnouncement } from "@/data/site";
// import { getLocalizedText, localizePath } from "@/lib/i18n";
// import { useLocale } from "@/components/providers/locale-provider";
// import { LanguageSwitcher } from "@/components/language-switcher";
// import { Logo } from "@/components/logo";
// import { cn } from "@/lib/utils";
// import type { Announcement, Locale, SiteSettings } from "@/types";
// import { Navigation } from "./navigation";
// import { MobileMenu } from "./mobile-menu";

// export function Header({
//   locale,
//   announcement,
//   settings,
// }: {
//   locale: Locale;
//   announcement?: Announcement;
//   settings?: SiteSettings;
// }) {
//   const [mobileOpen, setMobileOpen] = React.useState(false);
//   const [scrolled, setScrolled] = React.useState(false);
//   const pathname = usePathname();
//   const { locale: activeLocale } = useLocale();
//   const L = locale ?? activeLocale;
//   const ann = announcement ?? staticAnnouncement;

//   React.useEffect(() => {
//     setMobileOpen(false);
//   }, [pathname]);

//   // Shrink the header (and hide the announcement bar) once the user
//   // scrolls, so the sticky header stays compact without layout jumps.
//   React.useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 24);
//     onScroll();
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   const headerHeight = scrolled ? "h-14 md:h-16" : "h-16 md:h-20";

//   return (
//     <header
//       className={cnSticky(scrolled)}
//     >
//       {/* Top announcement bar — deep green accent */}
//       <div
//         className={cnBar(scrolled)}
//         aria-hidden={scrolled}
//       >
//         <div className="container-page flex min-h-9 items-center justify-center gap-2 py-1 text-center text-xs font-medium text-white sm:text-sm">
//           <span>{getLocalizedText(ann.text, L)}</span>
//           {ann.href ? (
//             <Link
//               href={localizePath(ann.href, L)}
//               className="inline-flex items-center gap-0.5 font-semibold text-gold-light underline-offset-2 hover:underline"
//             >
//               {L === "mr" ? "अधिक" : "More"}
//               <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
//             </Link>
//           ) : null}
//         </div>
//       </div>

//       <div className="border-b border-border bg-white/95 backdrop-blur transition-shadow">
//         <div className="container-page">
//           <div
//             className={cn(
//               "flex items-center justify-between gap-4 transition-all duration-200",
//               headerHeight
//             )}
//           >
//             <Logo locale={L} settings={settings} />

//             <Navigation locale={L} className="hidden lg:flex" />

//             <div className="flex items-center gap-2 sm:gap-2.5">
//               <LanguageSwitcher className="hidden sm:inline-flex" />
//               <Link
//                 href={localizePath("/donation", L)}
//                 className="hidden rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-600 sm:inline-flex"
//               >
//                 {L === "mr" ? "देणगी द्या" : "Donate"}
//               </Link>
//               <Link
//                 href={localizePath("/join-us", L)}
//                 className="hidden rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-800 md:inline-flex"
//               >
//                 {L === "mr" ? "सामील व्हा" : "Join Us"}
//               </Link>
//               <button
//                 type="button"
//                 onClick={() => setMobileOpen((v) => !v)}
//                 aria-expanded={mobileOpen}
//                 aria-controls="mobile-menu"
//                 aria-label={mobileOpen ? "Close menu" : "Open menu"}
//                 className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink hover:bg-green-50 lg:hidden"
//               >
//                 {mobileOpen ? (
//                   <X className="h-6 w-6" aria-hidden="true" />
//                 ) : (
//                   <Menu className="h-6 w-6" aria-hidden="true" />
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <MobileMenu open={mobileOpen} locale={L} onClose={() => setMobileOpen(false)} />
//     </header>
//   );
// }

// function cnSticky(scrolled: boolean) {
//   return `sticky top-0 z-50 w-full ${scrolled ? "shadow-card" : ""}`;
// }

// function cnBar(scrolled: boolean) {
//   return `bg-green-800 overflow-hidden transition-all duration-300 ${
//     scrolled ? "max-h-0" : "max-h-12"
//   }`;
// }

// nikhil

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronRight } from "lucide-react";
import { announcement as staticAnnouncement } from "@/data/site";
import { getLocalizedText, localizePath } from "@/lib/i18n";
import { useLocale } from "@/components/providers/locale-provider";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import type { Announcement, Locale, SiteSettings } from "@/types";
import { Navigation } from "./navigation";
import { MobileMenu } from "./mobile-menu";

export function Header({
  locale,
  announcement,
  settings,
}: {
  locale: Locale;
  announcement?: Announcement;
  settings?: SiteSettings;
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = usePathname();
  const { locale: activeLocale } = useLocale();
  const L = locale ?? activeLocale;
  const ann = announcement ?? staticAnnouncement;

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Shrink the header (and hide the announcement bar) once the user
  // scrolls, so the sticky header stays compact without layout jumps.
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keep enough vertical space for the official mark at its readable size.
  // The compact state is still intentionally generous so the logo is never clipped.
  const headerHeight = scrolled ? "h-16 md:h-20" : "h-20 md:h-24";

  return (
    <header className={cnSticky(scrolled)}>
      {/* Top announcement bar — deep green accent */}
      <div className={cnBar(scrolled)} aria-hidden={scrolled}>
        <div className="container-page flex min-h-9 items-center justify-center gap-2 py-1 text-center text-xs font-medium text-white sm:text-sm">
          <span>{getLocalizedText(ann.text, L)}</span>
          {ann.href ? (
            <Link
              href={localizePath(ann.href, L)}
              className="inline-flex items-center gap-0.5 font-semibold text-gold-light underline-offset-2 hover:underline"
            >
              {L === "mr" ? "अधिक" : "More"}
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          ) : null}
        </div>
      </div>

      <div className="border-b border-border bg-white/95 backdrop-blur transition-shadow">
        <div className="container-page">
          <div
            className={cn(
              "flex items-center justify-between gap-4 transition-all duration-200",
              headerHeight,
            )}
          >
            <Logo locale={L} settings={settings} />

            <Navigation locale={L} className="hidden lg:flex" />

            <div className="flex items-center gap-2 sm:gap-2.5">
              <LanguageSwitcher className="hidden sm:inline-flex" />
              <Link
                href={localizePath("/donation", L)}
                className="hidden rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-600 sm:inline-flex"
              >
                {L === "mr" ? "देणगी द्या" : "Donate"}
              </Link>
              <Link
                href={localizePath("/join-us", L)}
                className="hidden rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-800 md:inline-flex"
              >
                {L === "mr" ? "सामील व्हा" : "Join Us"}
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink hover:bg-green-50 lg:hidden"
              >
                {mobileOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <MobileMenu
        open={mobileOpen}
        locale={L}
        onClose={() => setMobileOpen(false)}
      />
    </header>
  );
}

function cnSticky(scrolled: boolean) {
  return `sticky top-0 z-50 w-full ${scrolled ? "shadow-card" : ""}`;
}

function cnBar(scrolled: boolean) {
  return `bg-green-800 overflow-hidden transition-all duration-300 ${
    scrolled ? "max-h-0" : "max-h-12"
  }`;
}

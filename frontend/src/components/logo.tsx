// "use client";

// import * as React from "react";
// import Link from "next/link";
// import { siteConfig } from "@/data/site";
// import { getLocalizedText, localizePath } from "@/lib/i18n";
// import type { Locale, SiteSettings } from "@/types";
// import { cn } from "@/lib/utils";

// // ------------------------------------------------------------------
// // OFFICIAL LOGO
// // Resolution order (most preferred first):
// //   1. Uploaded logo URL stored in Site Settings (admin: Settings → Logo)
// //   2. Static asset dropped at `public/brand/logo.svg` or `public/brand/logo.png`
// //   3. Emblem-style placeholder in the party colors (saffron/green)
// //
// // If the chosen image fails to load we fall back automatically, so a
// // missing or invalid URL never leaves a broken image in the header.
// // ------------------------------------------------------------------

// const LOGO_IMG = "/brand/logo.png";
// const LOGO_SVG = "/brand/logo.svg";

// function LogoMark({ src, className }: { src: string; className?: string }) {
//   const [errored, setErrored] = React.useState(false);

//   if (!src || errored) {
//     return <EmblemMark className={className} />;
//   }

//   return (
//     // next/image requires the src to exist at build/SSR time; uploaded
//     // logos are dynamic, so we use a plain img with an onError fallback.
//     // eslint-disable-next-line @next/next/no-img-element
//     <img
//       src={src}
//       alt=""
//       onError={() => setErrored(true)}
//       className={cn("h-12 w-auto object-contain", className)}
//       aria-hidden="true"
//     />
//   );
// }

// function EmblemMark({ className }: { className?: string }) {
//   return (
//     <span
//       className={cn(
//         "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-brand-400 bg-green-800",
//         className
//       )}
//       aria-hidden="true"
//     >
//       {/* Emblem-inspired inner ring notch (saffron -> gold) */}
//       <span className="absolute -inset-1 rounded-full border border-brand-500/40" />
//       <span className="font-display text-sm font-extrabold text-brand-200">
//         JL
//       </span>
//     </span>
//   );
// }

// export function Logo({
//   locale,
//   className,
//   settings,
// }: {
//   locale: Locale;
//   className?: string;
//   settings?: SiteSettings;
// }) {
//   const name = settings?.siteName?.[locale] || (locale === "mr" ? siteConfig.nameMarathi : siteConfig.name);
//   const tagline = settings?.tagline?.[locale] || getLocalizedText(siteConfig.tagline, locale);
//   // Preferred logo: admin-uploaded settings.logo, else static brand files.
//   const logo =
//     settings?.logo ||
//     LOGO_IMG;

//   return (
//     <Link
//       href={localizePath("/", locale)}
//       className={cn("flex items-center gap-3", className)}
//       aria-label={name}
//     >
//       <LogoMark src={logo} />
//       <span className="flex flex-col leading-tight">
//         <span className="font-display text-[15px] font-bold tracking-tight text-ink dark:text-white sm:text-base">
//           {name}
//         </span>
//         {tagline ? (
//           <span className="text-[11px] font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
//             {tagline}
//           </span>
//         ) : null}
//       </span>
//     </Link>
//   );
// }

// nikhil

"use client";

import * as React from "react";
import Link from "next/link";
import { siteConfig } from "@/data/site";
import { getLocalizedText, localizePath } from "@/lib/i18n";
import type { Locale, SiteSettings } from "@/types";
import { cn } from "@/lib/utils";

// ------------------------------------------------------------------
// OFFICIAL LOGO
// Resolution order (most preferred first):
//   1. Uploaded logo URL stored in Site Settings (admin: Settings → Logo)
//   2. Static asset dropped at `public/brand/logo.svg` or `public/brand/logo.png`
//   3. Emblem-style placeholder in the party colors (saffron/green)
//
// If the chosen image fails to load we fall back automatically, so a
// missing or invalid URL never leaves a broken image in the header.
// ------------------------------------------------------------------

const LOGO_IMG = "/brand/logo.png";
const LOGO_SVG = "/brand/logo.svg";

function LogoMark({ src, className }: { src: string; className?: string }) {
  const [errored, setErrored] = React.useState(false);

  if (!src || errored) {
    return <EmblemMark className={className} />;
  }

  return (
    // next/image requires the src to exist at build/SSR time; uploaded
    // logos are dynamic, so we use a plain img with an onError fallback.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={48}
      height={48}
      onError={() => setErrored(true)}
      className={cn(
        "h-14 w-14 shrink-0 object-contain sm:h-20 sm:w-20",
        className,
      )}
      aria-hidden="true"
    />
  );
}

function EmblemMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-brand-400 bg-green-800 sm:h-20 sm:w-20",
        className,
      )}
      aria-hidden="true"
    >
      {/* Emblem-inspired inner ring notch (saffron -> gold) */}
      <span className="absolute -inset-1 rounded-full border border-brand-500/40" />
      <span className="font-display text-sm font-extrabold text-brand-200">
        JL
      </span>
    </span>
  );
}

export function Logo({
  locale,
  className,
  settings,
}: {
  locale: Locale;
  className?: string;
  settings?: SiteSettings;
}) {
  const name =
    settings?.siteName?.[locale] ||
    (locale === "mr" ? siteConfig.nameMarathi : siteConfig.name);
  const tagline =
    settings?.tagline?.[locale] || getLocalizedText(siteConfig.tagline, locale);
  // Preferred logo: admin-uploaded settings.logo, else static brand files.
  const logo = settings?.logo || LOGO_IMG;

  return (
    <Link
      href={localizePath("/", locale)}
      className={cn("flex min-w-0 items-center gap-2 sm:gap-3", className)}
      aria-label={name}
    >
      <LogoMark src={logo} />
      <span className="flex min-w-0 flex-col justify-center leading-tight">
        <span
          className={cn(
            "font-display whitespace-nowrap font-bold tracking-tight text-ink dark:text-white",
            // Kept deliberately compact and always single-line so it fits
            // next to the full nav at the same breakpoint the Marathi
            // version uses — this is the only lever we're allowed to pull.
            "text-[12px] sm:text-[13px] lg:text-[14px] xl:text-[15px]",
          )}
        >
          {name}
        </span>
        {tagline ? (
          <span
            className={cn(
              "whitespace-nowrap font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400",
              "text-[8px] sm:text-[9px] lg:text-[10px] xl:text-[11px]",
            )}
          >
            {tagline}
          </span>
        ) : null}
      </span>
    </Link>
  );
}

// "use client";

// import * as React from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { ChevronDown } from "lucide-react";
// import { nav as navItems } from "@/data/site";
// import { getLocalizedText, localizePath, stripLocalePrefix } from "@/lib/i18n";
// import { cn } from "@/lib/utils";
// import type { Locale } from "@/types";

// export function Navigation({ locale, className }: { locale: Locale; className?: string }) {
//   const pathname = usePathname();
//   const currentPath = stripLocalePrefix(pathname);

//   return (
//     <nav className={cn("items-center", className)} aria-label={locale === "mr" ? "मुख्य नेव्हिगेशन" : "Main navigation"}>
//       <ul className="flex items-center gap-1">
//         {navItems.map((item) => {
//           const hasChildren = !!item.items?.length;
//           const active = !hasChildren && currentPath === item.href;
//           const parent = (
//             <span
//               className={cn(
//                 "relative inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
//                 active
//                   ? "text-brand-700"
//                   : "text-ink-soft hover:bg-green-50 hover:text-ink"
//               )}
//             >
//               {getLocalizedText(item.label, locale)}
//               {hasChildren ? (
//                 <ChevronDown className="h-3.5 w-3.5 text-ink-muted" aria-hidden="true" />
//               ) : null}
//               {/* Saffron underline on the active item */}
//               {active ? (
//                 <span
//                   className="absolute inset-x-3 -bottom-[3px] h-0.5 rounded-full bg-brand-500"
//                   aria-hidden="true"
//                 />
//               ) : null}
//             </span>
//           );

//           return (
//             <li key={item.href} className="relative group">
//               {hasChildren ? (
//                 <>
//                   <Link href={localizePath(item.items![0].href, locale)} className="block rounded-md px-2 py-1">
//                     {parent}
//                   </Link>
//                   <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
//                     <ul className="w-52 rounded-lg border border-border bg-white p-2 shadow-elevated">
//                       {item.items!.map((child) => (
//                         <li key={child.href}>
//                           <Link
//                             href={localizePath(child.href, locale)}
//                             className="block rounded-md px-3 py-2 text-sm text-ink-soft hover:bg-green-50 hover:text-ink"
//                           >
//                             {getLocalizedText(child.label, locale)}
//                           </Link>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </>
//               ) : (
//                 <Link href={localizePath(item.href, locale)} className="block rounded-md px-2 py-1">
//                   {parent}
//                 </Link>
//               )}
//             </li>
//           );
//         })}
//       </ul>
//     </nav>
//   );
// }

// nikhil

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { nav as navItems } from "@/data/site";
import { getLocalizedText, localizePath, stripLocalePrefix } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types";

export function Navigation({
  locale,
  className,
}: {
  locale: Locale;
  className?: string;
}) {
  const pathname = usePathname();
  const currentPath = stripLocalePrefix(pathname);

  // English words run wider than their Marathi equivalents, so the same
  // padding/gap that fits Marathi comfortably can squeeze English into
  // overlap with the logo or the action buttons. Tightening spacing only
  // for English keeps Marathi's existing, already-correct look untouched.
  const isEnglish = locale !== "mr";

  const listGap = isEnglish ? "gap-0" : "gap-1";
  const linkPad = isEnglish ? "px-1" : "px-2";
  const itemPad = isEnglish ? "px-2 py-2" : "px-3 py-2";
  const itemGap = isEnglish ? "gap-0.5" : "gap-1";
  const itemText = isEnglish ? "text-[13px]" : "text-sm";

  return (
    <nav
      className={cn("items-center", className)}
      aria-label={locale === "mr" ? "मुख्य नेव्हिगेशन" : "Main navigation"}
    >
      <ul className={cn("flex items-center", listGap)}>
        {navItems.map((item) => {
          const hasChildren = !!item.items?.length;
          const active = !hasChildren && currentPath === item.href;
          const parent = (
            <span
              className={cn(
                "relative inline-flex items-center rounded-md font-medium transition-colors",
                itemGap,
                itemPad,
                itemText,
                active
                  ? "text-brand-700"
                  : "text-ink-soft hover:bg-green-50 hover:text-ink",
              )}
            >
              {getLocalizedText(item.label, locale)}
              {hasChildren ? (
                <ChevronDown
                  className="h-3.5 w-3.5 text-ink-muted"
                  aria-hidden="true"
                />
              ) : null}
              {/* Saffron underline on the active item */}
              {active ? (
                <span
                  className="absolute inset-x-3 -bottom-[3px] h-0.5 rounded-full bg-brand-500"
                  aria-hidden="true"
                />
              ) : null}
            </span>
          );

          return (
            <li key={item.href} className="relative group">
              {hasChildren ? (
                <>
                  <Link
                    href={localizePath(item.items![0].href, locale)}
                    className={cn("block rounded-md py-1", linkPad)}
                  >
                    {parent}
                  </Link>
                  <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <ul className="w-52 rounded-lg border border-border bg-white p-2 shadow-elevated">
                      {item.items!.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={localizePath(child.href, locale)}
                            className="block rounded-md px-3 py-2 text-sm text-ink-soft hover:bg-green-50 hover:text-ink"
                          >
                            {getLocalizedText(child.label, locale)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <Link
                  href={localizePath(item.href, locale)}
                  className={cn("block rounded-md py-1", linkPad)}
                >
                  {parent}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

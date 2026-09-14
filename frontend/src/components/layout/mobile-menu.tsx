"use client";

import * as React from "react";
import Link from "next/link";
import { nav as navItems } from "@/data/site";
import { getLocalizedText, localizePath } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { Locale } from "@/types";

export function MobileMenu({
  open,
  locale,
  onClose,
}: {
  open: boolean;
  locale: Locale;
  onClose: () => void;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  React.useEffect(() => {
    if (open) containerRef.current?.focus();
  }, [open]);

  return (
    <div
      id="mobile-menu"
      ref={containerRef}
      tabIndex={-1}
      className={cn(
        "fixed inset-x-0 top-[72px] z-40 max-h-[calc(100vh-56px)] overflow-y-auto border-b border-border bg-white shadow-elevated transition-transform duration-200 lg:hidden",
        open ? "translate-y-0" : "-translate-y-full pointer-events-none invisible"
      )}
      aria-hidden={!open}
    >
      <div className="container-page py-4">
        <div className="mb-3 flex items-center justify-between sm:hidden">
          <LanguageSwitcher />
        </div>
        <nav aria-label={locale === "mr" ? "मोबाइल नेव्हिगेशन" : "Mobile navigation"}>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={localizePath(item.href, locale)}
                  onClick={onClose}
                  className="block rounded-md px-3 py-3 text-base font-medium text-ink hover:bg-green-50"
                >
                  {getLocalizedText(item.label, locale)}
                </Link>
                {item.items ? (
                  <ul className="mt-1 space-y-0.5 border-l border-border-strong pl-4 ml-3">
                    {item.items.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={localizePath(child.href, locale)}
                          onClick={onClose}
                          className="block rounded-md px-3 py-2.5 text-sm text-ink-soft hover:bg-green-50"
                        >
                          {getLocalizedText(child.label, locale)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 sm:hidden">
          <Link
            href={localizePath("/donation", locale)}
            onClick={onClose}
            className="rounded-md bg-brand-500 px-4 py-3 text-center text-sm font-semibold text-white"
          >
            {locale === "mr" ? "देणगी द्या" : "Donate"}
          </Link>
          <Link
            href={localizePath("/join-us", locale)}
            onClick={onClose}
            className="rounded-md bg-green-700 px-4 py-3 text-center text-sm font-semibold text-white"
          >
            {locale === "mr" ? "सामील व्हा" : "Join Us"}
          </Link>
        </div>
      </div>
    </div>
  );
}

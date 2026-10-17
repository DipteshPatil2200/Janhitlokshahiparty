"use client";

import * as React from "react";
import { type Locale } from "@/types";
import { siteConfig } from "@/data/site";

interface LocaleContextValue {
  locale: Locale;
  isDefault: boolean;
}

const LocaleContext = React.createContext<LocaleContextValue>({
  locale: siteConfig.localeDefault,
  isDefault: true,
});

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const value = React.useMemo<LocaleContextValue>(
    () => ({ locale, isDefault: locale === siteConfig.localeDefault }),
    [locale]
  );
  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = React.useContext(LocaleContext);
  return ctx;
}

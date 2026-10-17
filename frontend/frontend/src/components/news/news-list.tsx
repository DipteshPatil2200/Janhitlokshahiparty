"use client";

import * as React from "react";
import { getCategoryLabel } from "@/data/news";
import { NewsCard } from "@/components/cards/news-card";
import type { Locale, NewsCategory, NewsItem } from "@/types";
import { cn } from "@/lib/utils";

const filters: ("all" | NewsCategory)[] = ["all", "press-release", "statement", "event", "update"];

export function NewsList({ locale, items }: { locale: Locale; items: NewsItem[] }) {
  const [active, setActive] = React.useState<"all" | NewsCategory>("all");

  const visible = [...items]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .filter((n) => active === "all" || n.category === active);

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        {filters.map((f) => {
          const label =
            f === "all"
              ? locale === "mr"
                ? "सर्व"
                : "All"
              : getCategoryLabel(f);
          return (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                active === f
                  ? "border-brand-700 bg-brand-700 text-white"
                  : "border-border bg-white text-ink-soft hover:bg-stone-100"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {visible.length ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <NewsCard key={item.slug} item={item} locale={locale} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-border bg-paper p-12 text-center text-ink-muted">
          {locale === "mr"
            ? "या श्रेणीत सध्या बातम्या नाहीत."
            : "No news in this category yet."}
        </p>
      )}
    </div>
  );
}
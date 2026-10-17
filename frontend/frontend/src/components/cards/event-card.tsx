import Link from "next/link";
import { getLocalizedText, localizePath } from "@/lib/i18n";
import { MapPin } from "lucide-react";
import type { EventItem, Locale } from "@/types";
import { formatDate } from "@/lib/format";

export function EventCard({ event, locale }: { event: EventItem; locale: Locale }) {
  const isUpcoming = event.status === "upcoming";
  return (
    <Link
      href={localizePath(`/events/${event.slug}`, locale)}
      className="flex h-full gap-5 rounded-xl border border-border bg-white p-5 shadow-card transition-shadow hover:shadow-elevated"
    >
      <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-lg bg-brand-50 py-2 text-brand-800">
        <span className="text-xs font-semibold uppercase">
          {new Date(event.date).toLocaleDateString(locale === "mr" ? "mr-IN" : "en-IN", {
            month: "short",
          })}
        </span>
        <span className="text-2xl font-bold">
          {new Date(event.date).getDate()}
        </span>
      </div>
      <div className="flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span
            className={
              isUpcoming
                ? "rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700"
                : "rounded bg-stone-100 px-2 py-0.5 text-xs font-semibold text-stone-600"
            }
          >
            {isUpcoming
              ? locale === "mr" ? "आगामी" : "Upcoming"
              : locale === "mr" ? "संपन्न" : "Completed"}
          </span>
          <span className="text-xs text-ink-muted">
            {formatDate(event.date, locale)}
          </span>
        </div>
        <h3 className="text-base font-semibold text-ink">
          {getLocalizedText(event.title, locale)}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-ink-muted">
          {getLocalizedText(event.description, locale)}
        </p>
        {event.location ? (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-muted">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {getLocalizedText(event.location, locale)}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

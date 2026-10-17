import { orgLevels } from "@/data/organization";
import { SectionHeading } from "@/components/ui/section-heading";
import { LinkButton } from "@/components/ui/button";
import { ChevronDown, MapPin, Users, Landmark } from "lucide-react";
import type { Locale } from "@/types";

const levelIcons = [Landmark, MapPin, MapPin, MapPin, MapPin, Users];

export function OrganizationSection({ locale }: { locale: Locale }) {
  return (
    <section className="section bg-green-900 text-white">
      <div className="container-page">
        <SectionHeading
          eyebrow={locale === "mr" ? "संघटना" : "Organization"}
          heading={locale === "mr" ? "महाराष्ट्र संघटना" : "Maharashtra Organization"}
          description={
            locale === "mr"
              ? "राज्यापासून स्थानिक पातळीपर्यंत आमची संघटनात्मक रचना."
              : "Our organisational structure from the state to the local level."
          }
          align="center"
          className="mx-auto [&_h2]:text-white [&_.eyebrow]:text-gold-light"
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {orgLevels.map((level, i) => {
            const Icon = levelIcons[i] ?? MapPin;
            return (
              <div key={level.id} className="relative">
                <div className="flex h-full flex-col items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 p-5 text-center backdrop-blur-sm">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {locale === "mr" ? level.label.mr : level.label.en}
                  </span>
                </div>
                {i < orgLevels.length - 1 ? (
                  <ChevronDown
                    className="mx-auto mt-1 hidden h-4 w-4 text-gold-light lg:block"
                    aria-hidden="true"
                  />
                ) : null}
              </div>
            );
          })}
        </div>
        <div className="mt-12 text-center">
          <LinkButton
            href="/organization"
            locale={locale}
            className="border-white/50 bg-white text-green-800 hover:bg-white/90 hover:border-white"
          >
            {locale === "mr" ? "संघटना पहा" : "View Organization"}
          </LinkButton>
        </div>
      </div>
    </section>
  );
}

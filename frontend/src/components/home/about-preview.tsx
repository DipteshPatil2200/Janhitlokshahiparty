import { SectionHeading } from "@/components/ui/section-heading";
import { LinkButton } from "@/components/ui/button";
import { SmartImage } from "@/components/ui/smart-image";
import type { Locale, SiteSettings } from "@/types";

export function AboutPreview({ locale, settings }: { locale: Locale; settings?: SiteSettings }) {
  const L = locale;
  const aboutText =
    settings?.about?.[L] ||
    (L === "mr"
      ? "जनहित लोकशाही पक्ष ही महाराष्ट्रातील एक लोकाभिमुख राजकीय संघटना आहे. जनतेचे हक्क, पारदर्शकता आणि सर्वसमावेशक विकास या तत्त्वांवर आमचा विश्वास आहे."
      : "Janhit Lokshahi Party is a people-centric political organisation in Maharashtra. We believe in the rights of the people, transparency, and inclusive development.");
  return (
    <section className="section container-page">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-stone-100 shadow-card">
          <SmartImage
            src={null}
            fit="cover"
            fallback={L === "mr" ? "[अधिकृत छायाचित्र]" : "[Official Photo]"}
            alt=""
          />
        </div>
        <div>
          <SectionHeading
            eyebrow={L === "mr" ? "आमच्याविषयी" : "About Us"}
            heading={
              L === "mr" ? (
                "जनहितासाठी समर्पित राजकीय संघटना"
              ) : (
                "A Political Organisation Dedicated to Public Interest"
              )
            }
            description={aboutText}
          />
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[
              { n: "[—]", l: L === "mr" ? "जिल्हे" : "Districts" },
              { n: "[—]", l: L === "mr" ? "सदस्य" : "Members" },
              { n: "[—]", l: L === "mr" ? "कार्यक्रम" : "Programmes" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-lg border border-border bg-paper p-4 text-center"
              >
                <div className="text-2xl font-bold text-brand-700">{s.n}</div>
                <div className="mt-1 text-xs uppercase tracking-wide text-ink-muted">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <LinkButton href="/about" locale={L} variant="outline">
              {L === "mr" ? "अधिक वाचा" : "Read More"}
              <span aria-hidden="true">→</span>
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { LinkButton } from "@/components/ui/button";
import { SmartImage } from "@/components/ui/smart-image";
import type { Locale, SiteSettings } from "@/types";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Hero({ locale, settings }: { locale: Locale; settings?: SiteSettings }) {
  const L = locale;
  const heroTitle = settings?.heroTitle?.[L] || "";
  const heroSubtitle = settings?.heroSubtitle?.[L] || "";
  const heroImage = settings?.heroImage || "";

  // Split an admin-provided title on " — " so the accent span can highlight
  // the trailing phrase (e.g. "Janhit Lokshahi Party — The Voice of the People").
  const splitTitle = heroTitle.split(/\s*[\u2014\u2013-]\s*/).filter(Boolean);
  const baseTitle = splitTitle[0] || (L === "mr" ? "जनहित लोकशाही पक्ष" : "Janhit Lokshahi Party");
  const accentTitle = splitTitle.length > 1 ? splitTitle.slice(1).join(" — ") : (L === "mr" ? "जनतेचा आवाज" : "The Voice of the People");

  const subtitle =
    heroSubtitle ||
    (L === "mr"
      ? "जनहिताला सर्वांत वर ठेवून, पारदर्शक, जबाबदार आणि लोकाभिमुख महाराष्ट्रासाठी आम्ही वचनबद्ध आहोत."
      : "Committed to a transparent, accountable and people-centric Maharashtra, placing the public interest (Janhit) above all.");

  return (
    <section className="relative overflow-hidden bg-paper">
      {/* Top saffron hairline */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-500 via-gold to-green-600" aria-hidden="true" />

      <div className="container-page relative z-10 grid items-center gap-10 py-16 md:py-24 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-xl">
          <motion.p
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-brand-600"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-green-600" aria-hidden="true" />
            {L === "mr" ? "महाराष्ट्र · जनहितासाठी" : "Maharashtra · For Public Interest"}
          </motion.p>
          <motion.h1
            variants={item}
            className="mt-6 text-display-lg font-extrabold leading-[1.08] text-ink sm:text-display-xl"
          >
            {baseTitle}
            <span className="text-green-700"> — {accentTitle}</span>
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-6 text-lg leading-relaxed text-ink-soft text-pretty"
          >
            {subtitle}
          </motion.p>
          <motion.div variants={item} className="mt-9 flex flex-wrap gap-3">
            <LinkButton href="/join-us" locale={L} size="lg" variant="secondary">
              {L === "mr" ? "पक्षात सामील व्हा" : "Join the Party"}
            </LinkButton>
            <LinkButton href="/vision" locale={L} size="lg" variant="outline">
              {L === "mr" ? "आमची दृष्टी" : "Our Vision"}
            </LinkButton>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative"
        >
          {/* Emblem-inspired decorative ring behind the image */}
          <div
            className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 rounded-full border-2 border-brand-400/40"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute bottom-4 left-0 h-3 w-3 rounded-full bg-gold"
            aria-hidden="true"
          />
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-white shadow-card">
            <SmartImage
              src={heroImage}
              fit="cover"
              fallback={L === "mr" ? "[अधिकृत छायाचित्र]" : "[Official Photo]"}
              alt={baseTitle}
              className="bg-green-50"
            />
            {/* Bottom green accent strip */}
            <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-brand-500 via-gold to-green-600" aria-hidden="true" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
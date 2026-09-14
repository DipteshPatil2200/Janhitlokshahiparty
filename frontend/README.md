# Janhit Lokshahi Party — Official Website

Official website for **Janhit Lokshahi Party, Maharashtra**.

Built from scratch as a professional, scalable, bilingual (English + Marathi)
political-party website.

## Tech Stack

- **Next.js 14** (App Router) + **React 18**
- **TypeScript**
- **Tailwind CSS** v3 (design tokens in `tailwind.config.ts`)
- **lucide-react** icons, **framer-motion** (subtle animation)
- No backend/database yet — frontend architecture is CMS/API-ready

## Quick Start

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build
npm run start     # serve production build
npm run lint      # eslint
npm run typecheck # tsc --noEmit
```

## Site Structure

Routes (each available in English at `/…` and Marathi at `/mr/…`):

`/` · `/about` · `/leadership` · `/leadership/[slug]` · `/vision` ·
`/organization` · `/news` · `/news/[slug]` · `/campaigns` · `/events` ·
`/gallery` · `/videos` · `/documents` · `/join-us` · `/volunteer` ·
`/donation` · `/contact` · legal pages at `/privacy`, `/terms`, `/disclaimer`

## Project Layout

```
src/
├─ app/
│  ├─ layout.tsx           Root layout (fonts, global metadata)
│  ├─ page.tsx             Redirects / → /en
│  ├─ sitemap.ts           robots.ts, error.tsx, loading.tsx, not-found
│  └─ [lang]/              Locale segment (en | mr)
│     ├─ layout.tsx        Locale provider + Header + Footer
│     ├─ page.tsx          Homepage
│     └─ .../              All feature pages
├─ components/
│  ├─ layout/              Header, Footer, Navigation, MobileMenu
│  ├─ home/                Homepage sections
│  ├─ cards/               LeaderCard, NewsCard, EventCard, CampaignCard
│  ├─ forms/               Client forms (join, volunteer, contact)
│  ├─ donation/            DonationQR, BankDetails, ChequeImage
│  ├─ gallery/             GalleryView + lightbox
│  ├─ ui/                  Button, SmartImage, FormField, CopyButton, ...
│  ├─ providers/           LocaleProvider
│  └─ language-switcher.tsx
├─ data/                   ⚠ Content layer — edit these files to add real content
│  ├─ site.ts              Brand config, nav, contact, socials
│  ├─ leaders.ts           Leadership
│  ├─ news.ts              News
│  ├─ campaigns.ts         Campaigns + Events
│  ├─ organization.ts      Maharashtra org hierarchy
│  ├─ gallery.ts           Photo albums, videos, documents
│  └─ donation.ts          ⚠ Bank/UPI/QR details
├─ lib/                    i18n, seo, forms, format, utils helpers
└─ types/                  Shared content-model types
```

## Adding Real Content

All content lives in **`src/data/`** as typed static files. The frontend reads
only through these files, so official data can be added without touching
components — and later swapped for an admin CMS / API without UI rewrites.

**Currently everything is a clearly-marked placeholder**
(`[PLACEHOLDER]` / `[Official ... will be provided]`) because no official
content has been supplied yet.

### Donation page — IMPORTANT

`src/data/donation.ts` holds the `bankDetails` object (account name, account
number, bank, branch, IFSC, UPI ID, QR image path, cheque image path,
instructions). **Only ever replace these with official values provided by the
party.** The QR and cheque are rendered with `object-contain` (never cropped)
and support zoom; never alter that behavior.

### Branding

No official colors/logo have been provided. A neutral **placeholder design
system** is defined in `tailwind.config.ts` under the `brand` palette and in
`src/components/logo.tsx` (a "JLP" monogram mark). Replace these once official
branding is available — all tokens are centralized, so no hard-coded colors are
scattered through the app.

## Localization

- English serves at `/`, Marathi at `/mr` (each route duplicated under `[lang]`).
- Content uses `{ en, mr }` objects; `getLocalizedText()` picks per locale.
- Add a language switcher toggle in the header (already present).

## SEO

Per-page metadata via `src/lib/seo.ts` (`buildMetadata`), plus dynamic
`sitemap.ts` and `robots.ts`. Canonical URLs include the locale prefix.

## Security Notes

- Forms are **frontend-only** currently. The submission helper
  (`src/lib/forms.ts`) is a stub that should be pointed at a secured, rate-limited
  API route once a backend exists.
- No secrets are committed. `next.config.js` sets security headers.
- Real credentials should live in environment variables, never in code.

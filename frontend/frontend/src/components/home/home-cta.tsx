import { SectionHeading } from "@/components/ui/section-heading";
import { LinkButton } from "@/components/ui/button";
import { SmartImage } from "@/components/ui/smart-image";
import { HeartHandshake, HandCoins, Play } from "lucide-react";
import type { BankDetails, GalleryAlbum, Locale, VideoItem } from "@/types";

export function GallerySection({
  locale,
  albums,
}: {
  locale: Locale;
  albums: GalleryAlbum[];
}) {
  const withPhotos = albums.filter((a) => a.images.length > 0);
  const coverImages = withPhotos.flatMap((a) => a.images).slice(0, 5);
  return (
    <section className="section bg-paper">
      <div className="container-page">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow={locale === "mr" ? "छायाचित्रे" : "Gallery"}
            heading={locale === "mr" ? "फोटो गॅलरी" : "Photo Gallery"}
            description={
              locale === "mr"
                ? "पक्षाच्या कार्यक्रमांचे क्षण."
                : "Moments from our programmes and campaigns."
            }
          />
          <LinkButton href="/gallery" locale={locale} variant="outline" className="shrink-0">
            {locale === "mr" ? "सर्व छायाचित्रे" : "All Photos"}
            <span aria-hidden="true">→</span>
          </LinkButton>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {(coverImages.length
            ? coverImages
            : [null, null, null, null, null]
          ).map((img, i) => (
            <div
              key={i}
              className={
                i === 0
                  ? "aspect-square overflow-hidden rounded-xl border border-border bg-stone-100 shadow-card md:col-span-2 md:row-span-2"
                  : "aspect-square overflow-hidden rounded-xl border border-border bg-stone-100 shadow-card"
              }
            >
              <SmartImage
                src={img?.src || null}
                fit="cover"
                fallback={locale === "mr" ? "[छायाचित्र]" : "[Photo]"}
                alt=""
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function VideoSection({
  locale,
  videos,
}: {
  locale: Locale;
  videos: VideoItem[];
}) {
  const hasVideos = videos.length > 0;
  return (
    <section className="section container-page">
      <SectionHeading
        eyebrow={locale === "mr" ? "व्हिडिओ" : "Videos"}
        heading={locale === "mr" ? "व्हिडिओ गॅलरी" : "Video Gallery"}
        description={
          locale === "mr"
            ? "पक्षाचे व्हिडिओ पहा."
            : "Watch our videos."
        }
        align="center"
        className="mx-auto"
      />
      <div className="mt-10">
        {hasVideos ? (
          <div className="grid gap-6 md:grid-cols-3">
            {videos.map((v) => (
              <a
                key={v.id}
                href={`https://www.youtube.com/watch?v=${v.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-video overflow-hidden rounded-xl bg-stone-900"
              >
                <SmartImage
                  src={null}
                  fit="cover"
                  fallback={locale === "mr" ? "[व्हिडिओ]" : "[Video]"}
                  alt={locale === "mr" ? v.title.mr : v.title.en}
                />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-brand-700 shadow-lg transition-transform group-hover:scale-110">
                    <Play className="h-6 w-6 fill-current" aria-hidden="true" />
                  </span>
                </span>
              </a>
            ))}
          </div>
        ) : (
          <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-paper p-12 text-center">
            <Play className="h-10 w-10 text-ink-muted" aria-hidden="true" />
            <p className="text-sm text-ink-muted">
              {locale === "mr"
                ? "व्हिडिओ लवकरच उपलब्ध होतील."
                : "Videos will be available soon."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export function JoinCta({ locale }: { locale: Locale }) {
  return (
    <section className="section bg-green-800 text-white">
      <div className="container-page">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
            <HeartHandshake className="h-7 w-7 text-gold-light" aria-hidden="true" />
          </span>
          <h2 className="text-3xl font-bold sm:text-4xl text-balance">
            {locale === "mr"
              ? "जनहिताच्या चळवळीत सामील व्हा"
              : "Join the Movement for Public Interest"}
          </h2>
          <p className="max-w-xl text-lg text-green-100">
            {locale === "mr"
              ? "आपला सहभाग महाराष्ट्र बदलण्यास मदत करू शकतो. आजच पक्षात सामील व्हा."
              : "Your participation can help transform Maharashtra. Join the party today."}
          </p>
          <LinkButton href="/join-us" locale={locale} size="lg" variant="primary">
            {locale === "mr" ? "सामील व्हा" : "Join Now"}
          </LinkButton>
        </div>
      </div>
    </section>
  );
}

export function DonationCta({
  locale,
  donation,
}: {
  locale: Locale;
  donation: BankDetails;
}) {
  const qrImage =
    donation.qrImage || "/donation/janhit-lokshahi-party-idbi-upi-qr.jpeg";
  const upiId = donation.upiId || "janhitlokshahiparty@idbi";
  return (
    <section className="section container-page">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-500 to-gold p-8 text-white md:p-14">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              <HandCoins className="h-4 w-4" aria-hidden="true" />
              {locale === "mr" ? "देणगी" : "Donation"}
            </span>
            <h2 className="mt-5 text-3xl font-bold sm:text-4xl text-balance">
              {locale === "mr"
                ? "जनहिताच्या योगदानासाठी सहाय्य करा"
                : "Support the Cause of Public Interest"}
            </h2>
            <p className="mt-4 max-w-md text-white/85">
              {locale === "mr"
                ? "आपली देणगी पक्षाच्या जनहित कार्यांना बळ देते. सुरक्षित मार्गांनी योगदान द्या."
                : "Your contribution strengthens our work for the people. Donate through secure channels."}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <LinkButton href="/donation" locale={locale} size="lg" variant="secondary">
                <HandCoins className="mr-1 h-4 w-4" aria-hidden="true" />
                {locale === "mr" ? "देणगी द्या" : "Donate Now"}
              </LinkButton>
              <LinkButton
                href="/donation"
                locale={locale}
                size="lg"
                variant="outline"
                className="border-white/60 bg-transparent text-white hover:bg-white/15"
              >
                {locale === "mr" ? "पद्धती पहा" : "Ways to Give"}
              </LinkButton>
            </div>
          </div>
          <div className="mx-auto w-full max-w-64 rounded-2xl bg-white p-4 text-center text-ink shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrImage}
              alt={locale === "mr" ? "देणगी QR कोड" : "Donation QR code"}
              className="mx-auto h-auto w-full object-contain"
            />
            <p className="mt-3 text-xs font-semibold text-ink-muted">
              {locale === "mr" ? "देणगीसाठी QR कोड स्कॅन करा" : "Scan to donate"}
            </p>
            <p className="mt-1 break-all text-xs font-medium text-ink">{upiId}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

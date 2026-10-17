// components/donation/donation-qr.tsx
import { CopyButton } from "@/components/ui/copy-button";

export function DonationQR({
  qrImage,
  upiId,
  locale,
}: {
  qrImage?: string;
  upiId?: string;
  locale: "en" | "mr";
}) {
  const L = locale;
  return (
    <div className="flex flex-col items-center rounded-2xl bg-brand-50/60 p-4 sm:p-6">
      <p className="mb-4 text-center text-base font-bold text-ink sm:text-lg">
        {L === "mr" ? "देणगीसाठी QR कोड स्कॅन करा" : "Scan the QR Code to Donate"}
      </p>
      <div className="rounded-2xl border border-brand-200 bg-white p-3 shadow-card sm:p-5">
        {qrImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={qrImage}
            alt={L === "mr" ? "देणगी QR कोड" : "Donation QR Code"}
            className="h-auto w-full max-w-[20rem] object-contain"
            loading="eager"
          />
        ) : (
          <div
            className="flex h-64 w-64 items-center justify-center rounded-lg border-2 border-dashed border-orange-300 bg-orange-50 p-4 text-center text-sm text-orange-800"
            role="img"
            aria-label={
              L === "mr" ? "QR कोड लवकरच उपलब्ध" : "QR code coming soon"
            }
          >
            {L === "mr"
              ? "[अधिकृत QR कोड लवकरच उपलब्ध होईल]"
              : "[Official QR code will be available soon]"}
          </div>
        )}
      </div>
      {upiId ? (
        <div className="mt-4 w-full max-w-xs">
          <p className="text-center text-xs font-medium uppercase tracking-wide text-ink-muted">
            {L === "mr" ? "UPI आयडी" : "UPI ID"}
          </p>
          <div className="mt-2 flex items-center justify-center gap-2 rounded-md border border-border bg-paper px-3 py-2">
            <span className="truncate font-mono text-sm font-semibold text-ink">
              {upiId}
            </span>
            <CopyButton value={upiId} label={L === "mr" ? "कॉपी" : "Copy"} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

// components/donation/cheque-details.tsx
import { Building2, MapPin, FileText } from "lucide-react";

export function ChequeDetails({ locale }: { locale: "en" | "mr" }) {
  const L = locale;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-card">
      <div className="border-b border-border bg-paper px-6 py-4">
        <h3 className="flex items-center gap-2 text-lg font-bold text-ink">
          <FileText className="h-5 w-5 text-orange-600" aria-hidden="true" />
          {L === "mr" ? "धनादेश तपशील" : "Cheque Details"}
        </h3>
      </div>
      <dl className="divide-y divide-border">
        <div className="flex items-center justify-between gap-4 px-6 py-3.5">
          <dt className="flex items-center gap-3 text-sm text-ink-muted">
            <Building2
              className="h-4 w-4 shrink-0 text-orange-600"
              aria-hidden="true"
            />
            {L === "mr" ? "देय" : "Payable To"}
          </dt>
          <dd className="text-right text-sm font-semibold text-ink">
            {L === "mr" ? "जनहित लोकशाही पक्ष" : "Janhit Lokshahi Party"}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4 px-6 py-3.5">
          <dt className="flex items-center gap-3 text-sm text-ink-muted">
            <MapPin
              className="h-4 w-4 shrink-0 text-orange-600"
              aria-hidden="true"
            />
            {L === "mr" ? "पत्ता" : "Address"}
          </dt>
          <dd className="text-right text-sm font-semibold text-ink">
            {L === "mr"
              ? "[अधिकृत पक्ष देणगी पत्ता]"
              : "[Official Party Donation Address]"}
          </dd>
        </div>
      </dl>
    </div>
  );
}

// components/donation/bank-details.tsx
import {
  Building2,
  CreditCard,
  Hash,
  Landmark,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { CopyButton } from "@/components/ui/copy-button";
import type { BankDetails } from "@/types";

export function BankDetailsBlock({
  bank,
  locale,
}: {
  bank: BankDetails;
  locale: "en" | "mr";
}) {
  const L = locale;
  const rows = [
    {
      icon: Wallet,
      label: L === "mr" ? "खाते नाव" : "Account Name",
      value: bank.accountName || "[Official Account Name]",
    },
    {
      icon: CreditCard,
      label: L === "mr" ? "खाते क्रमांक" : "Account Number",
      value: bank.accountNumber || "[Official Account Number]",
    },
    {
      icon: Landmark,
      label: L === "mr" ? "बँक" : "Bank",
      value: bank.bankName || "[Bank Name]",
    },
    {
      icon: Building2,
      label: L === "mr" ? "शाखा" : "Branch",
      value: bank.branch || "[Branch Name]",
    },
    {
      icon: Hash,
      label: "IFSC",
      value: bank.ifsc || "[IFSC Code]",
    },
  ];

  const showCopy = (v: string) => v && !v.startsWith("[") && v !== "";

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-card">
      <div className="border-b border-border bg-paper px-6 py-4">
        <h3 className="flex items-center gap-2 text-lg font-bold text-ink">
          <Landmark className="h-5 w-5 text-orange-600" aria-hidden="true" />
          {L === "mr" ? "बँक तपशील" : "Bank Details"}
        </h3>
      </div>
      <dl className="divide-y divide-border">
        {rows.map((r) => {
          const Icon = r.icon;
          const canCopy = showCopy(r.value);
          return (
            <div
              key={r.label}
              className="flex items-center justify-between gap-4 px-6 py-3.5"
            >
              <dt className="flex items-center gap-3 text-sm text-ink-muted">
                <Icon
                  className="h-4 w-4 shrink-0 text-orange-600"
                  aria-hidden="true"
                />
                {r.label}
              </dt>
              <dd className="flex min-w-0 items-center gap-2 text-right">
                <span className="min-w-0 break-all text-sm font-semibold text-ink">
                  {r.value}
                </span>
                {canCopy ? (
                  <CopyButton
                    value={r.value}
                    label={L === "mr" ? "कॉपी" : "Copy"}
                  />
                ) : null}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}

export function TrustNote({ locale }: { locale: "en" | "mr" }) {
  const L = locale;
  return (
    <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
      <ShieldCheck
        className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700"
        aria-hidden="true"
      />
      <p className="text-sm leading-relaxed text-emerald-900">
        {L === "mr"
          ? "कृपया फक्त वर दिलेल्या अधिकृत पद्धतींनीच देणगी द्यावी. फोनवर किंवा अन्य माध्यमांद्वारे देणगी मागितल्यास सावध राहा."
          : "Please donate only through the official methods listed above. Be cautious if asked for donations over the phone or through other channels."}
      </p>
    </div>
  );
}

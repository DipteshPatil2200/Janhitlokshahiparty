"use client";

import * as React from "react";
import { Loader2, RefreshCw, Save, CheckCircle2, AlertCircle } from "lucide-react";
import { adminFetch } from "@/lib/admin";
import { FieldInput } from "./fields";
import { toPayload } from "@/lib/admin-crud";

const baseInput =
  "w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/30";

function LocalizedField({
  label,
  value,
  onChange,
  as,
  locale,
}: {
  label: string;
  value: any;
  onChange: (v: any) => void;
  as?: "text" | "textarea";
  locale: "en" | "mr";
}) {
  const v = (value || { en: "", mr: "" }) as Record<string, string>;
  return as === "textarea" ? (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-ink">
        {label} ({locale === "en" ? "English" : "मराठी"})
      </label>
      <textarea
        rows={4}
        value={v[locale] || ""}
        onChange={(e) => onChange({ ...v, [locale]: e.target.value })}
        className={baseInput}
      />
    </div>
  ) : (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-ink">
        {label} ({locale === "en" ? "English" : "मराठी"})
      </label>
      <input
        type="text"
        value={v[locale] || ""}
        onChange={(e) => onChange({ ...v, [locale]: e.target.value })}
        className={baseInput}
      />
    </div>
  );
}

function ListField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: any;
  onChange: (v: any) => void;
}) {
  const v = (value || { en: [], mr: [] }) as { en?: string[]; mr?: string[] };
  const arr = (k: "en" | "mr") => (v[k] || []).join("\n");
  const set = (k: "en" | "mr", text: string) =>
    onChange({ ...v, [k]: text.split("\n").filter((s) => s.trim() !== "") });
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-ink">
        {label} <span className="font-normal text-ink-muted">(one per line)</span>
      </label>
      <div className="grid gap-2 sm:grid-cols-2">
        <textarea rows={4} placeholder="English" value={arr("en")} onChange={(e) => set("en", e.target.value)} className={baseInput} />
        <textarea rows={4} placeholder="मराठी" value={arr("mr")} onChange={(e) => set("mr", e.target.value)} className={baseInput} />
      </div>
    </div>
  );
}

function TextSetting({
  label,
  value,
  onChange,
}: {
  label: string;
  value: any;
  onChange: (v: any) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-ink">{label}</label>
      <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} className={baseInput} />
    </div>
  );
}

function LocaleToggle({ locale, onChange }: { locale: "en" | "mr"; onChange: (l: "en" | "mr") => void }) {
  return (
    <div className="flex overflow-hidden rounded-md border border-border text-xs">
      {(["en", "mr"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => onChange(l)}
          className={[
            "px-3 py-1.5 font-semibold",
            locale === l ? "bg-brand-700 text-white" : "bg-white text-ink-muted hover:bg-stone-100",
          ].join(" ")}
        >
          {l === "en" ? "EN" : "म"}
        </button>
      ))}
    </div>
  );
}

function SettingsForm({
  kind,
  label,
  initial,
  onSave,
}: {
  kind: "site" | "donation";
  label: string;
  initial: any;
  onSave: (payload: any) => Promise<void>;
}) {
  const [data, setData] = React.useState<any>(() => {
    const { _id, __v, createdAt, updatedAt, ...rest } = initial || {};
    return { ...rest };
  });
  const [busy, setBusy] = React.useState(false);
  const [status, setStatus] = React.useState<{
    type: "idle" | "success" | "error";
    msg?: string;
  }>({ type: "idle" });
  const [locale, setLocale] = React.useState<"en" | "mr">("en");
  const set = (k: string, v: any) => setData((d: any) => ({ ...d, [k]: v }));

  return (
    <div className="rounded-lg border border-border bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold text-ink">{label}</h3>
          <LocaleToggle locale={locale} onChange={setLocale} />
        </div>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded p-1.5 text-ink-muted hover:bg-stone-100"
          title="Reload saved values"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (busy) return;
          setBusy(true);
          setStatus({ type: "idle" });
          try {
            await onSave(toPayload(data));
            setStatus({
              type: "success",
              msg: "Settings updated successfully",
            });
          } catch (err: any) {
            setStatus({
              type: "error",
              msg: err?.message || "Unable to update settings. Please try again.",
            });
          } finally {
            setBusy(false);
          }
        }}
        className="space-y-4"
      >
        {kind === "site" ? (
          <>
            <LocalizedField label="Site name" value={data.siteName} onChange={(v) => set("siteName", v)} locale={locale} />
            <LocalizedField label="Tagline" value={data.tagline} onChange={(v) => set("tagline", v)} locale={locale} />
            <LocalizedField label="Announcement" value={data.announcement} onChange={(v) => set("announcement", v)} as="textarea" locale={locale} />
            <FieldInput
              field={{ kind: "boolean", key: "announcementEnabled", label: "Show announcement bar" }}
              value={data.announcementEnabled}
              onChange={(v) => set("announcementEnabled", v)}
              locale={locale}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldInput field={{ kind: "image", key: "logo", label: "Logo" }} value={data.logo} onChange={(v) => set("logo", v)} locale={locale} />
              <FieldInput field={{ kind: "image", key: "heroImage", label: "Hero image" }} value={data.heroImage} onChange={(v) => set("heroImage", v)} locale={locale} />
              <FieldInput field={{ kind: "image", key: "aboutImage", label: "About Us image" }} value={data.aboutImage} onChange={(v) => set("aboutImage", v)} locale={locale} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <LocalizedField label="Hero title" value={data.heroTitle} onChange={(v) => set("heroTitle", v)} locale={locale} />
              <LocalizedField label="Hero subtitle" value={data.heroSubtitle} onChange={(v) => set("heroSubtitle", v)} locale={locale} />
            </div>
            <LocalizedField label="About" value={data.about} onChange={(v) => set("about", v)} as="textarea" locale={locale} />
            <ListField label="Vision points" value={data.vision} onChange={(v) => set("vision", v)} />
            <ListField label="Mission points" value={data.mission} onChange={(v) => set("mission", v)} />
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["contactPhone", "Contact phone"],
                ["contactEmail", "Contact email"],
                ["mapEmbedUrl", "Map embed URL"],
                ["facebookUrl", "Facebook URL"],
                ["twitterUrl", "Twitter/X URL"],
                ["instagramUrl", "Instagram URL"],
                ["youtubeUrl", "YouTube URL"],
              ].map(([k, l]) => (
                <TextSetting key={k} label={l} value={data[k]} onChange={(v) => set(k, v)} />
              ))}
            </div>
            <LocalizedField label="Address" value={data.address} onChange={(v) => set("address", v)} locale={locale} />
          </>
        ) : (
          <>
            <LocalizedField label="Heading" value={data.heading} onChange={(v) => set("heading", v)} locale={locale} />
            <LocalizedField label="Intro" value={data.intro} onChange={(v) => set("intro", v)} as="textarea" locale={locale} />
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldInput field={{ kind: "image", key: "qrImage", label: "QR image" }} value={data.qrImage} onChange={(v) => set("qrImage", v)} locale={locale} />
              <FieldInput field={{ kind: "image", key: "chequeImage", label: "Cheque image" }} value={data.chequeImage} onChange={(v) => set("chequeImage", v)} locale={locale} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["upiId", "UPI ID"],
                ["accountName", "Account name"],
                ["accountNumber", "Account number"],
                ["bankName", "Bank name"],
                ["branch", "Branch"],
                ["ifsc", "IFSC"],
              ].map(([k, l]) => (
                <TextSetting key={k} label={l} value={data[k]} onChange={(v) => set(k, v)} />
              ))}
            </div>
            <ListField label="Instructions" value={data.instructions} onChange={(v) => set("instructions", v)} />
          </>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-md bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
            {busy ? "Saving…" : `Save ${label}`}
          </button>
          {status.type === "success" ? (
            <p className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700" role="status">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Settings updated successfully
            </p>
          ) : status.type === "error" ? (
            <p className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600" role="alert">
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              {status.msg}
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
}

export function SettingsAdmin() {
  const [site, setSite] = React.useState<any | null>(null);
  const [donation, setDonation] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, d] = await Promise.all([
        adminFetch<any>("/site-settings"),
        adminFetch<any>("/donation-settings"),
      ]);
      setSite(s);
      setDonation(d);
    } catch (e: any) {
      setError(e?.message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  if (loading) return <p className="text-sm text-ink-muted">Loading…</p>;
  if (error) return <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>;
  if (!site || !donation) return null;

  return (
    <div className="space-y-6">
      <SettingsForm
        kind="site"
        label="Site Setting"
        initial={site}
        onSave={async (payload) => {
          const fresh = await adminFetch<any>("/site-settings", {
            method: "PUT",
            body: JSON.stringify(payload),
          });
          setSite(fresh);
        }}
      />
      <SettingsForm
        kind="donation"
        label="Donation Setting"
        initial={donation}
        onSave={async (payload) => {
          const fresh = await adminFetch<any>("/donation-settings", {
            method: "PUT",
            body: JSON.stringify(payload),
          });
          setDonation(fresh);
        }}
      />
    </div>
  );
}
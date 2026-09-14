"use client";

import * as React from "react";
import { Loader2, Upload } from "lucide-react";
import { uploadAdminFile } from "@/lib/admin";

export type Field =
  | { kind: "text"; key: string; label: string; placeholder?: string }
  | { kind: "textarea"; key: string; label: string }
  | { kind: "number"; key: string; label: string }
  | { kind: "boolean"; key: string; label: string }
  | { kind: "select"; key: string; label: string; options: string[] }
  | {
      kind: "localized";
      key: string;
      label: string;
      as?: "text" | "textarea";
    }
  | { kind: "image"; key: string; label: string }
  | { kind: "password"; key: string; label: string }
  | { kind: "tags"; key: string; label: string }
  | { kind: "localizedList"; key: string; label: string };

export function FieldInput({
  field,
  value,
  onChange,
  locale,
}: {
  field: Field;
  value: any;
  onChange: (v: any) => void;
  locale: "en" | "mr";
}) {
  const baseCls =
    "w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/30";
  const label = field.label + (locale === "mr" ? " (मराठी)" : " (English)");

  if (field.kind === "localized") {
    const v = (value || {}) as Record<string, string>;
    return (
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-ink">{label}</label>
        {field.as === "textarea" ? (
          <textarea
            value={v[locale] || ""}
            onChange={(e) => onChange({ ...v, [locale]: e.target.value })}
            rows={4}
            className={baseCls}
          />
        ) : (
          <input
            type="text"
            value={v[locale] || ""}
            onChange={(e) => onChange({ ...v, [locale]: e.target.value })}
            className={baseCls}
          />
        )}
      </div>
    );
  }

  switch (field.kind) {
    case "textarea":
      return (
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-ink">
            {field.label}
          </label>
          <textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            className={baseCls}
          />
        </div>
      );
    case "number":
      return (
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-ink">
            {field.label}
          </label>
          <input
            type="number"
            value={value ?? ""}
            onChange={(e) => onChange(Number(e.target.value))}
            className={baseCls}
          />
        </div>
      );
    case "boolean":
      return (
        <label className="flex items-center gap-2 text-sm font-medium text-ink">
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 accent-brand-700"
          />
          {field.label}
        </label>
      );
    case "select":
      return (
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-ink">
            {field.label}
          </label>
          <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={baseCls}
          >
            <option value="">— none —</option>
            {field.options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      );
    case "image":
      return (
        <ImageInput label={field.label} value={value} onChange={onChange} />
      );
    case "password":
      return (
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-ink">
            {field.label}
          </label>
          <input
            type="password"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={baseCls}
          />
        </div>
      );
    case "tags":
      return (
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-ink">
            {field.label}
          </label>
          <input
            type="text"
            value={Array.isArray(value) ? value.join(", ") : ""}
            onChange={(e) =>
              onChange(
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              )
            }
            className={baseCls}
          />
        </div>
      );
    case "localizedList": {
      const rows = Array.isArray(value)
        ? value
        : (() => {
            const v = (value || { en: [], mr: [] }) as {
              en?: string[];
              mr?: string[];
            };

            const en = Array.isArray(v.en) ? v.en : [];
            const mr = Array.isArray(v.mr) ? v.mr : [];
            const length = Math.max(en.length, mr.length);

            return Array.from({ length }, (_, i) => ({
              en: en[i] || "",
              mr: mr[i] || "",
            }));
          })();

      const updateLocale = (localeKey: "en" | "mr", text: string) => {
        const lines = text
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);

        const maxLength = Math.max(lines.length, rows.length);

        const updated = Array.from({ length: maxLength }, (_, i) => ({
          en: localeKey === "en" ? lines[i] || "" : rows[i]?.en || "",
          mr: localeKey === "mr" ? lines[i] || "" : rows[i]?.mr || "",
        }));

        onChange(updated);
      };

      return (
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-ink">
            {field.label}{" "}
            <span className="font-normal text-ink-muted">
              (one item per line)
            </span>
          </label>

          <div className="grid gap-2 sm:grid-cols-2">
            <textarea
              placeholder="English"
              rows={4}
              value={rows.map((r: any) => r.en || "").join("\n")}
              onChange={(e) => updateLocale("en", e.target.value)}
              className={baseCls}
            />

            <textarea
              placeholder="मराठी"
              rows={4}
              value={rows.map((r: any) => r.mr || "").join("\n")}
              onChange={(e) => updateLocale("mr", e.target.value)}
              className={baseCls}
            />
          </div>
        </div>
      );
    }
    default:
      return (
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-ink">
            {field.label}
          </label>
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={baseCls}
          />
        </div>
      );
  }
}

export function ImageInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: any;
  onChange: (v: any) => void;
}) {
  const [busy, setBusy] = React.useState(false);
  const baseCls =
    "w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/30";
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-ink">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="URL or upload"
          className={baseCls}
        />
        <label className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md border border-border bg-stone-100 px-3 py-2 text-xs font-semibold text-ink hover:bg-stone-200">
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Upload className="h-4 w-4" aria-hidden="true" />
          )}
          Upload
          <input
            type="file"
            className="hidden"
            disabled={busy}
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setBusy(true);
              try {
                onChange(await uploadAdminFile(f));
              } catch (err: any) {
                alert(err?.message || "Upload failed");
              } finally {
                setBusy(false);
                e.target.value = "";
              }
            }}
          />
        </label>
      </div>
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          className="mt-2 h-20 w-32 rounded-md border border-border object-cover"
        />
      ) : null}
    </div>
  );
}

export function SubmitButton({ busy, text }: { busy: boolean; text: string }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="inline-flex items-center gap-2 rounded-md bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60"
    >
      {busy ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : null}
      {text}
    </button>
  );
}

"use client";

import * as React from "react";
import { ExternalLink, Pencil, Plus, X } from "lucide-react";
import { FieldInput, SubmitButton, type Field } from "./fields";

export type AdminField = Field & {
  col?: { as?: string; select?: string; fields: AdminField[] };
  inList?: boolean;
};

export function ResourceList({
  docs,
  fields,
  onEdit,
  onNew,
  onDelete,
  renderExtra,
}: {
  docs: any[];
  fields: AdminField[];
  onEdit: (doc: any) => void;
  onNew: () => void;
  onDelete: (doc: any) => void;
  renderExtra?: (doc: any) => React.ReactNode;
}) {
  const cols = fields.filter((f) => f.inList !== false);
  const toText = (v: any): string => {
    if (v == null) return "—";
    if (typeof v === "object") {
      if (Array.isArray(v)) return v[0] ? toText(v[0]) : "—";
      const w = Object.values(v).find((x): x is string => typeof x === "string" && x.trim().length > 0);
      return w ?? "—";
    }
    const s = String(v);
    return s.length > 48 ? s.slice(0, 48) + "…" : s;
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onNew}
        className="inline-flex items-center gap-1.5 rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
      >
        <Plus className="h-4 w-4" aria-hidden="true" /> New
      </button>
      {docs.length === 0 ? (
        <p className="text-sm text-ink-muted">No items yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-stone-100">
              <tr>
                {cols.map((f) => (
                  <th key={f.key} className="px-3 py-2 text-left font-semibold text-ink-muted">{f.label}</th>
                ))}
                {renderExtra ? <th className="px-3 py-2"></th> : null}
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {docs.map((doc) => (
                <tr key={doc.id} className="align-top">
                  {cols.map((f) => (
                    <td key={f.key} className="px-3 py-2 text-ink-soft">
                      {f.kind === "image" && doc[f.key] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={doc[f.key]} alt="" className="h-10 w-16 rounded object-cover" />
                      ) : (
                        toText(doc[f.key])
                      )}
                    </td>
                  ))}
                  {renderExtra ? <td className="px-3 py-2">{renderExtra(doc)}</td> : null}
                  <td className="px-3 py-2">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        title="Edit"
                        onClick={() => onEdit(doc)}
                        className="rounded p-1.5 text-ink-muted hover:bg-stone-100 hover:text-ink"
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        title="Delete"
                        onClick={() => {
                          const label = toText(doc[cols[0]?.key]);
                          if (confirm(`Delete this item${label !== "—" ? ` ("${label}")` : ""}?`)) onDelete(doc);
                        }}
                        className="rounded p-1.5 text-ink-muted hover:bg-red-50 hover:text-red-600"
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function ResourceForm({
  title,
  fields,
  initial,
  onSubmit,
  onCancel,
  locale,
  children,
}: {
  title: string;
  fields: AdminField[];
  initial?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  locale: "en" | "mr";
  children?: React.ReactNode;
}) {
  const [data, setData] = React.useState<any>(() => {
    const { id, _id, createdAt, updatedAt, ...rest } = initial || {};
    return { ...rest };
  });
  const [busy, setBusy] = React.useState(false);

  const set = (key: string, v: any) => setData((d: any) => ({ ...d, [key]: v }));

  return (
    <div className="rounded-lg border border-border bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-ink">{title}</h3>
        <button type="button" onClick={onCancel} className="rounded p-1.5 text-ink-muted hover:bg-stone-100">
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          try {
            await onSubmit(data);
          } catch (err: any) {
            console.error(err);
            alert(err?.message || "Save failed");
          } finally {
            setBusy(false);
          }
        }}
        className="space-y-4"
      >
        {fields.map((f) =>
          "col" in f && f.col ? (
            <SubblockEditor key={f.key} field={f} value={data[f.key]} onChange={(v) => set(f.key, v)} locale={locale} />
          ) : (
            <FieldInput key={f.key} field={f} value={data[f.key]} onChange={(v) => set(f.key, v)} locale={locale} />
          )
        )}
        {children}
        <div className="flex gap-2 pt-1">
          <SubmitButton busy={busy} text="Save" />
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-ink hover:bg-stone-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export function SubblockEditor({
  field,
  value,
  onChange,
  locale,
}: {
  field: AdminField;
  value: any;
  onChange: (v: any) => void;
  locale: "en" | "mr";
}) {
  const col = field.col as { as?: string; select?: string; fields: AdminField[] };
  const rows = value || [];
  const set = (i: number, k: string, v: any) => {
    onChange(rows.map((r: any, idx: number) => (idx === i ? { ...r, [k]: v } : r)));
  };

  const blank = () => {
    const b: any = {};
    col.fields.forEach((f: AdminField) => {
      if (f.kind === "boolean") b[f.key] = false;
      else if (f.kind === "number") b[f.key] = 0;
      else if (f.kind === "localized") b[f.key] = { en: "", mr: "" };
      else if ("col" in f && f.col) b[f.key] = [];
      else b[f.key] = "";
    });
    return b;
  };

  return (
    <div className="space-y-2 rounded-md border border-dashed border-slate-300 bg-slate-50 p-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-ink-soft">{field.label}</p>
        <button
          type="button"
          onClick={() => onChange([...rows, blank()])}
          className="inline-flex items-center gap-1 rounded bg-white px-2.5 py-1 text-xs font-semibold text-brand-700 shadow-sm ring-1 ring-border hover:bg-brand-50"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Add block
        </button>
      </div>
      {rows.length === 0 ? (
        <p className="text-xs text-ink-muted">No blocks.</p>
      ) : (
        rows.map((row: any, i: number) => (
          <div key={i} className="space-y-3 rounded-md border border-border bg-white p-3">
            <div className="flex justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Block {i + 1}</span>
              <button
                type="button"
                onClick={() => onChange(rows.filter((_: any, idx: number) => idx !== i))}
                className="rounded px-1.5 text-xs font-semibold text-red-500 hover:bg-red-50"
                title="Remove block"
              >
                Remove
              </button>
            </div>
            {col.fields.map((f: AdminField) => (
              <FieldInput key={f.key} field={f} value={row[f.key]} onChange={(v) => set(i, f.key, v)} locale={locale} />
            ))}
          </div>
        ))
      )}
    </div>
  );
}

export function DocLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline">
      {children} <ExternalLink className="h-3 w-3" aria-hidden="true" />
    </a>
  );
}
"use client";

import * as React from "react";
import { RefreshCw } from "lucide-react";
import { ResourceForm, ResourceList, DocLink } from "./resource-admin";
import type { CollectionSpec } from "./collections";
import {
  listCollection,
  createCollection,
  updateCollection,
  deleteCollection,
} from "@/lib/admin-crud";

export function ResourcePanel({
  spec,
  onLocale,
}: {
  spec: CollectionSpec;
  onLocale: (l: "en" | "mr") => void;
}) {
  const [rows, setRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [editing, setEditing] = React.useState<{ id?: string; data: any } | null>(null);
  const [locale, setLocale] = React.useState<"en" | "mr">("en");

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await listCollection<any>(spec.id);
      setRows(
        items.map((it: any) => ({ ...it, id: String(it._id || it.id || "") }))
      );
    } catch (e: any) {
      setError(e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [spec.id]);

  React.useEffect(() => {
    load();
  }, [load]);

  const idOf = (doc: any): string => String(doc._id || doc.id || "");

  const save = async (data: any) => {
    if (editing?.id) {
      await updateCollection(spec.id, editing.id, data);
    } else {
      await createCollection(spec.id, data);
    }
    setEditing(null);
    await load();
  };

  const remove = async (doc: any) => {
    await deleteCollection(spec.id, idOf(doc));
    await load();
  };

  const switchLocale = (l: "en" | "mr") => {
    setLocale(l);
    onLocale(l);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-ink">{spec.label}</h2>
        <div className="flex items-center gap-2">
          <div className="flex overflow-hidden rounded-md border border-border text-xs">
            {(["en", "mr"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => switchLocale(l)}
                className={[
                  "px-3 py-1.5 font-semibold",
                  locale === l ? "bg-brand-700 text-white" : "bg-white text-ink-muted hover:bg-stone-100",
                ].join(" ")}
              >
                {l === "en" ? "EN" : "मर"} 
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={load}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:bg-stone-100"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" /> Refresh
          </button>
        </div>
      </div>

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      {editing ? (
        <ResourceForm
          title={editing.id ? `Edit ${spec.singular}` : `New ${spec.singular}`}
          fields={spec.fields}
          initial={editing.data}
          locale={locale}
          onSubmit={save}
          onCancel={() => setEditing(null)}
        />
      ) : loading ? (
        <p className="text-sm text-ink-muted">Loading…</p>
      ) : (
        <div>
          <ResourceList
            docs={rows}
            fields={spec.fields}
            onEdit={(doc) => setEditing({ id: idOf(doc), data: doc })}
            onNew={() => setEditing({ id: undefined, data: {} })}
            onDelete={remove}
            renderExtra={
              spec.viewBase && rows.some((r) => r.slug)
                ? (doc) =>
                    doc.slug ? (
                      <DocLink href={`/${spec.viewBase!}/${doc.slug}`}>View</DocLink>
                    ) : null
                : undefined
            }
          />
        </div>
      )}
    </div>
  );
}
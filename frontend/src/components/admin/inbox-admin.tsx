"use client";

import * as React from "react";
import { ExternalLink, RefreshCw, Trash2 } from "lucide-react";
import { adminFetch } from "@/lib/admin";

type InboxKind = "join" | "volunteer" | "contact";

interface BoxDoc {
  _id?: string;
  id?: string;
  fullName?: string;
  email?: string;
  mobile?: string;
  status?: string;
  createdAt?: string;
  [k: string]: any;
}

const PATHS: Record<InboxKind, { api: string; label: string }> = {
  join: { api: "/join-requests", label: "Join Requests" },
  volunteer: { api: "/volunteer-requests", label: "Volunteer Requests" },
  contact: { api: "/contact-messages", label: "Contact Messages" },
};

const STATUS_OPTIONS: Record<InboxKind, string[]> = {
  join: ["new", "contacted", "approved", "rejected"],
  volunteer: ["new", "contacted", "approved", "rejected"],
  contact: ["new", "read", "replied"],
};

const FIELDS: Record<InboxKind, { key: string; label: string }[]> = {
  join: [
    { key: "district", label: "District" },
    { key: "taluka", label: "Taluka" },
    { key: "city", label: "City/Village" },
    { key: "message", label: "Message" },
  ],
  volunteer: [
    { key: "district", label: "District" },
    { key: "city", label: "City/Village" },
    { key: "categories", label: "Categories" },
    { key: "availability", label: "Availability" },
    { key: "message", label: "Message" },
  ],
  contact: [
    { key: "subject", label: "Subject" },
    { key: "message", label: "Message" },
  ],
};

export function InboxAdmin({ kind }: { kind: InboxKind }) {
  const { api, label } = PATHS[kind];
  const [rows, setRows] = React.useState<BoxDoc[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminFetch<{ items: any[] }>(api);
      setRows(
        data.items.map((it: any) => ({ ...it, id: String(it._id || it.id || "") }))
      );
    } catch (e: any) {
      setError(e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [api]);

  React.useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (doc: BoxDoc, status: string) => {
    await adminFetch(`${api}/${doc.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    await load();
  };

  const remove = async (doc: BoxDoc) => {
    if (!confirm(`Delete this submission from "${doc.fullName}"?`)) return;
    await adminFetch(`${api}/${doc.id}`, { method: "DELETE" });
    await load();
  };

  const badge = (s?: string) =>
    s === "new"
      ? "bg-amber-100 text-amber-800"
      : s === "approved" || s === "replied" || s === "read"
        ? "bg-green-100 text-green-700"
        : s === "contacted"
          ? "bg-brand-100 text-brand-700"
          : "bg-stone-200 text-ink-muted";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-ink">{label}</h2>
        <button
          type="button"
          onClick={load}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:bg-stone-100"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" /> Refresh
        </button>
      </div>

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      {loading ? (
        <p className="text-sm text-ink-muted">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-ink-muted">Nothing here yet.</p>
      ) : (
        <div className="space-y-3">
          {rows.map((doc) => (
            <div key={doc.id} className="rounded-lg border border-border bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink">{doc.fullName || "—"}</p>
                  <p className="text-xs text-ink-muted">
                    {doc.mobile && <span className="mr-3">{doc.mobile}</span>}
                    {doc.email && <span className="mr-3">{doc.email}</span>}
                    {doc.createdAt && (
                      <span>{new Date(doc.createdAt).toLocaleString()}</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={["rounded-full px-2.5 py-1 text-xs font-semibold", badge(doc.status)].join(" ")}>
                    {doc.status || "new"}
                  </span>
                  <select
                    value={doc.status || "new"}
                    onChange={(e) => updateStatus(doc, e.target.value)}
                    className="rounded-md border border-border bg-white px-2 py-1 text-xs text-ink"
                  >
                    {STATUS_OPTIONS[kind].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    title="Delete"
                    onClick={() => remove(doc)}
                    className="rounded p-1.5 text-ink-muted hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
              <div className="mt-3 grid gap-2 text-sm text-ink-soft sm:grid-cols-2">
                {FIELDS[kind].map((f) =>
                  doc[f.key] ? (
                    <div key={f.key} className="rounded-md bg-stone-50 px-3 py-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">{f.label}</p>
                      <p className="whitespace-pre-wrap">{String(doc[f.key])}</p>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function MailLink({ email }: { email?: string }) {
  return email ? (
    <a href={`mailto:${email}`} className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline">
      {email} <ExternalLink className="h-3 w-3" aria-hidden="true" />
    </a>
  ) : null;
}
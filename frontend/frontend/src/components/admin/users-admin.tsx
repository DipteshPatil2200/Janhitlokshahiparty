"use client";

import * as React from "react";
import { Loader2, Pencil, Plus, RefreshCw, Trash2, X } from "lucide-react";
import { adminFetch } from "@/lib/admin";
import { getStoredUser } from "@/lib/admin";

interface UserDoc {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
  lastLoginAt?: string;
  createdAt?: string;
}

const ROLES = ["super_admin", "content_manager", "media_manager", "organization_manager"] as const;
const ROLE_LABEL: Record<string, string> = {
  super_admin: "Super admin",
  content_manager: "Content manager",
  media_manager: "Media manager",
  organization_manager: "Organization manager",
};

const baseInput =
  "w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/30";

export function UsersAdmin() {
  const me = getStoredUser();
  const [rows, setRows] = React.useState<UserDoc[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [editing, setEditing] = React.useState<UserDoc | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminFetch<{ items: UserDoc[] }>("/users");
      setRows(data.items || []);
    } catch (e: any) {
      setError(e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-ink">Users</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={load}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:bg-stone-100"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" /> Refresh
          </button>
          <button
            type="button"
            onClick={() => setEditing({} as UserDoc)}
            className="inline-flex items-center gap-1.5 rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
          >
            <Plus className="h-4 w-4" aria-hidden="true" /> New user
          </button>
        </div>
      </div>

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      {editing ? (
        <UserForm
          user={editing}
          onSave={async () => {
            setEditing(null);
            await load();
          }}
          onCancel={() => setEditing(null)}
        />
      ) : loading ? (
        <p className="text-sm text-ink-muted">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-ink-muted">No users yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-stone-100">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-ink-muted">Name</th>
                <th className="px-3 py-2 text-left font-semibold text-ink-muted">Email</th>
                <th className="px-3 py-2 text-left font-semibold text-ink-muted">Role</th>
                <th className="px-3 py-2 text-left font-semibold text-ink-muted">Status</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {rows.map((u) => (
                <tr key={u.id} className="align-top">
                  <td className="px-3 py-2 font-medium text-ink">
                    {u.name}
                    {me?.id === u.id ? <span className="ml-2 rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-bold text-brand-700">you</span> : null}
                  </td>
                  <td className="px-3 py-2 text-ink-soft">{u.email}</td>
                  <td className="px-3 py-2 text-ink-soft">{ROLE_LABEL[u.role || ""] || u.role}</td>
                  <td className="px-3 py-2">
                    <span
                      className={[
                        "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                        u.isActive !== false ? "bg-green-100 text-green-700" : "bg-stone-200 text-ink-muted",
                      ].join(" ")}
                    >
                      {u.isActive !== false ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        title="Edit"
                        onClick={() => setEditing(u)}
                        className="rounded p-1.5 text-ink-muted hover:bg-stone-100 hover:text-ink"
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        title="Delete"
                        disabled={me?.id === u.id}
                        onClick={async () => {
                          if (!confirm(`Delete user "${u.email}"?`)) return;
                          await adminFetch(`/users/${u.id}`, { method: "DELETE" });
                          await load();
                        }}
                        className="rounded p-1.5 text-ink-muted hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
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

function UserForm({
  user,
  onSave,
  onCancel,
}: {
  user: UserDoc;
  onSave: () => Promise<void>;
  onCancel: () => void;
}) {
  const isNew = !user.id;
  const [name, setName] = React.useState(user.name || "");
  const [email, setEmail] = React.useState(user.email || "");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState<string>(user.role || "content_manager");
  const [active, setActive] = React.useState(user.isActive !== false);
  const [busy, setBusy] = React.useState(false);

  const save = async () => {
    setBusy(true);
    try {
      if (isNew) {
        if (!name.trim() || !email.trim() || password.length < 8) {
          alert("Name, email and a password of at least 8 characters are required.");
          return;
        }
        await adminFetch("/users", {
          method: "POST",
          body: JSON.stringify({ name, email, password, role }),
        });
      } else {
        const body: any = { name, role, isActive: active };
        if (password) body.password = password;
        await adminFetch(`/users/${user.id}`, { method: "PUT", body: JSON.stringify(body) });
      }
      await onSave();
    } catch (e: any) {
      alert(e?.message || "Save failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4 rounded-lg border border-border bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-ink">{isNew ? "New user" : "Edit user"}</h3>
        <button type="button" onClick={onCancel} className="rounded p-1.5 text-ink-muted hover:bg-stone-100">
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-ink">Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={baseInput} />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-ink">Email</label>
          <input type="email" value={email} disabled={!isNew} onChange={(e) => setEmail(e.target.value)} className={baseInput + (isNew ? "" : " cursor-not-allowed opacity-60")} />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-ink">
            Password {isNew ? "" : <span className="font-normal text-ink-muted">(leave blank to keep)</span>}
          </label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={isNew ? "Min 8 characters" : "••••••••"} className={baseInput} />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-ink">Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className={baseInput}>
            {ROLES.map((r) => (
              <option key={r} value={r}>{ROLE_LABEL[r]}</option>
            ))}
          </select>
        </div>
      </div>
      {!isNew ? (
        <label className="flex items-center gap-2 text-sm font-medium text-ink">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4 accent-brand-700" />
          Account active
        </label>
      ) : null}
      <div className="flex gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={save}
          className="inline-flex items-center gap-2 rounded-md bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-ink hover:bg-stone-100"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
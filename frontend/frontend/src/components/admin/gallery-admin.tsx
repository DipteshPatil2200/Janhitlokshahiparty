"use client";

import * as React from "react";
import { Loader2, Pencil, Plus, RefreshCw, Trash2, Upload, X } from "lucide-react";
import { adminFetch, uploadAdminFile } from "@/lib/admin";

interface GalleryDoc {
  _id: string;
  id: string;
  title?: { en?: string; mr?: string };
  slug?: string;
  category?: string;
  coverImage?: string;
  isPublished?: boolean;
  images?: { _id: string; url: string; order?: number }[];
  [k: string]: any;
}

export function GalleryAdmin() {
  const [items, setItems] = React.useState<GalleryDoc[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [editing, setEditing] = React.useState<GalleryDoc | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminFetch<{ items: any[] }>("/gallery?limit=100&withImages=true");
      setItems(
        data.items.map((g: any) => ({ ...g, id: String(g._id), images: g.images || [] }))
      );
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
        <h2 className="text-lg font-semibold text-ink">Gallery</h2>
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
            onClick={() => setEditing({ _id: "", id: "", images: [] } as GalleryDoc)}
            className="inline-flex items-center gap-1.5 rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
          >
            <Plus className="h-4 w-4" aria-hidden="true" /> New album
          </button>
        </div>
      </div>

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      {editing ? (
        <GalleryForm
          album={editing}
          onSave={async () => {
            setEditing(null);
            await load();
          }}
          onCancel={() => setEditing(null)}
        />
      ) : loading ? (
        <p className="text-sm text-ink-muted">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-ink-muted">No albums yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((g) => (
            <div key={g.id} className="overflow-hidden rounded-lg border border-border bg-white">
              {g.coverImage || g.images?.[0]?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={g.coverImage || g.images![0].url}
                  alt=""
                  className="h-36 w-full object-cover"
                />
              ) : (
                <div className="flex h-36 items-center justify-center bg-stone-100 text-xs text-ink-muted">
                  No cover
                </div>
              )}
              <div className="space-y-1 p-4">
                <p className="font-semibold text-ink">
                  {g.title?.en || g.title?.mr || "Untitled"}
                </p>
                <p className="text-xs text-ink-muted">
                  {g.category || "General"} · {g.images?.length || 0} photos
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span
                    className={[
                      "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                      g.isPublished !== false ? "bg-green-100 text-green-700" : "bg-stone-200 text-ink-muted",
                    ].join(" ")}
                  >
                    {g.isPublished !== false ? "Published" : "Draft"}
                  </span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      title="Edit"
                      onClick={() => setEditing(g)}
                      className="rounded p-1.5 text-ink-muted hover:bg-stone-100 hover:text-ink"
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      title="Delete"
                      onClick={async () => {
                        if (!confirm(`Delete album "${g.title?.en || g.slug}"?`)) return;
                        await adminFetch(`/gallery/${g.id}`, { method: "DELETE" });
                        await load();
                      }}
                      className="rounded p-1.5 text-ink-muted hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const baseInput =
  "w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/30";

function GalleryForm({
  album,
  onSave,
  onCancel,
}: {
  album: GalleryDoc;
  onSave: () => Promise<void>;
  onCancel: () => void;
}) {
  const isNew = !album._id;
  const [data, setData] = React.useState<any>(() => {
    const { _id, id, images, ...rest } = album;
    return { ...rest, title: rest.title || { en: "", mr: "" } };
  });
  const [busy, setBusy] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);

  const set = (k: string, v: any) => setData((d: any) => ({ ...d, [k]: v }));
  const setLocal = (k: string, loc: "en" | "mr", v: string) =>
    setData((d: any) => ({ ...d, [k]: { ...(d[k] || {}), [loc]: v } }));

  const addImages = async (files: File[]) => {
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const f of files) urls.push(await uploadAdminFile(f));
      if (isNew) {
        setData((d: any) => ({ ...d, images: [...(d.images || []), ...urls] }));
      } else {
        await adminFetch(`/gallery/${album.id}/images`, {
          method: "POST",
          body: JSON.stringify({ images: urls }),
        });
      }
    } catch (e: any) {
      alert(e?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (imgUrlOrId: string) => {
    if (isNew) {
      setData((d: any) => ({
        ...d,
        images: (d.images || []).filter((u: string) => u !== imgUrlOrId),
      }));
    } else {
      await adminFetch(`/gallery/${album.id}/images/${imgUrlOrId}`, { method: "DELETE" });
      await save();
    }
  };

  const save = async () => {
    setBusy(true);
    try {
      const body: any = {};
      for (const k of Object.keys(data)) {
        if (k === "images") continue;
        body[k] = data[k];
      }
      if (isNew) {
        const urls: string[] = data.images || [];
        await adminFetch("/gallery", {
          method: "POST",
          body: JSON.stringify({ ...body, images: urls }),
        });
      } else {
        await adminFetch(`/gallery/${album.id}`, { method: "PUT", body: JSON.stringify(body) });
      }
      await onSave();
    } catch (e: any) {
      alert(e?.message || "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const localInput = (k: string, loc: "en" | "mr") => (
    <input
      type="text"
      value={data[k]?.[loc] || ""}
      onChange={(e) => setLocal(k, loc, e.target.value)}
      placeholder={loc === "en" ? "English" : "मराठी"}
      className={baseInput}
    />
  );

  return (
    <div className="rounded-lg border border-border bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-ink">{isNew ? "New album" : "Edit album"}</h3>
        <button type="button" onClick={onCancel} className="rounded p-1.5 text-ink-muted hover:bg-stone-100">
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-ink">Title</label>
          <div className="grid gap-2 sm:grid-cols-2">{localInput("title", "en")}{localInput("title", "mr")}</div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-ink">Slug</label>
            <input type="text" value={data.slug || ""} onChange={(e) => set("slug", e.target.value)} className={baseInput} />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-ink">Category</label>
            <input type="text" value={data.category || ""} onChange={(e) => set("category", e.target.value)} className={baseInput} />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-ink">Cover image URL</label>
          <input type="text" value={data.coverImage || ""} onChange={(e) => set("coverImage", e.target.value)} className={baseInput} />
        </div>
        <label className="flex items-center gap-2 text-sm font-medium text-ink">
          <input type="checkbox" checked={data.isPublished !== false} onChange={(e) => set("isPublished", e.target.checked)} className="h-4 w-4 accent-brand-700" />
          Published
        </label>

        {/* Images */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">Photos ({data.images?.length || 0})</p>
            <label
              className={[
                "inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-brand-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-800",
                uploading ? "opacity-60" : "",
              ].join(" ")}
            >
              {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <Upload className="h-3.5 w-3.5" aria-hidden="true" />}
              Upload
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length) addImages(files);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
            {(data.images || []).map((img: any, i: number) => (
              <div key={i} className="group relative aspect-square overflow-hidden rounded-md border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={typeof img === "string" ? img : img.url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  title="Remove"
                  onClick={() => removeImage(typeof img === "string" ? img : img._id)}
                  className="absolute right-1 top-1 rounded bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              </div>
            ))}
            {!((data.images || []).length) ? (
              <p className="col-span-full text-xs text-ink-muted">No photos yet — upload to get started.</p>
            ) : null}
          </div>
        </div>

        <div className="flex gap-2 pt-1">
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
    </div>
  );
}
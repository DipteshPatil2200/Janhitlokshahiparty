import type { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { Gallery, GalleryImage } from "../models";
import { AppError } from "../middleware/error";
import { env } from "../config/env";
import { slugify } from "../utils/helpers";

/** Build a guaranteed-unique slug for a new gallery. */
function makeSlug(title: unknown): string {
  const base =
    typeof title === "string" ? title : (title as any)?.en || (title as any)?.mr || "album";
  return `${slugify(base)}-${Date.now().toString().slice(-6)}`;
}

/** Resolve an uploaded file's public URL/path back into uploadDir and remove it. */
function unlinkUploadedFile(url: unknown) {
  if (typeof url !== "string" || !url) return;
  if (/^https?:\/\//.test(url) && !url.startsWith(env.publicBaseUrl.replace(/\/$/, ""))) return;
  let rel = url;
  const base = env.publicBaseUrl.replace(/\/$/, "");
  for (const prefix of [`${base}/api/uploads/`, `${base}/uploads/`, `/api/uploads/`, `/uploads/`]) {
    if (rel.startsWith(prefix)) {
      rel = rel.slice(prefix.length);
      break;
    }
  }
  const root = path.resolve(env.uploadDir);
  const abs = path.resolve(root, rel);
  const within = abs === root || abs.startsWith(root + path.sep);
  if (!within) return;
  try {
    if (fs.existsSync(abs) && fs.statSync(abs).isFile()) fs.unlinkSync(abs);
  } catch {
    /* best-effort cleanup */
  }
}

function cleanBody(body: any, allowed?: string[]) {
  const obj: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(body)) {
    if (v === undefined) continue;
    if (allowed && !allowed.includes(k)) continue;
    obj[k] = v;
  }
  delete obj._id;
  delete obj.createdAt;
  delete obj.updatedAt;
  delete obj.images; // images are managed via the /gallery/:id/images endpoints
  return obj;
}

const GALLERY_FIELDS = [
  "title", "slug", "description", "coverImage", "category", "isPublished",
];

/** List galleries (optionally with images). */
export async function listGalleries(req: Request, res: Response, next: NextFunction) {
  try {
    const q: any = {};
    if (req.user === undefined) q.isPublished = true;
    if (req.query.category) q.category = req.query.category;
    const page = Math.min(10000, Math.max(1, Number(req.query.page) || 1));
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const [galleries, total] = await Promise.all([
      Gallery.find(q).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Gallery.countDocuments(q),
    ]);
    const withImages = req.query.withImages === "true";
    let items = galleries;
    if (withImages) {
      const ids = galleries.map((g: any) => g._id);
      const images = await GalleryImage.find({ galleryId: { $in: ids } }).sort({ order: 1, createdAt: 1 }).lean();
      const byGallery = new Map<string, any[]>();
      images.forEach((img: any) => {
        const k = String(img.galleryId);
        if (!byGallery.has(k)) byGallery.set(k, []);
        byGallery.get(k)!.push(img);
      });
      items = galleries.map((g: any) => ({
        ...g,
        images: byGallery.get(String(g._id)) || [],
      }));
    }
    res.json({ items, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
}

/** Get one gallery with its images (public shows published). */
export async function getGallery(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    let g: any = "slug" in Gallery.schema.paths ? await Gallery.findOne({ slug: id }) : null;
    if (!g && mongoose.isValidObjectId(id)) g = await Gallery.findById(id);
    if (!g) throw new AppError(404, "Gallery not found");
    if (!g.isPublished && req.user === undefined) throw new AppError(404, "Gallery not found");
    const images = await GalleryImage.find({ galleryId: g._id }).sort({ order: 1, createdAt: 1 }).lean();
    res.json({ gallery: g, images });
  } catch (err) {
    next(err);
  }
}

/** Create a gallery plus optional image URLs. */
export async function createGallery(req: Request, res: Response, next: NextFunction) {
  try {
    const body = cleanBody(req.body, GALLERY_FIELDS);
    if (body.slug && typeof body.slug === "string") {
      body.slug = body.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-");
    } else {
      body.slug = makeSlug(body.title);
    }
    const { images } = req.body;
    const g = await Gallery.create(body);
    if (Array.isArray(images) && images.length) {
      const urls = images
        .map((x: any) => (typeof x === "string" ? x : x?.url))
        .filter((u: any): u is string => typeof u === "string" && u.length > 0);
      if (urls.length) {
        await GalleryImage.insertMany(
          urls.map((url: string, i: number) => ({ galleryId: g._id, url, order: i + 1 }))
        );
      }
    }
    const out = await Gallery.findById(g._id).lean();
    res.status(201).json(out);
  } catch (err) {
    next(err);
  }
}

/** Update gallery metadata. Images are managed via the dedicated endpoints. */
export async function updateGallery(req: Request, res: Response, next: NextFunction) {
  try {
    const body = cleanBody(req.body, GALLERY_FIELDS);
    const g = await Gallery.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true }).lean();
    if (!g) throw new AppError(404, "Gallery not found");
    res.json(g);
  } catch (err) {
    next(err);
  }
}

/** Delete a gallery, its image records, and the uploaded files. */
export async function deleteGallery(req: Request, res: Response, next: NextFunction) {
  try {
    const g = await Gallery.findById(req.params.id);
    if (!g) throw new AppError(404, "Gallery not found");
    const imgs = await GalleryImage.find({ galleryId: g._id }).lean();
    imgs.forEach((img: any) => unlinkUploadedFile(img.url));
    await GalleryImage.deleteMany({ galleryId: g._id });
    await Gallery.findByIdAndDelete(g._id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

/** Add images to an existing gallery. */
export async function addImages(req: Request, res: Response, next: NextFunction) {
  try {
    const g = await Gallery.findById(req.params.id);
    if (!g) throw new AppError(404, "Gallery not found");
    const { images } = req.body;
    if (!Array.isArray(images) || !images.length) throw new AppError(400, "images array required");
    const maxOrder = await GalleryImage.find({ galleryId: g._id })
      .sort({ order: -1 })
      .limit(1)
      .lean();
    const start = (maxOrder[0]?.order ?? 0) + 1;
    const docs: { galleryId: unknown; url: string; order: number }[] = [];
    images.forEach((x: any, i: number) => {
      const url = typeof x === "string" ? x : x?.url;
      if (typeof url === "string" && url.length > 0) {
        docs.push({ galleryId: g._id, url, order: start + i });
      }
    });
    if (!docs.length) throw new AppError(400, "images array must contain valid URLs");
    await GalleryImage.insertMany(docs);
    const fresh = await GalleryImage.find({ galleryId: g._id }).sort({ order: 1 }).lean();
    res.status(201).json({ items: fresh });
  } catch (err) {
    next(err);
  }
}

/** Delete one image (scoped to the gallery in the URL, removes its file). */
export async function deleteImage(req: Request, res: Response, next: NextFunction) {
  try {
    const { id, imageId } = req.params;
    const img = await GalleryImage.findOneAndDelete({ _id: imageId, galleryId: id });
    if (!img) throw new AppError(404, "Image not found");
    unlinkUploadedFile(img.url);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

import type { Request, Response, NextFunction } from "express";
import type { Model } from "mongoose";
import mongoose from "mongoose";
import { pickDefined, slugify } from "../utils/helpers";

type AnyDoc = any;

function cleanBody(body: any, allowed?: string[]) {
  const obj = pickDefined({ ...body });
  delete obj._id;
  delete obj.createdAt;
  delete obj.updatedAt;
  if (allowed && allowed.length) {
    for (const k of Object.keys(obj)) {
      if (!allowed.includes(k)) delete obj[k];
    }
  }
  return obj;
}

function buildSlug(body: any) {
  const base =
    typeof body.title === "string"
      ? body.title
      : body.title?.en || body.title?.mr || body.name?.en || body.name?.mr || "item";
  // slugify strips non-ASCII (incl. Marathi) and falls back to a clean ASCII
  // slug with a timestamp, so Marathi-only titles still get a valid unique slug
  // (never a malformed leading-dash value).
  const slug = slugify(base);
  return `${slug}-${Date.now().toString().slice(-6)}`;
}

export function createCrudController(
  model: Model<AnyDoc>,
  opts: {
    publicRead?: boolean;
    allowedCreate?: string[];
    allowedUpdate?: string[];
    slug?: boolean;
    sort?: Record<string, 1 | -1>;
  } = {}
) {
  const { publicRead = true, slug = false, sort = { createdAt: -1 } } = opts;

  return {
    /** GET list — public unless protected flag requested. */
    async list(req: Request, res: Response, next: NextFunction) {
      try {
        const q: Record<string, any> = {};
        const { isPublished, status, featured, category, type, parentId } = req.query;
        if (req.user === undefined && publicRead) {
          if ("isPublished" in model.schema.paths) q.isPublished = true;
          if ("isActive" in model.schema.paths) q.isActive = true;
          if (status !== undefined && "status" in model.schema.paths) q.status = status;
        } else {
          if (isPublished !== undefined) q.isPublished = isPublished === "true";
          if (featured !== undefined && "featured" in model.schema.paths)
            q.featured = featured === "true";
          if (status !== undefined) q.status = status;
          if (type !== undefined) q.type = type;
          if (parentId !== undefined) q.parentId = parentId || null;
          if (category !== undefined && "category" in model.schema.paths) q.category = category;
        }
        const page = Math.min(10000, Math.max(1, Number(req.query.page) || 1));
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
        const skip = (page - 1) * limit;
        const sortQ: Record<string, 1 | -1> = {};
        const requestedSort = String(req.query.sort || Object.keys(sort)[0] || "createdAt");
        // Validate the sort key against known schema paths to avoid Mongo errors.
        const sortKey = requestedSort in model.schema.paths ? requestedSort : "createdAt";
        const sortDir = String(req.query.order || "desc") === "asc" ? 1 : -1;
        sortQ[sortKey] = sortDir as 1 | -1;

        const [items, total] = await Promise.all([
          model.find(q).sort(sortQ).skip(skip).limit(limit).lean(),
          model.countDocuments(q),
        ]);
        res.json({ items, total, page, limit, totalPages: Math.ceil(total / limit) });
      } catch (err) {
        next(err);
      }
    },

    /** GET one by slug if the model has a slug field, else by id. */
    async getBySlug(req: Request, res: Response, next: NextFunction) {
      try {
        const { id } = req.params;
        const q: Record<string, any> = {};
        // Anonymous visitors must never see unpublished/inactive content.
        if (req.user === undefined && publicRead) {
          if ("isPublished" in model.schema.paths) q.isPublished = true;
          if ("isActive" in model.schema.paths) q.isActive = true;
        }
        let doc: any = null;
        if ("slug" in model.schema.paths) {
          doc = await model.findOne({ ...q, slug: id }).lean();
        }
        if (!doc && mongoose.isValidObjectId(id)) {
          doc = await model.findOne({ ...q, _id: id }).lean();
        }
        if (!doc) return res.status(404).json({ error: "Not found" });
        res.json(doc);
      } catch (err) {
        next(err);
      }
    },

    /** POST create (protected). */
    async create(req: Request, res: Response, next: NextFunction) {
      try {
        const body = cleanBody(req.body, opts.allowedCreate);
        if (slug && !body.slug) body.slug = buildSlug(body);
        const doc = await model.create(body);
        res.status(201).json(doc);
      } catch (err) {
        next(err);
      }
    },

    /** PUT update by id (protected). */
    async update(req: Request, res: Response, next: NextFunction) {
      try {
        const body = cleanBody(req.body, opts.allowedUpdate);
        const doc = await model
          .findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true })
          .lean();
        if (!doc) return res.status(404).json({ error: "Not found" });
        res.json(doc);
      } catch (err) {
        next(err);
      }
    },

    /** DELETE by id (protected). */
    async remove(req: Request, res: Response, next: NextFunction) {
      try {
        const doc = await model.findByIdAndDelete(req.params.id);
        if (!doc) return res.status(404).json({ error: "Not found" });
        res.status(204).end();
      } catch (err) {
        next(err);
      }
    },
  };
}
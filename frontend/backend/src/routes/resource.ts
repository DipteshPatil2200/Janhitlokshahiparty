import { Router } from "express";
import { createCrudController } from "../controllers/crud";
import { requireAuth, requireRole, optionalAuth } from "../middleware/auth";

/** Build a resource router: public read + protected admin CRUD. */
export function resourceRouter(
  model: any,
  opts: {
    slug?: boolean;
    publicRead?: boolean;
    role?: string[];
  } = {}
) {
  const router = Router();
  const c = createCrudController(model, {
    slug: opts.slug ?? true,
    publicRead: opts.publicRead ?? true,
    sort: { createdAt: -1 },
  });

  // optionalAuth lets logged-in admins see unpublished content in lists/detail.
  router.get("/", optionalAuth, c.list);
  router.get("/:id", optionalAuth, c.getBySlug);

  const guards: any[] = opts.role?.length ? [requireAuth, requireRole(...opts.role)] : [requireAuth];
  router.post("/", ...guards, c.create);
  router.put("/:id", ...guards, c.update);
  router.patch("/:id", ...guards, c.update);
  router.delete("/:id", ...guards, c.remove);

  return router;
}
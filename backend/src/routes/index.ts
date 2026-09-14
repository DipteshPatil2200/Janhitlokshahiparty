import { Router } from "express";
import authRoutes from "./auth";
import { resourceRouter } from "./resource";
import {
  News,
  Leader,
  Campaign,
  Event,
  Video,
  DocumentModel,
  OrganizationUnit,
  JoinRequest,
  VolunteerRequest,
  ContactMessage,
  SocialLink,
} from "../models";
import { requireAuth, requireRole, optionalAuth } from "../middleware/auth";
import { upload } from "../middleware/upload";
import { formLimiter, apiLimiter } from "../middleware/rateLimit";
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  me,
} from "../controllers/auth";
import {
  getSettings,
  updateSettings,
  getDonationSettings,
  updateDonationSettings,
} from "../controllers/settings";
import { dashboardStats } from "../controllers/dashboard";
import { orgTree } from "../controllers/org";
import {
  listGalleries,
  getGallery,
  createGallery,
  updateGallery,
  deleteGallery,
  addImages,
  deleteImage,
} from "../controllers/gallery";
import { uploadFiles, deleteFile } from "../controllers/upload";
import { publicBundle } from "../controllers/public";
import { validateSubmission } from "../utils/validate";

const router = Router();

// ---- Health ----
router.get("/health", (_req, res) => res.json({ ok: true, ts: Date.now() }));

// ---- Public content bundle (homepage) ----
router.get("/public/bundle", apiLimiter, publicBundle);

// ---- Auth ----
router.use("/auth", authRoutes);
router.get("/auth/me", requireAuth, me);

// ---- Users (super admin only) ----
router.get("/users", requireAuth, requireRole("super_admin"), listUsers);
router.post("/users", requireAuth, requireRole("super_admin"), createUser);
router.put("/users/:id", requireAuth, requireRole("super_admin"), updateUser);
router.delete("/users/:id", requireAuth, requireRole("super_admin"), deleteUser);

// ---- Content resources (public read; admin write) ----
router.use("/news", apiLimiter, resourceRouter(News, { role: ["content_manager"] }));
router.use("/leaders", apiLimiter, resourceRouter(Leader, { role: ["content_manager"] }));
router.use("/campaigns", apiLimiter, resourceRouter(Campaign, { role: ["content_manager"] }));
router.use("/events", apiLimiter, resourceRouter(Event, { role: ["content_manager"] }));
router.use("/videos", apiLimiter, resourceRouter(Video, { role: ["content_manager"] }));
router.use("/documents", apiLimiter, resourceRouter(DocumentModel, { role: ["content_manager"] }));
// ---- Organization (tree must be registered BEFORE the resource router so
// it is not shadowed by the resource router's GET /:id) ----
router.get("/organization/tree", apiLimiter, orgTree);
router.use("/organization", apiLimiter, resourceRouter(OrganizationUnit, { role: ["organization_manager"] }));
router.use("/social-links", apiLimiter, resourceRouter(SocialLink, { role: ["media_manager"] }));

// ---- Gallery (has images) ----
router.get("/gallery", apiLimiter, optionalAuth, listGalleries);
router.get("/gallery/:id", apiLimiter, optionalAuth, getGallery);
router.post("/gallery", requireAuth, requireRole("media_manager"), createGallery);
router.put("/gallery/:id", requireAuth, requireRole("media_manager"), updateGallery);
router.patch("/gallery/:id", requireAuth, requireRole("media_manager"), updateGallery);
router.delete("/gallery/:id", requireAuth, requireRole("media_manager"), deleteGallery);
router.post("/gallery/:id/images", requireAuth, requireRole("media_manager"), addImages);
router.delete("/gallery/:id/images/:imageId", requireAuth, requireRole("media_manager"), deleteImage);

// ---- Form submissions (public POST with validation + rate limit; admin read) ----
// Inbox (join/volunteer/contact) contains citizen PII — gate read/edit to
// authorized roles only.
const inboxGuard = [requireAuth, requireRole("super_admin", "content_manager")];

router.post(
  "/join-requests",
  formLimiter,
  (req, res, next) =>
    JoinRequest.create(
      validateSubmission<Record<string, unknown>>(req.body, {
        required: ["fullName", "mobile"],
        emailFields: ["email"],
        mobileFields: ["mobile"],
        allow: ["district", "taluka", "city", "message"],
      })
    )
      .then((d) => res.status(201).json(d))
      .catch(next)
);
router.use("/join-requests", ...inboxGuard);
router.get("/join-requests", async (req, res, next) => {
  try {
    const page = Math.min(10000, Math.max(1, Number(req.query.page) || 1));
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const [items, total] = await Promise.all([
      JoinRequest.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      JoinRequest.countDocuments(),
    ]);
    res.json({ items, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (e) { next(e); }
});
router.patch("/join-requests/:id", (req, res, next) => {
  const body = req.body && typeof req.body === "object" ? { status: req.body.status } : {};
  return JoinRequest.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true })
    .then((d) => (d ? res.json(d) : res.status(404).json({ error: "Not found" })))
    .catch(next);
});
router.delete("/join-requests/:id", (req, res, next) =>
  JoinRequest.findByIdAndDelete(req.params.id)
    .then((d) => (d ? res.status(204).end() : res.status(404).json({ error: "Not found" })))
    .catch(next)
);

router.post(
  "/volunteer-requests",
  formLimiter,
  (req, res, next) =>
    VolunteerRequest.create(
      validateSubmission<Record<string, unknown>>(req.body, {
        required: ["fullName", "mobile"],
        emailFields: ["email"],
        mobileFields: ["mobile"],
        allow: ["district", "city", "categories", "availability", "message"],
      })
    )
      .then((d) => res.status(201).json(d))
      .catch(next)
);
router.use("/volunteer-requests", ...inboxGuard);
router.get("/volunteer-requests", async (req, res, next) => {
  try {
    const page = Math.min(10000, Math.max(1, Number(req.query.page) || 1));
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const [items, total] = await Promise.all([
      VolunteerRequest.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      VolunteerRequest.countDocuments(),
    ]);
    res.json({ items, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (e) { next(e); }
});
router.patch("/volunteer-requests/:id", (req, res, next) => {
  const body = req.body && typeof req.body === "object" ? { status: req.body.status } : {};
  return VolunteerRequest.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true })
    .then((d) => (d ? res.json(d) : res.status(404).json({ error: "Not found" })))
    .catch(next);
});
router.delete("/volunteer-requests/:id", (req, res, next) =>
  VolunteerRequest.findByIdAndDelete(req.params.id)
    .then((d) => (d ? res.status(204).end() : res.status(404).json({ error: "Not found" })))
    .catch(next)
);

router.post(
  "/contact-messages",
  formLimiter,
  (req, res, next) => {
    const body = validateSubmission<Record<string, unknown>>(req.body, {
      required: ["name", "email", "message"],
      emailFields: ["email"],
      mobileFields: ["mobile"],
      allow: ["subject"],
    });
    // Frontend sends `name`; store it as the model's `fullName`.
    body.fullName = body.name;
    delete body.name;
    return ContactMessage.create(body)
      .then((d) => res.status(201).json(d))
      .catch(next);
  }
);
router.use("/contact-messages", ...inboxGuard);
router.get("/contact-messages", async (req, res, next) => {
  try {
    const page = Math.min(10000, Math.max(1, Number(req.query.page) || 1));
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const [items, total] = await Promise.all([
      ContactMessage.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      ContactMessage.countDocuments(),
    ]);
    res.json({ items, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (e) { next(e); }
});
router.patch("/contact-messages/:id", (req, res, next) => {
  const body = req.body && typeof req.body === "object" ? { status: req.body.status } : {};
  return ContactMessage.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true })
    .then((d) => (d ? res.json(d) : res.status(404).json({ error: "Not found" })))
    .catch(next);
});
router.delete("/contact-messages/:id", (req, res, next) =>
  ContactMessage.findByIdAndDelete(req.params.id)
    .then((d) => (d ? res.status(204).end() : res.status(404).json({ error: "Not found" })))
    .catch(next)
);

// ---- Settings (protected) ----
router.get("/site-settings", apiLimiter, getSettings);
router.put("/site-settings", requireAuth, requireRole("super_admin", "content_manager"), updateSettings);
router.get("/donation-settings", apiLimiter, getDonationSettings);
router.put("/donation-settings", requireAuth, requireRole("super_admin"), updateDonationSettings);

// ---- Dashboard ----
router.get("/dashboard/stats", requireAuth, dashboardStats);

// ---- Uploads ----
router.post("/upload", requireAuth, requireRole("media_manager", "super_admin", "content_manager"), upload.array("files", 20), uploadFiles);
router.delete("/upload", requireAuth, requireRole("media_manager", "super_admin"), deleteFile);

// ---- Static uploads (served publicly so images load on the site) ----
router.use("/uploads", require("../middleware/staticUploads").default);

export default router;
import type { Request, Response, NextFunction } from "express";
import { v2 as cloudinary } from "cloudinary";
import { AppError } from "../middleware/error";

/**
 * Upload one or many files to Cloudinary.
 * Returns Cloudinary public URLs + metadata.
 */
export function uploadFiles(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const files = (req.files as Express.Multer.File[]) ?? [];

    if (!files.length) {
      throw new AppError(400, "No files uploaded");
    }

    const results = files.map((f) => ({
      url: f.path,
      originalName: f.originalname,
      mimeType: f.mimetype,
      size: f.size,
    }));

    res.status(201).json({ files: results });
  } catch (err) {
    next(err);
  }
}

/**
 * Delete an uploaded file from Cloudinary.
 * Protected route.
 */
export async function deleteFile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { url } = req.body;

    if (!url || typeof url !== "string") {
      throw new AppError(400, "url required");
    }

    // Extract Cloudinary public ID from URL
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)$/);

    if (!match) {
      throw new AppError(400, "Invalid Cloudinary URL");
    }

    const publicIdWithExtension = decodeURIComponent(match[1]);

    // Documents are stored as raw files.
    const isRaw = /\/raw\/upload\//.test(url);

    const publicId = isRaw
      ? publicIdWithExtension
      : publicIdWithExtension.replace(/\.[^/.]+$/, "");

    await cloudinary.uploader.destroy(publicId, {
      resource_type: isRaw ? "raw" : "image",
    });

    res.json({ deleted: true });
  } catch (err) {
    next(err);
  }
}
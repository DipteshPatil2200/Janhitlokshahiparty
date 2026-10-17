import type { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}

export function notFound(req: Request, res: Response) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  // Bad request syntax (JSON body parse errors)
  if (err instanceof SyntaxError && "status" in err && (err as any).status === 400) {
    return res.status(400).json({ error: "Invalid JSON body" });
  }
  // Bad ObjectId / invalid cast
  if (err?.name === "CastError") {
    return res.status(400).json({ error: `Invalid value for ${err.path || "field"}` });
  }
  // Mongoose validation errors
  if (err?.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e: any) => e.message);
    return res.status(400).json({ error: "Validation failed", details: messages });
  }
  // Mongoose duplicate key
  if (err?.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "value";
    return res.status(409).json({ error: `Duplicate value for ${field}` });
  }
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  // Multer errors
  if (err?.name === "MulterError") {
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }
  if (err?.message?.includes("file too large")) {
    return res.status(400).json({ error: "File too large" });
  }
  // Multer file-filter rejection (e.g. disallowed file type).
  if (err instanceof Error && /only images/i.test(err.message)) {
    return res.status(400).json({ error: err.message });
  }
  // eslint-disable-next-line no-console
  console.error("[error]", err);
  res.status(500).json({ error: "Internal server error" });
}

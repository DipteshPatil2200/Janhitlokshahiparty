import express from "express";
import cors from "cors";
import helmet from "helmet";

import { env } from "./config/env";
import { connectDB } from "./config/db";
import routes from "./routes";

// The donation router is currently implemented in JavaScript without type declarations.
// @ts-expect-error - declaration file will be added when the route is migrated to TypeScript.
import donationRoutes from "./routes/donations.routes";

import { notFound, errorHandler } from "./middleware/error";
import staticUploadsMiddleware from "./middleware/staticUploads";

async function main() {
  // Connect to MongoDB before starting the API
  await connectDB();

  const app = express();

  // Required when running behind Vercel/proxy
  app.set("trust proxy", 1);

  // Security headers
  app.use(
    helmet({
      crossOriginResourcePolicy: {
        policy: "cross-origin",
      },
    })
  );

  // CORS configuration
  const allowedOrigins = env.clientUrl
    ? env.clientUrl
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
    : [];

  app.use(
    cors({
      origin:
        allowedOrigins.length > 0
          ? allowedOrigins
          : true,
      credentials: true,
    })
  );

  // Request parsers
  app.use(express.json({ limit: "2mb" }));
  app.use(
    express.urlencoded({
      extended: true,
      limit: "2mb",
    })
  );

  // --------------------------------------------------
  // Health / Deployment Test Routes
  // --------------------------------------------------

  app.get("/", (_req, res) => {
    res.status(200).json({
      success: true,
      message: "Janhit Lokshahi Party API is running",
      environment: process.env.NODE_ENV || "development",
    });
  });

  app.get("/api/health", (_req, res) => {
    res.status(200).json({
      success: true,
      status: "healthy",
      message: "JLP Backend API is healthy",
      timestamp: new Date().toISOString(),
    });
  });

  // --------------------------------------------------
  // Application Routes
  // --------------------------------------------------

  // Files uploaded through the admin CMS
  app.use("/api/uploads", staticUploadsMiddleware);

  // Donation routes
  app.use("/api/donations", donationRoutes);

  // Main API routes
  app.use("/api", routes);

  // --------------------------------------------------
  // Error Handling
  // --------------------------------------------------

  app.use(notFound);
  app.use(errorHandler);

  // --------------------------------------------------
  // Start Server
  // --------------------------------------------------

  app.listen(env.port, () => {
    console.log(
      `[server] JLP API running on port ${env.port} (${process.env.NODE_ENV || "development"})`
    );
  });
}

main().catch((err) => {
  console.error("[fatal] Failed to start JLP backend:", err);
  process.exit(1);
});

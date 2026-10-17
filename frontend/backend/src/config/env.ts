import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const nodeEnv = process.env.NODE_ENV || "development";
const jwtSecret = process.env.JWT_SECRET || "dev-secret";
const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";

// Fail fast in production rather than silently running with known weak
// defaults that would compromise the admin account and auth.
if (nodeEnv === "production") {
  if (!process.env.JWT_SECRET || jwtSecret.length < 32) {
    throw new Error(
      "Production requires a strong JWT_SECRET (>= 32 chars). Set it in the backend .env file."
    );
  }
  if (adminPassword === "Admin@12345") {
    throw new Error(
      "Production requires a non-default ADMIN_PASSWORD. Set it in the backend .env file."
    );
  }
  // Never allow fabricated demo content (fake bank details, placeholder
  // socials/contacts, sample org units) to reach a live site.
  if (process.env.SEED_DEMO === "true") {
    throw new Error(
      "Production does not allow SEED_DEMO=true (fabricated demo content would be published). Unset it."
    );
  }
}

export const env = {
  port: Number(process.env.PORT || 4000),
  nodeEnv,
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  mongodbUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/jlp",
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  adminEmail: process.env.ADMIN_EMAIL || "admin@janhitlokshahi.in",
  adminPassword,
  uploadDir: path.resolve(__dirname, "../../", process.env.UPLOAD_DIR || "../uploads"),
  maxUploadSizeMb: Number(process.env.MAX_UPLOAD_SIZE_MB || 10),
  publicBaseUrl: process.env.PUBLIC_BASE_URL || "http://localhost:4000",
  seedDemo: process.env.SEED_DEMO === "true",
} as const;

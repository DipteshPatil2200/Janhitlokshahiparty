// import express from "express";
// import cors from "cors";
// import helmet from "helmet";
// import { env } from "./config/env";
// import { connectDB } from "./config/db";
// import routes from "./routes";
// import { notFound, errorHandler } from "./middleware/error";

// async function main() {
//   await connectDB();

//   const app = express();

//   app.set("trust proxy", 1);

//   app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
//   app.use(
//     cors({
//       origin: env.clientUrl ? env.clientUrl.split(",").map((s) => s.trim()) : "*",
//       credentials: true,
//     })
//   );
//   app.use(express.json({ limit: "2mb" }));
//   app.use(express.urlencoded({ extended: true }));

//   app.use("/api", routes);

//   app.use(notFound);
//   app.use(errorHandler);

//   app.listen(env.port, () => {
//     // eslint-disable-next-line no-console
//     console.log(`[server] API running at http://localhost:${env.port}`);
//   });
// }

// main().catch((err) => {
//   // eslint-disable-next-line no-console
//   console.error("[fatal]", err);
//   process.exit(1);
// });

// nikhil
import express from "express";
import cors from "cors";
import helmet from "helmet";

import { env } from "./config/env";
import { connectDB } from "./config/db";
import routes from "./routes";
// The donation router is currently implemented in JavaScript without type declarations.
// @ts-expect-error — declaration file will be added when the route is migrated to TypeScript.
import donationRoutes from "./routes/donations.routes";
import { notFound, errorHandler } from "./middleware/error";

async function main() {
  await connectDB();

  const app = express();

  app.set("trust proxy", 1);

  app.use(
    helmet({
      crossOriginResourcePolicy: {
        policy: "cross-origin",
      },
    }),
  );

  app.use(
    cors({
      origin: env.clientUrl
        ? env.clientUrl.split(",").map((s) => s.trim())
        : "*",
      credentials: true,
    }),
  );

  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Donation routes
  app.use("/api/donations", donationRoutes);

  // Other API routes
  app.use("/api", routes);

  // 404 handler
  app.use(notFound);

  // Global error handler
  app.use(errorHandler);

  app.listen(env.port, () => {
    console.log(`[server] API running at http://localhost:${env.port}`);
  });
}

main().catch((err) => {
  console.error("[fatal]", err);
  process.exit(1);
});

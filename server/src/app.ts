import cors from "cors";
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { authRouter } from "./routes/auth.routes";
import { leadRouter } from "./routes/lead.routes";
import { HttpError } from "./utils/httpError";

export const app = express();

app.use(morgan("combined"));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/leads", leadRouter);

app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    dbStatus: "unknown",
    nodeVersion: process.version,
    timestamp: new Date().toISOString()
  });
});

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    data: null,
    message: "Route not found"
  });
});

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const statusCode = err instanceof HttpError ? err.statusCode : 500;
  const message = err instanceof HttpError ? err.message : "Internal server error";

  logger.error("Unhandled error", err instanceof Error ? { message: err.message, stack: err.stack } : { err });
  res.status(statusCode).json({
    success: false,
    data: null,
    message
  });
});

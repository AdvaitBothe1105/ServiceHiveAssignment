import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { authRouter } from "./routes/auth.routes";
import { leadRouter } from "./routes/lead.routes";
import { userRouter } from "./routes/user.routes";
import { apiRateLimiter } from "./middleware/rateLimiter.middleware";
import { errorHandler } from "./middleware/error.middleware";

export const app = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(morgan("combined"));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use("/api/v1", apiRateLimiter);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/leads", leadRouter);
app.use("/api/v1/users", userRouter);

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
app.use(errorHandler);

import type { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/httpError";
import { logger } from "../utils/logger";

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  const statusCode = err instanceof HttpError ? err.statusCode : 500;
  const message = err instanceof HttpError ? err.message : "Internal server error";

  logger.error(
    "Unhandled error",
    err instanceof Error ? { message: err.message, stack: err.stack } : { err }
  );

  res.status(statusCode).json({
    success: false,
    data: null,
    message
  });
};

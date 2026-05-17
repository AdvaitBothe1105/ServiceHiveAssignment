import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { env } from "../config/env";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import { authService } from "../services/auth.service";
import { HttpError } from "../utils/httpError";
import { parseDurationMs } from "../utils/parseDuration";

export const authController = {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        data: null,
        message: "Invalid request body"
      });
      return;
    }

    try {
      const user = await authService.register(parsed.data);
      res.status(201).json({
        success: true,
        data: user,
        message: "Registration successful"
      });
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.statusCode).json({
          success: false,
          data: null,
          message: error.message
        });
        return;
      }
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          data: null,
          message: "Invalid request body"
        });
        return;
      }
      next(error);
    }
  },
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        data: null,
        message: "Invalid request body"
      });
      return;
    }

    try {
      const { user, token } = await authService.login(parsed.data);
      const maxAge = parseDurationMs(env.JWT_EXPIRES_IN);

      res.cookie("token", token, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        ...(maxAge ? { maxAge } : {})
      });

      res.status(200).json({
        success: true,
        data: user,
        message: "Login successful"
      });
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.statusCode).json({
          success: false,
          data: null,
          message: error.message
        });
        return;
      }
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          data: null,
          message: "Invalid request body"
        });
        return;
      }
      next(error);
    }
  },
  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          data: null,
          message: "Unauthorized"
        });
        return;
      }

      const user = await authService.getMe(userId);
      res.status(200).json({
        success: true,
        data: user,
        message: "Current user"
      });
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.statusCode).json({
          success: false,
          data: null,
          message: error.message
        });
        return;
      }
      next(error);
    }
  }
};

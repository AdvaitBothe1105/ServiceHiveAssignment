import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import { authService } from "../services/auth.service";
import { HttpError } from "../utils/httpError";
import { parseDurationMs } from "../utils/parseDuration";
import { validate } from "../utils/validate";

export const authController = {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    const input = validate(registerSchema, req.body, "Invalid request body");
    const user = await authService.register(input);
    res.status(201).json({
      success: true,
      data: user,
      message: "Registration successful"
    });
  },
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const input = validate(loginSchema, req.body, "Invalid request body");
    const { user, token } = await authService.login(input);
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
  },
  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      throw new HttpError(401, "Unauthorized");
    }

    const user = await authService.getMe(userId);
    const expiresAt = req.user?.exp ? new Date(req.user.exp * 1000).toISOString() : null;

    res.status(200).json({
      success: true,
      data: { user, expiresAt },
      message: "Current user"
    });
  },
  async logout(req: Request, res: Response, _next: NextFunction): Promise<void> {
    res.clearCookie("token", {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax"
    });

    res.status(200).json({
      success: true,
      data: null,
      message: "Logged out"
    });
  }
};

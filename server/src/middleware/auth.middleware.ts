import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { HttpError } from "../utils/httpError";

export type AuthTokenPayload = {
  sub: string;
  role: "admin" | "sales";
  email: string;
  iat?: number;
  exp?: number;
};

export const verifyToken = (req: Request, _res: Response, next: NextFunction): void => {
  const token = req.cookies?.token;
  if (!token) {
    next(new HttpError(401, "Unauthorized"));
    return;
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
    req.user = { id: payload.sub, role: payload.role, email: payload.email };
    next();
  } catch (error) {
    next(new HttpError(401, "Unauthorized"));
  }
};

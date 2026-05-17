import type { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/httpError";
import type { UserRole } from "../models/user.model";

export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const user = req.user;
    if (!user) {
      next(new HttpError(401, "Unauthorized"));
      return;
    }

    if (!roles.includes(user.role)) {
      next(new HttpError(403, "Forbidden"));
      return;
    }

    next();
  };
};

import type { Request, Response, NextFunction } from "express";
import { patchRoleSchema } from "../validators/user.validator";
import { userService } from "../services/user.service";
import { HttpError } from "../utils/httpError";

export const userController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        throw new HttpError(401, "Unauthorized");
      }

      const users = await userService.list();
      res.status(200).json({
        success: true,
        data: users,
        message: "Users fetched"
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
  },
  async updateRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    const parsed = patchRoleSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        data: null,
        message: "Invalid request body"
      });
      return;
    }

    try {
      const user = req.user;
      if (!user) {
        throw new HttpError(401, "Unauthorized");
      }

      const updated = await userService.updateRole(req.params.id, parsed.data.role, user.id);
      res.status(200).json({
        success: true,
        data: updated,
        message: "User role updated"
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

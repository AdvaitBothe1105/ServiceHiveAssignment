import type { Request, Response, NextFunction } from "express";
import { patchRoleSchema } from "../validators/user.validator";
import { userService } from "../services/user.service";
import { HttpError } from "../utils/httpError";
import { validate } from "../utils/validate";

export const userController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
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
  },
  async updateRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    const input = validate(patchRoleSchema, req.body, "Invalid request body");
    const user = req.user;
    if (!user) {
      throw new HttpError(401, "Unauthorized");
    }

    const updated = await userService.updateRole(req.params.id, input.role, user.id);
    res.status(200).json({
      success: true,
      data: updated,
      message: "User role updated"
    });
  }
};

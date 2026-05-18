import type { Request, Response, NextFunction } from "express";
import { patchRoleSchema, userListQuerySchema } from "../validators/user.validator";
import { userService } from "../services/user.service";
import { HttpError } from "../utils/httpError";
import { validate } from "../utils/validate";

export const userController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    const user = req.user;
    if (!user) {
      throw new HttpError(401, "Unauthorized");
    }

    const query = validate(userListQuerySchema, req.query, "Invalid query parameters");
    const { items, total } = await userService.list(query);
    const totalPages = Math.max(1, Math.ceil(total / query.limit));

    res.status(200).json({
      success: true,
      data: items,
      message: "Users fetched",
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages
      }
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

import type { Request, Response, NextFunction } from "express";
import { leadListQuerySchema } from "../validators/lead.validator";
import { leadService } from "../services/lead.service";
import { HttpError } from "../utils/httpError";

export const leadController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    const parsed = leadListQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        data: null,
        message: "Invalid query parameters"
      });
      return;
    }

    try {
      const user = req.user;
      if (!user) {
        throw new HttpError(401, "Unauthorized");
      }

      const { items, total } = await leadService.list(parsed.data, user);
      const totalPages = Math.max(1, Math.ceil(total / parsed.data.limit));

      res.status(200).json({
        success: true,
        data: items,
        message: "Leads fetched",
        meta: {
          page: parsed.data.page,
          limit: parsed.data.limit,
          total,
          totalPages
        }
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

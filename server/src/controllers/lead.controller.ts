import type { Request, Response, NextFunction } from "express";
import { leadCreateSchema, leadListQuerySchema, leadUpdateSchema } from "../validators/lead.validator";
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
  },
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const parsed = leadCreateSchema.safeParse(req.body);
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

      const lead = await leadService.create(parsed.data, user);
      res.status(201).json({
        success: true,
        data: lead,
        message: "Lead created"
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
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        throw new HttpError(401, "Unauthorized");
      }

      const lead = await leadService.getById(req.params.id, user);
      res.status(200).json({
        success: true,
        data: lead,
        message: "Lead fetched"
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
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    const parsed = leadUpdateSchema.safeParse(req.body);
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

      const lead = await leadService.update(req.params.id, parsed.data, user);
      res.status(200).json({
        success: true,
        data: lead,
        message: "Lead updated"
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
  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        throw new HttpError(401, "Unauthorized");
      }

      const lead = await leadService.remove(req.params.id, user);
      res.status(200).json({
        success: true,
        data: lead,
        message: "Lead deleted"
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
  async exportCsv(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const stream = leadService.exportCsv(parsed.data, user);

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=leads.csv");

      stream.pipe(res);
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

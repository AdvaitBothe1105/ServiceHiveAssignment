import type { Request, Response, NextFunction } from "express";
import { leadCreateSchema, leadListQuerySchema, leadUpdateSchema } from "../validators/lead.validator";
import { leadAnalyticsService } from "../services/lead-analytics.service";
import { leadService } from "../services/lead.service";
import { HttpError } from "../utils/httpError";
import { validate } from "../utils/validate";

export const leadController = {
  async stats(req: Request, res: Response, next: NextFunction): Promise<void> {
    const user = req.user;
    if (!user) {
      throw new HttpError(401, "Unauthorized");
    }

    const data = await leadAnalyticsService.getStats(user);
    res.status(200).json({
      success: true,
      data,
      message: "Lead stats fetched"
    });
  },
  async analytics(req: Request, res: Response, next: NextFunction): Promise<void> {
    const user = req.user;
    if (!user) {
      throw new HttpError(401, "Unauthorized");
    }

    const data = await leadAnalyticsService.getAnalytics(user);
    res.status(200).json({
      success: true,
      data,
      message: "Lead analytics fetched"
    });
  },
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    const query = validate(leadListQuerySchema, req.query, "Invalid query parameters");
    const user = req.user;
    if (!user) {
      throw new HttpError(401, "Unauthorized");
    }

    const { items, total } = await leadService.list(query, user);
    const totalPages = Math.max(1, Math.ceil(total / query.limit));

    res.status(200).json({
      success: true,
      data: items,
      message: "Leads fetched",
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages
      }
    });
  },
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const input = validate(leadCreateSchema, req.body, "Invalid request body");
    const user = req.user;
    if (!user) {
      throw new HttpError(401, "Unauthorized");
    }

    const lead = await leadService.create(input, user);
    res.status(201).json({
      success: true,
      data: lead,
      message: "Lead created"
    });
  },
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
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
  },
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    const input = validate(leadUpdateSchema, req.body, "Invalid request body");
    const user = req.user;
    if (!user) {
      throw new HttpError(401, "Unauthorized");
    }

    const lead = await leadService.update(req.params.id, input, user);
    res.status(200).json({
      success: true,
      data: lead,
      message: "Lead updated"
    });
  },
  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
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
  },
  async exportCsv(req: Request, res: Response, next: NextFunction): Promise<void> {
    const query = validate(leadListQuerySchema, req.query, "Invalid query parameters");
    const user = req.user;
    if (!user) {
      throw new HttpError(401, "Unauthorized");
    }

    const stream = leadService.exportCsv(query, user);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=leads.csv");

    stream.pipe(res);
  }
};

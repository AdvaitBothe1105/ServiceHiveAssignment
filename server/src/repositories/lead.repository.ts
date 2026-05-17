import { LeadModel, type LeadDocument } from "../models/lead.model";
import type { LeadListQuery } from "../validators/lead.validator";

export type LeadFilters = {
  status?: LeadListQuery["status"];
  source?: LeadListQuery["source"];
  search?: string;
  assignedTo?: string;
};

export const leadRepository = {
  async findWithFilters(filters: LeadFilters, page: number, limit: number, sort: "latest" | "oldest") {
    const query: Record<string, unknown> = {};

    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.source) {
      query.source = filters.source;
    }
    if (filters.assignedTo) {
      query.assignedTo = filters.assignedTo;
    }
    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    const sortBy = sort === "latest" ? { createdAt: -1 } : { createdAt: 1 };
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      LeadModel.find(query).sort(sortBy).skip(skip).limit(limit).lean<LeadDocument[]>(),
      LeadModel.countDocuments(query)
    ]);

    return { items, total };
  }
};

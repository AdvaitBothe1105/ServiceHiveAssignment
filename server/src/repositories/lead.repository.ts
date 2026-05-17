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
  },
  async createLead(input: {
    name: string;
    email: string;
    status: LeadListQuery["status"];
    source: LeadListQuery["source"];
    assignedTo?: string;
  }): Promise<LeadDocument> {
    const doc = await LeadModel.create(input);
    return doc.toObject();
  },
  async findById(id: string): Promise<LeadDocument | null> {
    return LeadModel.findById(id).lean();
  },
  async updateById(id: string, update: Partial<LeadDocument>): Promise<LeadDocument | null> {
    return LeadModel.findByIdAndUpdate(id, update, { new: true }).lean();
  },
  async deleteById(id: string): Promise<LeadDocument | null> {
    return LeadModel.findByIdAndDelete(id).lean();
  },
  streamWithFilters(filters: LeadFilters, sort: "latest" | "oldest") {
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
    return LeadModel.find(query).sort(sortBy).cursor();
  }
};

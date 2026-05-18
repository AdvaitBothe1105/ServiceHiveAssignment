import { Types } from "mongoose";
import type { Readable } from "stream";
import type { LeadDocument } from "../models/lead.model";
import { leadRepository } from "../repositories/lead.repository";
import { HttpError } from "../utils/httpError";
import type { LeadCreateInput, LeadListQuery, LeadUpdateInput } from "../validators/lead.validator";
import { createLeadCsvTransform } from "../utils/csvStream";
import type { LeadFilters } from "../repositories/lead.repository";
import { computeLeadScore } from "../utils/leadScore";


export type LeadListItem = {
  _id: string;
  name: string;
  email: string;
  status: LeadDocument["status"];
  source: LeadDocument["source"];
  score: number;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
};

export type LeadDetail = LeadListItem;

const toAssignedObjectId = (
  value: string | Types.ObjectId | null | undefined
): Types.ObjectId | undefined => {
  if (!value) return undefined;
  return typeof value === "string" ? new Types.ObjectId(value) : value;
};

export const leadService = {
  async list(
    query: LeadListQuery,
    user: { id: string; role: "admin" | "sales" }
  ): Promise<{ items: LeadListItem[]; total: number }> {
    const filters = {
      status: query.status,
      source: query.source,
      search: query.search,
      assignedTo: user.role === "sales" ? user.id : undefined
    };

    const { items, total } = await leadRepository.findWithFilters(
      filters,
      query.page,
      query.limit,
      query.sort
    );

    const mapped = items.map((lead) => ({
      _id: lead._id.toString(),
      name: lead.name,
      email: lead.email,
      status: lead.status,
      source: lead.source,
      score: computeLeadScore(lead),
      assignedTo: lead.assignedTo?.toString(),
      createdAt: lead.createdAt.toISOString(),
      updatedAt: lead.updatedAt.toISOString()
    }));

    return { items: mapped, total };
  },
  async create(
    input: LeadCreateInput,
    user: { id: string; role: "admin" | "sales" }
  ): Promise<LeadDetail> {
    const assignedTo = user.role === "sales" ? user.id : input.assignedTo;

    const created = await leadRepository.createLead({
      name: input.name,
      email: input.email,
      status: input.status,
      source: input.source,
      assignedTo
    });

    return {
      _id: created._id.toString(),
      name: created.name,
      email: created.email,
      status: created.status,
      source: created.source,
      score: computeLeadScore(created),
      assignedTo: created.assignedTo?.toString(),
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString()
    };
  },
  async getById(
    id: string,
    user: { id: string; role: "admin" | "sales" }
  ): Promise<LeadDetail> {
    const lead = await leadRepository.findById(id);
    if (!lead) {
      throw new HttpError(404, "Lead not found");
    }

    const assignedTo = lead.assignedTo?.toString();
    if (user.role === "sales" && assignedTo !== user.id) {
      throw new HttpError(404, "Lead not found");
    }

    return {
      _id: lead._id.toString(),
      name: lead.name,
      email: lead.email,
      status: lead.status,
      source: lead.source,
      score: computeLeadScore(lead),
      assignedTo,
      createdAt: lead.createdAt.toISOString(),
      updatedAt: lead.updatedAt.toISOString()
    };
  },
  async update(
    id: string,
    input: LeadUpdateInput,
    user: { id: string; role: "admin" | "sales" }
  ): Promise<LeadDetail> {
    const existing = await leadRepository.findById(id);
    if (!existing) {
      throw new HttpError(404, "Lead not found");
    }

    const assignedTo = existing.assignedTo?.toString();
    if (user.role === "sales" && assignedTo !== user.id) {
      throw new HttpError(404, "Lead not found");
    }

    const nextAssignedTo = user.role === "sales" ? existing.assignedTo : input.assignedTo;
    const updated = await leadRepository.updateById(id, {
      name: input.name ?? existing.name,
      email: input.email ?? existing.email,
      status: input.status ?? existing.status,
      source: input.source ?? existing.source,
      assignedTo: toAssignedObjectId(nextAssignedTo ?? existing.assignedTo)
    });

    if (!updated) {
      throw new HttpError(404, "Lead not found");
    }

    return {
      _id: updated._id.toString(),
      name: updated.name,
      email: updated.email,
      status: updated.status,
      source: updated.source,
      score: computeLeadScore(updated),
      assignedTo: updated.assignedTo?.toString(),
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString()
    };
  },
  async remove(
    id: string,
    user: { id: string; role: "admin" | "sales" }
  ): Promise<LeadDetail> {
    const existing = await leadRepository.findById(id);
    if (!existing) {
      throw new HttpError(404, "Lead not found");
    }

    const assignedTo = existing.assignedTo?.toString();
    if (user.role === "sales" && assignedTo !== user.id) {
      throw new HttpError(404, "Lead not found");
    }

    const removed = await leadRepository.deleteById(id);
    if (!removed) {
      throw new HttpError(404, "Lead not found");
    }

    return {
      _id: removed._id.toString(),
      name: removed.name,
      email: removed.email,
      status: removed.status,
      source: removed.source,
      score: computeLeadScore(removed),
      assignedTo: removed.assignedTo?.toString(),
      createdAt: removed.createdAt.toISOString(),
      updatedAt: removed.updatedAt.toISOString()
    };
  },
  exportCsv(
    query: LeadListQuery,
    user: { id: string; role: "admin" | "sales" }
  ) {
    const filters: LeadFilters = {
      status: query.status,
      source: query.source,
      search: query.search,
      assignedTo: user.role === "sales" ? user.id : undefined
    };

    const cursor = leadRepository.streamWithFilters(filters, query.sort);
    const transform = createLeadCsvTransform();

    return (cursor as unknown as Readable).pipe(transform);
  }
};

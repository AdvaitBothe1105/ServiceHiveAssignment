import type { LeadDocument } from "../models/lead.model";
import { leadRepository } from "../repositories/lead.repository";
import type { LeadListQuery } from "../validators/lead.validator";

const statusWeights: Record<string, number> = {
  new: 20,
  contacted: 40,
  qualified: 80,
  lost: 5
};

const sourceWeights: Record<string, number> = {
  referral: 20,
  instagram: 10,
  website: 5
};

const computeScore = (lead: LeadDocument): number => {
  const statusScore = statusWeights[lead.status] ?? 0;
  const sourceScore = sourceWeights[lead.source] ?? 0;
  const ageMs = Date.now() - lead.createdAt.getTime();
  const days = ageMs / (1000 * 60 * 60 * 24);

  const recencyScore = days <= 7 ? 10 : days <= 30 ? 5 : 0;

  return Math.min(100, statusScore + sourceScore + recencyScore);
};

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
      score: computeScore(lead),
      assignedTo: lead.assignedTo?.toString(),
      createdAt: lead.createdAt.toISOString(),
      updatedAt: lead.updatedAt.toISOString()
    }));

    return { items: mapped, total };
  }
};

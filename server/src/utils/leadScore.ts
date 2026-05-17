import type { LeadDocument } from "../models/lead.model";

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

export const computeLeadScore = (lead: LeadDocument): number => {
  const statusScore = statusWeights[lead.status] ?? 0;
  const sourceScore = sourceWeights[lead.source] ?? 0;
  const ageMs = Date.now() - lead.createdAt.getTime();
  const days = ageMs / (1000 * 60 * 60 * 24);

  const recencyScore = days <= 7 ? 10 : days <= 30 ? 5 : 0;

  return Math.min(100, statusScore + sourceScore + recencyScore);
};

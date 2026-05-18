import { LeadModel } from "../models/lead.model";
import type { LeadFilters } from "./lead.repository";

const buildMatchStage = (filters: LeadFilters): Record<string, unknown> => {
  const match: Record<string, unknown> = {};
  if (filters.assignedTo) {
    match.assignedTo = filters.assignedTo;
  }
  return match;
};

export const leadAnalyticsRepository = {
  async countStats(filters: LeadFilters) {
    const match = buildMatchStage(filters);
    const base = Object.keys(match).length ? [{ $match: match }] : [];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [result] = await LeadModel.aggregate<{
      total: number;
      qualified: number;
      contacted: number;
      lost: number;
      newThisWeek: number;
    }>([
      ...base,
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          qualified: { $sum: { $cond: [{ $eq: ["$status", "qualified"] }, 1, 0] } },
          contacted: { $sum: { $cond: [{ $eq: ["$status", "contacted"] }, 1, 0] } },
          lost: { $sum: { $cond: [{ $eq: ["$status", "lost"] }, 1, 0] } },
          newThisWeek: { $sum: { $cond: [{ $gte: ["$createdAt", weekAgo] }, 1, 0] } }
        }
      },
      {
        $project: {
          _id: 0,
          total: 1,
          qualified: 1,
          contacted: 1,
          lost: 1,
          newThisWeek: 1
        }
      }
    ]);

    return result ?? { total: 0, qualified: 0, contacted: 0, lost: 0, newThisWeek: 0 };
  },
  async countTotals(filters: LeadFilters) {
    const match = buildMatchStage(filters);
    const base = Object.keys(match).length ? [{ $match: match }] : [];

    const [result] = await LeadModel.aggregate<{
      total: number;
      qualified: number;
      contacted: number;
      lost: number;
      newLeads: number;
      avgScore: number;
    }>([
      ...base,
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          qualified: { $sum: { $cond: [{ $eq: ["$status", "qualified"] }, 1, 0] } },
          contacted: { $sum: { $cond: [{ $eq: ["$status", "contacted"] }, 1, 0] } },
          lost: { $sum: { $cond: [{ $eq: ["$status", "lost"] }, 1, 0] } },
          newLeads: { $sum: { $cond: [{ $eq: ["$status", "new"] }, 1, 0] } }
        }
      },
      {
        $project: {
          _id: 0,
          total: 1,
          qualified: 1,
          contacted: 1,
          lost: 1,
          newLeads: 1,
          avgScore: { $literal: 0 }
        }
      }
    ]);

    return result ?? { total: 0, qualified: 0, contacted: 0, lost: 0, newLeads: 0, avgScore: 0 };
  },

  async monthlyTrends(filters: LeadFilters, months = 6) {
    const match = buildMatchStage(filters);
    const start = new Date();
    start.setMonth(start.getMonth() - (months - 1));
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    const pipeline: Record<string, unknown>[] = [
      { $match: { ...match, createdAt: { $gte: start } } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          created: { $sum: 1 },
          qualified: { $sum: { $cond: [{ $eq: ["$status", "qualified"] }, 1, 0] } }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ];

    return LeadModel.aggregate<{ _id: { year: number; month: number }; created: number; qualified: number }>(
      pipeline
    );
  },

  async sourceBreakdown(filters: LeadFilters) {
    const match = buildMatchStage(filters);
    const base = Object.keys(match).length ? [{ $match: match }] : [];

    return LeadModel.aggregate<{ _id: string; count: number }>([
      ...base,
      { $group: { _id: "$source", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
  },

  async statusBreakdown(filters: LeadFilters) {
    const match = buildMatchStage(filters);
    const base = Object.keys(match).length ? [{ $match: match }] : [];

    return LeadModel.aggregate<{ _id: string; count: number }>([
      ...base,
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
  },

  async recentLeads(filters: LeadFilters, limit = 5) {
    const match = buildMatchStage(filters);
    const query = Object.keys(match).length ? match : {};
    return LeadModel.find(query).sort({ createdAt: -1 }).limit(limit).lean();
  }
};

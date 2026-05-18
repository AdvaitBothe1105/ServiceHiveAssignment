import type { LeadDocument } from "../models/lead.model";
import { leadAnalyticsRepository } from "../repositories/lead-analytics.repository";
import type { LeadFilters } from "../repositories/lead.repository";
import { computeLeadScore } from "../utils/leadScore";
import type { LeadListItem } from "./lead.service";

export type LeadAnalyticsPayload = {
  totals: {
    total: number;
    qualified: number;
    contacted: number;
    lost: number;
    newLeads: number;
    avgScore: number;
  };
  monthlyTrends: Array<{ month: string; created: number; qualified: number }>;
  sourceBreakdown: Array<{ source: string; count: number }>;
  statusBreakdown: Array<{ status: string; count: number }>;
  recentActivity: LeadListItem[];
};

export type LeadStatsPayload = {
  total: number;
  qualified: number;
  contacted: number;
  lost: number;
  newThisWeek: number;
};

const toListItem = (lead: LeadDocument): LeadListItem => ({
  _id: lead._id.toString(),
  name: lead.name,
  email: lead.email,
  status: lead.status,
  source: lead.source,
  score: computeLeadScore(lead),
  assignedTo: lead.assignedTo?.toString(),
  createdAt: lead.createdAt.toISOString(),
  updatedAt: lead.updatedAt.toISOString()
});

const buildMonthSlots = (months: number) => {
  const slots: Array<{ month: string; created: number; qualified: number; order: number }> = [];
  const now = new Date();
  for (let index = months - 1; index >= 0; index -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    slots.push({
      month: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      created: 0,
      qualified: 0,
      order: date.getTime()
    });
  }
  return slots;
};

export const leadAnalyticsService = {
  async getStats(user: { id: string; role: "admin" | "sales" }): Promise<LeadStatsPayload> {
    const filters: LeadFilters = {
      assignedTo: user.role === "sales" ? user.id : undefined
    };

    return leadAnalyticsRepository.countStats(filters);
  },
  async getAnalytics(
    user: { id: string; role: "admin" | "sales" }
  ): Promise<LeadAnalyticsPayload> {
    const filters: LeadFilters = {
      assignedTo: user.role === "sales" ? user.id : undefined
    };

    const [rawTotals, monthlyRaw, sourceRaw, statusRaw, recentRaw, scoreLeads] = await Promise.all([
      leadAnalyticsRepository.countTotals(filters),
      leadAnalyticsRepository.monthlyTrends(filters, 6),
      leadAnalyticsRepository.sourceBreakdown(filters),
      leadAnalyticsRepository.statusBreakdown(filters),
      leadAnalyticsRepository.recentLeads(filters, 5),
      leadAnalyticsRepository.recentLeads(filters, 200)
    ]);

    const avgScore =
      scoreLeads.length > 0
        ? Math.round(
            scoreLeads.reduce((sum, lead) => sum + computeLeadScore(lead), 0) / scoreLeads.length
          )
        : 0;

    const monthSlots = buildMonthSlots(6);
    const monthIndex = new Map(monthSlots.map((slot) => [slot.month, slot]));

    monthlyRaw.forEach((row) => {
      const date = new Date(row._id.year, row._id.month - 1, 1);
      const key = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      const slot = monthIndex.get(key);
      if (slot) {
        slot.created = row.created;
        slot.qualified = row.qualified;
      }
    });

    return {
      totals: {
        total: rawTotals.total,
        qualified: rawTotals.qualified,
        contacted: rawTotals.contacted,
        lost: rawTotals.lost,
        newLeads: rawTotals.newLeads,
        avgScore
      },
      monthlyTrends: monthSlots.map(({ month, created, qualified }) => ({ month, created, qualified })),
      sourceBreakdown: sourceRaw.map((row) => ({ source: row._id, count: row.count })),
      statusBreakdown: statusRaw.map((row) => ({ status: row._id, count: row.count })),
      recentActivity: recentRaw.map((lead) => toListItem(lead))
    };
  }
};

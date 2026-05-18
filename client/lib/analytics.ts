import { apiFetch } from "./api";
import type { Lead } from "./types";

export type LeadAnalytics = {
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
  recentActivity: Lead[];
};

export const fetchLeadAnalytics = async () => apiFetch<LeadAnalytics>("/leads/analytics");

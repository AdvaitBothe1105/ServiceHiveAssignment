import type { LeadSource, LeadStatus } from "@shared/validators";
import { apiFetch, type ApiResponse } from "./api";
import type { Lead, LeadFilters, LeadStats } from "./types";

const buildQuery = (filters: Partial<LeadFilters> & { page?: number; limit?: number }): string => {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.status && filters.status !== "all") params.set("status", filters.status);
  if (filters.source && filters.source !== "all") params.set("source", filters.source);
  if (filters.search?.trim()) params.set("search", filters.search.trim());
  const qs = params.toString();
  return qs ? `?${qs}` : "";
};

export const fetchLeads = async (
  filters: LeadFilters
): Promise<ApiResponse<Lead[]>> => {
  return apiFetch<Lead[]>(`/leads${buildQuery(filters)}`);
};

export const fetchLeadById = async (id: string): Promise<ApiResponse<Lead>> => {
  return apiFetch<Lead>(`/leads/${id}`);
};

export const createLead = async (body: {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  assignedTo?: string;
}): Promise<ApiResponse<Lead>> => {
  return apiFetch<Lead>("/leads", { method: "POST", body: JSON.stringify(body) });
};

export const updateLead = async (
  id: string,
  body: Partial<{
    name: string;
    email: string;
    status: LeadStatus;
    source: LeadSource;
    assignedTo: string;
  }>
): Promise<ApiResponse<Lead>> => {
  return apiFetch<Lead>(`/leads/${id}`, { method: "PUT", body: JSON.stringify(body) });
};

export const deleteLead = async (id: string): Promise<ApiResponse<Lead>> => {
  return apiFetch<Lead>(`/leads/${id}`, { method: "DELETE" });
};

const countByStatus = async (status?: LeadStatus): Promise<number> => {
  const qs = status ? `?status=${status}&page=1&limit=1` : "?page=1&limit=1";
  const res = await apiFetch<Lead[]>(`/leads${qs}`);
  return res.meta?.total ?? 0;
};

export const fetchLeadStats = async (): Promise<LeadStats> => {
  const [total, qualified, contacted, lost, recentRes] = await Promise.all([
    countByStatus(),
    countByStatus("qualified"),
    countByStatus("contacted"),
    countByStatus("lost"),
    apiFetch<Lead[]>("/leads?page=1&limit=50&sort=latest")
  ]);

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const newThisWeek =
    recentRes.data?.filter((l) => new Date(l.createdAt).getTime() >= weekAgo).length ?? 0;

  return { total, newThisWeek, qualified, contacted, lost };
};

export const exportLeadsCsv = async (filters: LeadFilters): Promise<void> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) throw new Error("NEXT_PUBLIC_API_URL is not set");

  const response = await fetch(`${baseUrl}/leads/export${buildQuery(filters)}`, {
    credentials: "include"
  });

  if (!response.ok) {
    const data = (await response.json()) as ApiResponse<null>;
    throw new Error(data.message || "Export failed");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "leads.csv";
  anchor.click();
  URL.revokeObjectURL(url);
};

import type { LeadSource, LeadStatus } from "@shared/validators";

export type PublicUser = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "sales";
  createdAt: string;
};

export type Lead = {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  score: number;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
};

export type LeadStats = {
  total: number;
  newThisWeek: number;
  qualified: number;
  contacted: number;
  lost: number;
};

export type LeadFilters = {
  search: string;
  status: LeadStatus | "all";
  source: LeadSource | "all";
  sort: "latest" | "oldest";
  page: number;
  limit: number;
};

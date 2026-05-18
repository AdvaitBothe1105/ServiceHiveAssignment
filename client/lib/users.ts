import { apiFetch } from "./api";
import type { PublicUser } from "./types";

export const fetchUsers = async (page = 1, limit = 10) =>
  apiFetch<PublicUser[]>(`/users?page=${page}&limit=${limit}`);

export const updateUserRole = async (id: string, role: "admin" | "sales") =>
  apiFetch<PublicUser>(`/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role })
  });

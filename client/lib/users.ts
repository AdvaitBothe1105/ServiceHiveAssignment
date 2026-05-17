import { apiFetch } from "./api";
import type { PublicUser } from "./types";

export const fetchUsers = async () => apiFetch<PublicUser[]>("/users");

export const updateUserRole = async (id: string, role: "admin" | "sales") =>
  apiFetch<PublicUser>(`/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role })
  });

import { z } from "zod";

export const userListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10)
});

export const patchRoleSchema = z.object({
  role: z.enum(["admin", "sales"])
});

export type UserListQuery = z.infer<typeof userListQuerySchema>;
export type PatchRoleInput = z.infer<typeof patchRoleSchema>;

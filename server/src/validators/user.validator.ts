import { z } from "zod";

export const patchRoleSchema = z.object({
  role: z.enum(["admin", "sales"])
});

export type PatchRoleInput = z.infer<typeof patchRoleSchema>;

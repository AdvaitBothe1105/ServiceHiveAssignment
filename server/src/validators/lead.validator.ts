import { z } from "zod";
import { leadSourceEnum, leadStatusEnum } from "@shared/validators";

const sortEnum = z.enum(["latest", "oldest"]);

export const leadListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  status: leadStatusEnum.optional(),
  source: leadSourceEnum.optional(),
  search: z.string().min(1).optional(),
  sort: sortEnum.default("latest")
});

export const leadCreateSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  status: leadStatusEnum,
  source: leadSourceEnum,
  assignedTo: z.string().min(1).optional()
});

export const leadUpdateSchema = leadCreateSchema.partial();

export type LeadListQuery = z.infer<typeof leadListQuerySchema>;
export type LeadCreateInput = z.infer<typeof leadCreateSchema>;
export type LeadUpdateInput = z.infer<typeof leadUpdateSchema>;

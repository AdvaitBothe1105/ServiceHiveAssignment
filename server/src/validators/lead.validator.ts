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

export type LeadListQuery = z.infer<typeof leadListQuerySchema>;

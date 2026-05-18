import { z } from "zod";

export const leadStatusEnum = z.enum(["new", "contacted", "qualified", "lost"]);
export const leadSourceEnum = z.enum(["website", "instagram", "referral"]);

export const leadBaseSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  status: leadStatusEnum,
  source: leadSourceEnum,
  assignedTo: z.string().min(1).optional()
});

export type LeadStatus = z.infer<typeof leadStatusEnum>;
export type LeadSource = z.infer<typeof leadSourceEnum>;
export type LeadBase = z.infer<typeof leadBaseSchema>;

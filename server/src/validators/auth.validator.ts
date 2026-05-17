import { z } from "zod";
import { authSchema } from "@shared/validators";

export const registerSchema = authSchema.extend({
  name: z.string().min(1)
});

export const loginSchema = authSchema;

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

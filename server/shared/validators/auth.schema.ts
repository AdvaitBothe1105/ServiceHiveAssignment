import { z } from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const authSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(passwordRegex, "Password must include upper, lower, and number")
});

export type AuthPayload = z.infer<typeof authSchema>;

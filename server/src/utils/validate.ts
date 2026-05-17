import type { z } from "zod";
import { HttpError } from "./httpError";

export const validate = <T>(schema: z.ZodType<T>, data: unknown, message: string): T => {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new HttpError(400, message);
  }
  return parsed.data;
};

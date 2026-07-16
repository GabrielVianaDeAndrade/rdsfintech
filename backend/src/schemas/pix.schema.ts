import { z } from "zod";

export const sendPixSchema = z.object({
  pixKey: z.string().trim().min(5).max(140),
  amount: z.coerce.number().positive().max(100_000),
});

export const createPixChargeSchema = z.object({
  amount: z.coerce.number().positive().max(100_000),
});

export type SendPixInput = z.infer<typeof sendPixSchema>;

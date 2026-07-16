import { z } from "zod";

export const loginSchema = z.object({
  cpf: z.string().trim().regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, "CPF inválido"),
  password: z.string().min(8).max(72),
});

import { z } from "zod";

export const kycRegisterSchema = z.object({
  fullName: z.string().trim().min(5).max(120),
  cpf: z
    .string()
    .trim()
    .regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, "CPF inválido"),
  phone: z
    .string()
    .trim()
    .regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, "Telefone inválido"),
  address: z.string().trim().min(10).max(200),
  occupation: z.string().trim().min(2).max(80),
  monthlyIncome: z.coerce.number().positive().max(10_000_000),
});

export type KycRegisterInput = z.infer<typeof kycRegisterSchema>;

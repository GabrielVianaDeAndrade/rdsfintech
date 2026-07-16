import { z } from "zod";

export const loanSimulationSchema = z.object({
  requestedAmount: z.coerce.number().positive().max(15_000),
  installments: z.coerce.number().int().refine((n) => [6, 12, 18, 24, 36, 48].includes(n), {
    message: "Número de parcelas inválido",
  }),
});

export type LoanSimulationInput = z.infer<typeof loanSimulationSchema>;

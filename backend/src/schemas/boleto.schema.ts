import { z } from "zod";

export const payBoletoSchema = z.object({
  barcodeNumber: z.string().trim().min(40).max(60),
});

export const issueBoletoSchema = z.object({
  payerName: z.string().trim().min(5).max(120),
  payerDocument: z.string().trim().min(11).max(18),
  amount: z.coerce.number().positive().max(1_000_000),
  dueDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida (use AAAA-MM-DD)"),
});

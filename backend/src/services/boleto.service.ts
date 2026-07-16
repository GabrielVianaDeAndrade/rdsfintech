import { getBaasProvider } from "@/services/baas/baas.factory";
import type { z } from "zod";
import type { issueBoletoSchema, payBoletoSchema } from "@/schemas/boleto.schema";

export async function issueBoleto(
  baasAccountId: string,
  input: z.infer<typeof issueBoletoSchema>
) {
  const baas = getBaasProvider();
  return baas.issueBoleto({ baasAccountId, ...input });
}

export async function payBoleto(
  baasAccountId: string,
  input: z.infer<typeof payBoletoSchema>
) {
  const baas = getBaasProvider();
  return baas.payBoleto({ baasAccountId, barcodeNumber: input.barcodeNumber });
}

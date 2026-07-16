import { randomUUID } from "node:crypto";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, TABLE_NAME } from "@/models/dynamo.client";
import type { LoanItem } from "@/models/loan.model";
import { getBaasProvider } from "@/services/baas/baas.factory";
import type { LoanSimulationInput } from "@/schemas/loan.schema";

/**
 * A proposta final (valor aprovado, taxa, CET) vem sempre do provedor BaaS —
 * o backend nunca calcula ou sobrescreve esses números, apenas repassa e
 * persiste a resposta oficial para auditabilidade.
 */
export async function simulateLoan(userId: string, baasAccountId: string, input: LoanSimulationInput) {
  const baas = getBaasProvider();
  const proposal = await baas.simulateLoan({
    baasAccountId,
    requestedAmount: input.requestedAmount,
    installments: input.installments,
  });

  const now = new Date().toISOString();
  const loanId = randomUUID();

  const loan: LoanItem = {
    PK: `USER#${userId}`,
    SK: `LOAN#${loanId}`,
    loanId,
    requestedAmount: input.requestedAmount,
    approvedAmount: proposal.approvedAmount,
    monthlyInterestRate: proposal.monthlyInterestRate,
    installments: input.installments,
    installmentValue: proposal.installmentValue,
    cet: proposal.cet,
    status: proposal.status === "approved" ? "approved" : "pending_approval",
    baasLoanId: proposal.baasLoanId,
    createdAt: now,
    updatedAt: now,
  };

  await ddb.send(new PutCommand({ TableName: TABLE_NAME, Item: loan }));
  return loan;
}

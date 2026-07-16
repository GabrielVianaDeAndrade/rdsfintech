import type { LoanSimulationInput, LoanSimulationResult } from "./types";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/**
 * Simulação client-side apenas para preview de UI.
 * O cálculo oficial (e a aprovação real) acontece no backend,
 * a partir da resposta do provedor BaaS — ver backend/src/services/loan.service.ts
 */
export function simulateLoan({
  requestedAmount,
  installments,
}: LoanSimulationInput): LoanSimulationResult {
  const monthlyInterestRate = 2.49; // taxa indicativa a.m.
  const i = monthlyInterestRate / 100;

  const installmentValue =
    (requestedAmount * i * Math.pow(1 + i, installments)) /
    (Math.pow(1 + i, installments) - 1);

  const totalCost = installmentValue * installments;
  const annualCet = (Math.pow(1 + i, 12) - 1) * 100 + 2.1; // aproximação incluindo tarifas

  return {
    requestedAmount,
    approvedAmount: requestedAmount,
    monthlyInterestRate,
    installments,
    installmentValue,
    totalCost,
    cet: annualCet,
  };
}

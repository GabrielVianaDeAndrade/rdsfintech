import type { LoanQuote } from "./types";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateBR(dateStr: string): string {
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

export function maskCpf(cpf: string): string {
  const d = cpf.replace(/\D/g, "");
  if (d.length !== 11) return cpf;
  return `${d.slice(0, 3)}.***.***-${d.slice(9)}`;
}

/** Máscara de CPF para inputs: 000.000.000-00 */
export function applyCpfMask(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

/** Máscara de telefone: (00) 00000-0000 */
export function applyPhoneMask(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 10) {
    return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d{1,4})$/, "$1-$2");
  }
  return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

/** Máscara de moeda a partir de dígitos: 123456 -> 1.234,56 */
export function applyCurrencyMask(value: string): string {
  const d = value.replace(/\D/g, "");
  if (!d) return "";
  const num = Number(d) / 100;
  return num.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function parseCurrency(masked: string): number {
  const d = masked.replace(/\D/g, "");
  return d ? Number(d) / 100 : 0;
}

/**
 * Cálculo de empréstimo (Tabela Price) para preview de UX.
 * A proposta vinculante virá do provedor BaaS via POST /api/loan/simulate.
 * A taxa varia levemente com o prazo, como em crédito real: prazos mais
 * longos embutem mais risco.
 */
export function quoteLoan(amount: number, installments: number): LoanQuote {
  const monthlyRate = 1.89 + Math.min(installments, 60) * 0.018;
  const i = monthlyRate / 100;

  const installmentValue =
    installments > 0
      ? (amount * i * Math.pow(1 + i, installments)) / (Math.pow(1 + i, installments) - 1)
      : 0;

  const totalCost = installmentValue * installments;
  // CET anualizado: juros + tarifas/IOF aproximados
  const cet = (Math.pow(1 + i, 12) - 1) * 100 + 2.1;

  return { amount, installments, monthlyRate, installmentValue, totalCost, cet };
}

export function randomId(): string {
  return Math.random().toString(36).slice(2, 10);
}

/** Linha digitável fictícia — substituir pelo boleto real do BaaS. */
export function generateBarcode(): string {
  const block = (n: number) =>
    Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join("");
  return `${block(5)}.${block(5)} ${block(5)}.${block(6)} ${block(5)}.${block(6)} ${block(1)} ${block(14)}`;
}

export type TransactionType =
  | "pix_in"
  | "pix_out"
  | "boleto_paid"
  | "boleto_received"
  | "card_purchase"
  | "loan_credit"
  | "deposit";

export interface Transaction {
  id: string;
  type: TransactionType;
  label: string;
  amount: number; // positivo = entrada, negativo = saída
  createdAt: string; // ISO
  status: "completed" | "pending" | "failed";
}

export type PixKeyType = "cpf" | "email" | "phone" | "random";

export interface PixKey {
  id: string;
  type: PixKeyType;
  value: string;
  createdAt: string;
}

export interface Boleto {
  id: string;
  direction: "issued" | "paid"; // emitido por mim | pago por mim
  description: string;
  amount: number;
  dueDate: string; // AAAA-MM-DD
  barcode: string;
  status: "open" | "paid" | "overdue";
  payerName?: string;
  createdAt: string;
}

export interface Card {
  id: string;
  kind: "physical" | "virtual";
  label: string;
  last4: string;
  holder: string;
  expiry: string; // MM/AA
  cvv: string;
  brand: "Mastercard" | "Visa";
  blocked: boolean;
  limit: number;
  used: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  kind: "transaction" | "security" | "info";
}

export interface Loan {
  id: string;
  amount: number;
  installments: number;
  monthlyRate: number;
  installmentValue: number;
  totalCost: number;
  cet: number;
  status: "active" | "settled";
  contractedAt: string;
  paidInstallments: number;
}

export interface Profile {
  fullName: string;
  cpf: string;
  phone: string;
  email: string;
  address: string;
  occupation: string;
  monthlyIncome: number;
  agency: string;
  accountNumber: string;
  memberSince: string;
}

export interface LoanQuote {
  amount: number;
  installments: number;
  monthlyRate: number;
  installmentValue: number;
  totalCost: number;
  cet: number;
}

export interface CreateBaasAccountInput {
  fullName: string;
  cpf: string;
  phone: string;
  address: string;
  occupation: string;
  monthlyIncome: number;
}

export interface CreateBaasAccountResult {
  baasAccountId: string;
  status: "active" | "under_review";
}

export interface CreatePixChargeInput {
  baasAccountId: string;
  amount: number;
}

export interface CreatePixChargeResult {
  pixCopiaECola: string;
  qrCodeBase64: string;
  txId: string;
}

export interface SendPixInput {
  baasAccountId: string;
  pixKey: string;
  amount: number;
}

export interface SendPixResult {
  baasTransactionId: string;
  status: "pending" | "completed" | "failed";
}

export interface IssueBoletoInput {
  baasAccountId: string;
  payerName: string;
  payerDocument: string;
  amount: number;
  dueDate: string;
}

export interface IssueBoletoResult {
  boletoId: string;
  barcodeNumber: string;
  pdfUrl: string;
}

export interface PayBoletoInput {
  baasAccountId: string;
  barcodeNumber: string;
}

export interface PayBoletoResult {
  baasTransactionId: string;
  amount: number;
  status: "pending" | "completed" | "failed";
}

export interface LoanProposalInput {
  baasAccountId: string;
  requestedAmount: number;
  installments: number;
}

export interface LoanProposalResult {
  baasLoanId: string;
  approvedAmount: number;
  monthlyInterestRate: number;
  installmentValue: number;
  cet: number;
  status: "approved" | "pending_analysis" | "rejected";
}

/**
 * Contrato que qualquer provedor de Banking as a Service deve implementar.
 * O restante da aplicação (controllers/services) depende apenas desta
 * interface, nunca do SDK/HTTP client do provedor diretamente — troca de
 * fornecedor de BaaS não deve exigir mudanças fora deste diretório.
 */
export interface BaasProvider {
  createAccount(input: CreateBaasAccountInput): Promise<CreateBaasAccountResult>;
  createPixCharge(input: CreatePixChargeInput): Promise<CreatePixChargeResult>;
  sendPix(input: SendPixInput): Promise<SendPixResult>;
  issueBoleto(input: IssueBoletoInput): Promise<IssueBoletoResult>;
  payBoleto(input: PayBoletoInput): Promise<PayBoletoResult>;
  simulateLoan(input: LoanProposalInput): Promise<LoanProposalResult>;
}

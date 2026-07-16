import { randomUUID } from "node:crypto";
import type {
  BaasProvider,
  CreateBaasAccountInput,
  CreateBaasAccountResult,
  CreatePixChargeInput,
  CreatePixChargeResult,
  SendPixInput,
  SendPixResult,
  IssueBoletoInput,
  IssueBoletoResult,
  PayBoletoInput,
  PayBoletoResult,
  LoanProposalInput,
  LoanProposalResult,
} from "./baas.types";

/**
 * Implementação em memória do BaasProvider, usada em desenvolvimento/testes
 * enquanto a integração com o provedor real não está contratada. Troca-se
 * por HttpBaasProvider apenas na factory (baas.factory.ts) — nenhum outro
 * arquivo precisa mudar.
 */
export class MockBaasProvider implements BaasProvider {
  async createAccount(input: CreateBaasAccountInput): Promise<CreateBaasAccountResult> {
    return { baasAccountId: `mock_acc_${randomUUID()}`, status: "active" };
  }

  async createPixCharge(input: CreatePixChargeInput): Promise<CreatePixChargeResult> {
    return {
      pixCopiaECola: `00020126580014BR.GOV.BCB.PIX0136${randomUUID()}5204000053039865802BR`,
      qrCodeBase64: "",
      txId: `mock_tx_${randomUUID()}`,
    };
  }

  async sendPix(input: SendPixInput): Promise<SendPixResult> {
    return { baasTransactionId: `mock_pix_${randomUUID()}`, status: "completed" };
  }

  async issueBoleto(input: IssueBoletoInput): Promise<IssueBoletoResult> {
    return {
      boletoId: `mock_bol_${randomUUID()}`,
      barcodeNumber: "00190.00009 03949.318017 00040.000006 1 96500000010000",
      pdfUrl: "https://sandbox.provedor-baas.com.br/boletos/mock.pdf",
    };
  }

  async payBoleto(input: PayBoletoInput): Promise<PayBoletoResult> {
    return { baasTransactionId: `mock_pay_${randomUUID()}`, amount: 0, status: "completed" };
  }

  async simulateLoan(input: LoanProposalInput): Promise<LoanProposalResult> {
    const monthlyInterestRate = 2.49;
    const i = monthlyInterestRate / 100;
    const installmentValue =
      (input.requestedAmount * i * Math.pow(1 + i, input.installments)) /
      (Math.pow(1 + i, input.installments) - 1);

    return {
      baasLoanId: `mock_loan_${randomUUID()}`,
      approvedAmount: Math.min(input.requestedAmount, 15000),
      monthlyInterestRate,
      installmentValue,
      cet: (Math.pow(1 + i, 12) - 1) * 100 + 2.1,
      status: "approved",
    };
  }
}

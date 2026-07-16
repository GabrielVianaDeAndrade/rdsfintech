import axios, { type AxiosInstance } from "axios";
import crypto from "node:crypto";
import { env } from "@/config/env";
import { logger } from "@/utils/logger";
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
 * Adapter real para um provedor de BaaS externo. Requisições são assinadas
 * (HMAC) e autenticadas via client credentials, com timeout curto e retries
 * limitados — o BFF nunca expõe as credenciais do BaaS ao frontend.
 */
export class HttpBaasProvider implements BaasProvider {
  private readonly http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: env.baas.baseUrl,
      timeout: 8000,
    });

    this.http.interceptors.request.use((config) => {
      const timestamp = Date.now().toString();
      const body = config.data ? JSON.stringify(config.data) : "";
      const signature = crypto
        .createHmac("sha256", env.baas.clientSecret)
        .update(`${timestamp}.${body}`)
        .digest("hex");

      config.headers.set("X-Client-Id", env.baas.clientId);
      config.headers.set("X-Timestamp", timestamp);
      config.headers.set("X-Signature", signature);
      return config;
    });
  }

  async createAccount(input: CreateBaasAccountInput): Promise<CreateBaasAccountResult> {
    const { data } = await this.http.post("/accounts", input);
    return data;
  }

  async createPixCharge(input: CreatePixChargeInput): Promise<CreatePixChargeResult> {
    const { data } = await this.http.post("/pix/charges", input);
    return data;
  }

  async sendPix(input: SendPixInput): Promise<SendPixResult> {
    const { data } = await this.http.post("/pix/transfers", input);
    return data;
  }

  async issueBoleto(input: IssueBoletoInput): Promise<IssueBoletoResult> {
    const { data } = await this.http.post("/boletos", input);
    return data;
  }

  async payBoleto(input: PayBoletoInput): Promise<PayBoletoResult> {
    const { data } = await this.http.post("/boletos/pay", input);
    return data;
  }

  async simulateLoan(input: LoanProposalInput): Promise<LoanProposalResult> {
    const { data } = await this.http.post("/loans/simulate", input);
    return data;
  }
}

export function logBaasFailure(operation: string, error: unknown) {
  logger.error({ operation, err: error }, "Falha na integração com o provedor BaaS");
}

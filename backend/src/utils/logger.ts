import pino from "pino";
import { isProduction } from "@/config/env";

/**
 * Logger estruturado com ofuscação de campos sensíveis. Nunca logar CPF,
 * senha, tokens ou dados de conta em texto claro — mesmo em ambientes de
 * desenvolvimento, para evitar hábito de vazamento em produção.
 */
export const logger = pino({
  level: isProduction ? "info" : "debug",
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "*.cpf",
      "*.password",
      "*.token",
      "*.accessToken",
      "*.refreshToken",
      "*.cardNumber",
      "*.cvv",
      "*.monthlyIncome",
      "body.cpf",
      "body.password",
    ],
    censor: "[REDACTED]",
  },
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export function maskCpf(cpf: string): string {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return "***";
  return `${digits.slice(0, 3)}.***.***-${digits.slice(9)}`;
}

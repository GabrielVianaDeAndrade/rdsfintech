import type { NextFunction, Request, Response } from "express";
import { logger } from "@/utils/logger";

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/**
 * Handler central de erros. Nunca retorna stack traces ou mensagens internas
 * do provedor BaaS ao cliente — apenas mensagens genéricas — para evitar
 * vazamento de detalhes de implementação (fingerprinting).
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  const status = err instanceof HttpError ? err.status : 500;
  const message = err instanceof HttpError ? err.message : "Erro interno. Tente novamente.";

  logger.error({ err, path: req.path, method: req.method }, "Erro não tratado na requisição");

  res.status(status).json({ error: message });
}

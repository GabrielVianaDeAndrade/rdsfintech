import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";

/**
 * Validação estrita de payload com Zod antes de qualquer lógica de negócio —
 * primeira barreira contra XSS/injeção e dados malformados. Requisições que
 * não passam no schema são rejeitadas com 400 sem tocar em services/BaaS.
 */
export function validateBody(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: "Dados inválidos.",
        details: result.error.flatten().fieldErrors,
      });
    }
    req.body = result.data;
    return next();
  };
}

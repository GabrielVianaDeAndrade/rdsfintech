import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken, type AccessTokenPayload } from "@/utils/jwt";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}

/**
 * Exige um access token JWT válido (curta duração) no header Authorization.
 * Nunca aceita token via query string, para não vazar em logs de acesso.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Não autenticado." });
  }

  try {
    const token = header.slice("Bearer ".length);
    req.user = verifyAccessToken(token);
    return next();
  } catch {
    return res.status(401).json({ error: "Sessão inválida ou expirada." });
  }
}

export function requireScope(scope: AccessTokenPayload["scope"]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.scope !== scope) {
      return res.status(403).json({ error: "Acesso negado." });
    }
    return next();
  };
}

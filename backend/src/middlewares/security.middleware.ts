import helmet from "helmet";
import cors from "cors";
import { doubleCsrf } from "csrf-csrf";
import type { Express } from "express";
import { env, isProduction } from "@/config/env";

/**
 * Camada de segurança de perímetro: cabeçalhos HTTP endurecidos (Helmet),
 * CORS restrito a uma allowlist e proteção CSRF via double-submit cookie
 * para as rotas que usam cookies httpOnly (refresh token).
 */
export function applySecurityMiddlewares(app: Express) {
  app.set("trust proxy", 1); // necessário atrás do ALB/EC2 para IP real no rate limiter

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          objectSrc: ["'none'"],
          frameAncestors: ["'none'"],
        },
      },
      hsts: { maxAge: 63072000, includeSubDomains: true, preload: true },
      referrerPolicy: { policy: "no-referrer" },
      crossOriginResourcePolicy: { policy: "same-site" },
    })
  );

  app.use(
    cors({
      origin: env.corsOrigin,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
      maxAge: 600,
    })
  );
}

export const { doubleCsrfProtection, generateToken: generateCsrfToken } = doubleCsrf({
  getSecret: () => env.csrfSecret,
  cookieName: isProduction ? "__Host-rds.csrf" : "rds.csrf",
  cookieOptions: {
    sameSite: "strict",
    secure: isProduction,
    httpOnly: true,
  },
  getSessionIdentifier: (req) => req.cookies?.["rds.session"] ?? "anonymous",
});

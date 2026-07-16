import express from "express";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import { applySecurityMiddlewares } from "@/middlewares/security.middleware";
import { generalLimiter } from "@/middlewares/rateLimiter.middleware";
import { errorHandler } from "@/middlewares/errorHandler.middleware";
import { logger } from "@/utils/logger";
import { apiRouter } from "@/routes";

export function createApp() {
  const app = express();

  applySecurityMiddlewares(app);

  app.use(express.json({ limit: "50kb" })); // limite de payload — mitiga abuso em rotas transacionais
  app.use(cookieParser());
  app.use(pinoHttp({ logger }));
  app.use(generalLimiter);

  app.use("/api", apiRouter);

  app.use((_req, res) => res.status(404).json({ error: "Recurso não encontrado." }));
  app.use(errorHandler);

  return app;
}

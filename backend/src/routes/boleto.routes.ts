import { Router } from "express";
import { issueBoletoHandler, payBoletoHandler } from "@/controllers/boleto.controller";
import { requireAuth } from "@/middlewares/auth.middleware";
import { validateBody } from "@/middlewares/validate.middleware";
import { transactionalLimiter } from "@/middlewares/rateLimiter.middleware";
import { issueBoletoSchema, payBoletoSchema } from "@/schemas/boleto.schema";

export const boletoRouter = Router();

boletoRouter.use(requireAuth);
boletoRouter.post(
  "/issue",
  transactionalLimiter,
  validateBody(issueBoletoSchema),
  issueBoletoHandler
);
boletoRouter.post("/pay", transactionalLimiter, validateBody(payBoletoSchema), payBoletoHandler);

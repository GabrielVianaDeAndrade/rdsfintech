import { Router } from "express";
import { simulateLoanHandler } from "@/controllers/loan.controller";
import { requireAuth } from "@/middlewares/auth.middleware";
import { validateBody } from "@/middlewares/validate.middleware";
import { transactionalLimiter } from "@/middlewares/rateLimiter.middleware";
import { loanSimulationSchema } from "@/schemas/loan.schema";

export const loanRouter = Router();

loanRouter.use(requireAuth);
loanRouter.post(
  "/simulate",
  transactionalLimiter,
  validateBody(loanSimulationSchema),
  simulateLoanHandler
);

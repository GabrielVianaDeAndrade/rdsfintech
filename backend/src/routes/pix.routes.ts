import { Router } from "express";
import { sendPixHandler, createPixChargeHandler } from "@/controllers/pix.controller";
import { requireAuth } from "@/middlewares/auth.middleware";
import { validateBody } from "@/middlewares/validate.middleware";
import { transactionalLimiter } from "@/middlewares/rateLimiter.middleware";
import { sendPixSchema, createPixChargeSchema } from "@/schemas/pix.schema";

export const pixRouter = Router();

pixRouter.use(requireAuth);
pixRouter.post("/send", transactionalLimiter, validateBody(sendPixSchema), sendPixHandler);
pixRouter.post(
  "/charges",
  transactionalLimiter,
  validateBody(createPixChargeSchema),
  createPixChargeHandler
);

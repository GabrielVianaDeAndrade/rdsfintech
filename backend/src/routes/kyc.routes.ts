import { Router } from "express";
import { registerKycHandler } from "@/controllers/kyc.controller";
import { validateBody } from "@/middlewares/validate.middleware";
import { kycLimiter } from "@/middlewares/rateLimiter.middleware";
import { kycRegisterSchema } from "@/schemas/kyc.schema";

export const kycRouter = Router();

kycRouter.post("/register", kycLimiter, validateBody(kycRegisterSchema), registerKycHandler);

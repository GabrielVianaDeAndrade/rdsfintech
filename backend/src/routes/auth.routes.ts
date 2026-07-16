import { Router } from "express";
import { loginHandler, logoutHandler } from "@/controllers/auth.controller";
import { validateBody } from "@/middlewares/validate.middleware";
import { authLimiter } from "@/middlewares/rateLimiter.middleware";
import { loginSchema } from "@/schemas/auth.schema";

export const authRouter = Router();

authRouter.post("/login", authLimiter, validateBody(loginSchema), loginHandler);
authRouter.post("/logout", logoutHandler);

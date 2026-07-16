import type { Request, Response, NextFunction } from "express";
import { login } from "@/services/auth.service";
import { isProduction } from "@/config/env";

export async function loginHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { cpf, password } = req.body;
    const { accessToken, refreshToken } = await login(cpf, password);

    // Refresh token em cookie httpOnly + Secure + SameSite=Strict — nunca acessível via JS.
    res.cookie("rds.refresh", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/api/auth/refresh",
    });

    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
}

export async function logoutHandler(_req: Request, res: Response) {
  res.clearCookie("rds.refresh", { path: "/api/auth/refresh" });
  res.status(204).send();
}

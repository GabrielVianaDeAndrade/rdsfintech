import type { Request, Response, NextFunction } from "express";
import { simulateLoan } from "@/services/loan.service";

export async function simulateLoanHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.sub;
    const baasAccountId = req.headers["x-baas-account-id"] as string;
    const result = await simulateLoan(userId, baasAccountId, req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

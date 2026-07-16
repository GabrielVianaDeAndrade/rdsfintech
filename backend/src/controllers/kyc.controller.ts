import type { Request, Response, NextFunction } from "express";
import { registerKyc } from "@/services/kyc.service";

export async function registerKycHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await registerKyc(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

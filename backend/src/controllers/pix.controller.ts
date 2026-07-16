import type { Request, Response, NextFunction } from "express";
import { sendPix, createPixCharge } from "@/services/pix.service";

export async function sendPixHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.sub;
    const baasAccountId = req.headers["x-baas-account-id"] as string; // resolvido via perfil em produção
    const result = await sendPix(userId, baasAccountId, req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function createPixChargeHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const baasAccountId = req.headers["x-baas-account-id"] as string;
    const result = await createPixCharge(baasAccountId, req.body.amount);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

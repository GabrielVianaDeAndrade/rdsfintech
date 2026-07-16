import type { Request, Response, NextFunction } from "express";
import { issueBoleto, payBoleto } from "@/services/boleto.service";

export async function issueBoletoHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const baasAccountId = req.headers["x-baas-account-id"] as string;
    const result = await issueBoleto(baasAccountId, req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function payBoletoHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const baasAccountId = req.headers["x-baas-account-id"] as string;
    const result = await payBoleto(baasAccountId, req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

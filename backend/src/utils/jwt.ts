import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "@/config/env";

export interface AccessTokenPayload {
  sub: string; // userId
  scope: "customer" | "admin";
}

/**
 * Tokens de curta duração (padrão 10 minutos) para reduzir a janela de
 * exposição em caso de vazamento. Renovação via refresh token httpOnly,
 * de vida mais longa, nunca acessível por JavaScript no browser.
 */
export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpiresIn,
    algorithm: "HS256",
  } as SignOptions);
}

export function signRefreshToken(payload: { sub: string; tokenVersion: number }): string {
  return jwt.sign(payload, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn,
    algorithm: "HS256",
  } as SignOptions);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.jwt.accessSecret) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): { sub: string; tokenVersion: number } {
  return jwt.verify(token, env.jwt.refreshSecret) as {
    sub: string;
    tokenVersion: number;
  };
}

import crypto from "node:crypto";
import { env } from "@/config/env";

const ALGORITHM = "aes-256-gcm";

function getKey(): Buffer {
  const raw = env.fieldEncryptionKey.replace(/^base64:/, "");
  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) {
    throw new Error("FIELD_ENCRYPTION_KEY deve ter 32 bytes (AES-256)");
  }
  return key;
}

/**
 * Criptografia de campo (application-layer) para dados sensíveis em repouso
 * no DynamoDB (CPF, endereço, renda, telefone) — complementar à criptografia
 * de disco/transporte (TLS 1.2+ e KMS na infraestrutura AWS). Isso garante
 * que mesmo um acesso indevido ao banco não exponha dados em texto claro,
 * caracterizando a camada de E2EE entre a API e o armazenamento.
 */
export function encryptField(plainText: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return Buffer.concat([iv, authTag, encrypted]).toString("base64");
}

export function decryptField(payload: string): string {
  const raw = Buffer.from(payload, "base64");
  const iv = raw.subarray(0, 12);
  const authTag = raw.subarray(12, 28);
  const encrypted = raw.subarray(28);

  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString("utf8");
}

export function hashForLookup(value: string): string {
  // Hash determinístico (HMAC) para permitir busca por CPF sem armazenar em texto claro.
  return crypto.createHmac("sha256", getKey()).update(value).digest("hex");
}

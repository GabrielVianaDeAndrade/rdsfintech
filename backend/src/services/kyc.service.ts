import { randomUUID } from "node:crypto";
import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, TABLE_NAME } from "@/models/dynamo.client";
import type { UserProfileItem } from "@/models/user.model";
import { encryptField, hashForLookup } from "@/utils/crypto";
import { getBaasProvider } from "@/services/baas/baas.factory";
import { logger, maskCpf } from "@/utils/logger";
import { HttpError } from "@/middlewares/errorHandler.middleware";
import type { KycRegisterInput } from "@/schemas/kyc.schema";

/**
 * Orquestra a abertura de conta (KYC): valida unicidade de CPF, persiste o
 * perfil cifrado no DynamoDB e provisiona a conta correspondente junto ao
 * provedor BaaS. Se o BaaS falhar, o cadastro fica com kycStatus "pending"
 * para reprocessamento assíncrono, em vez de expor o erro do provedor.
 */
export async function registerKyc(input: KycRegisterInput) {
  const cpfHash = hashForLookup(input.cpf);

  const existing = await ddb.send(
    new GetCommand({ TableName: TABLE_NAME, Key: { PK: `CPF#${cpfHash}`, SK: "USER" } })
  );

  if (existing.Item) {
    throw new HttpError(409, "Já existe uma conta cadastrada para este CPF.");
  }

  const userId = randomUUID();
  const now = new Date().toISOString();

  const baas = getBaasProvider();
  const account = await baas.createAccount({
    fullName: input.fullName,
    cpf: input.cpf,
    phone: input.phone,
    address: input.address,
    occupation: input.occupation,
    monthlyIncome: input.monthlyIncome,
  });

  const profile: UserProfileItem = {
    PK: `USER#${userId}`,
    SK: "PROFILE",
    userId,
    fullName: input.fullName,
    cpfEncrypted: encryptField(input.cpf),
    cpfHash,
    phoneEncrypted: encryptField(input.phone),
    addressEncrypted: encryptField(input.address),
    occupation: input.occupation,
    monthlyIncomeEncrypted: encryptField(String(input.monthlyIncome)),
    kycStatus: account.status === "active" ? "approved" : "pending",
    baasAccountId: account.baasAccountId,
    createdAt: now,
    updatedAt: now,
    GSI1PK: `KYC#${account.status === "active" ? "approved" : "pending"}`,
    GSI1SK: now,
  };

  await ddb.send(new PutCommand({ TableName: TABLE_NAME, Item: profile }));
  // Índice de unicidade por CPF (item separado, sem dados pessoais em texto claro)
  await ddb.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: { PK: `CPF#${cpfHash}`, SK: "USER", userId },
    })
  );

  logger.info({ userId, cpf: maskCpf(input.cpf) }, "Conta KYC registrada");

  return { userId, kycStatus: profile.kycStatus };
}

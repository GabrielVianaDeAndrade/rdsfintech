import { randomUUID } from "node:crypto";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, TABLE_NAME } from "@/models/dynamo.client";
import type { TransactionItem } from "@/models/transaction.model";
import { getBaasProvider } from "@/services/baas/baas.factory";
import type { SendPixInput } from "@/schemas/pix.schema";

export async function sendPix(userId: string, baasAccountId: string, input: SendPixInput) {
  const baas = getBaasProvider();
  const result = await baas.sendPix({
    baasAccountId,
    pixKey: input.pixKey,
    amount: input.amount,
  });

  const now = new Date().toISOString();
  const txId = randomUUID();

  const tx: TransactionItem = {
    PK: `USER#${userId}`,
    SK: `TX#${now}#${txId}`,
    txId,
    type: "pix_out",
    amount: input.amount,
    status: result.status === "completed" ? "completed" : "processing",
    baasTransactionId: result.baasTransactionId,
    counterparty: input.pixKey,
    createdAt: now,
    updatedAt: now,
    GSI1PK: `TX#${result.baasTransactionId}`,
  };

  await ddb.send(new PutCommand({ TableName: TABLE_NAME, Item: tx }));
  return { txId, status: tx.status };
}

export async function createPixCharge(baasAccountId: string, amount: number) {
  const baas = getBaasProvider();
  return baas.createPixCharge({ baasAccountId, amount });
}

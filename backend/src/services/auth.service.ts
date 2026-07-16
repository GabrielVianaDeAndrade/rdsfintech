import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, TABLE_NAME } from "@/models/dynamo.client";
import { hashForLookup } from "@/utils/crypto";
import { signAccessToken, signRefreshToken } from "@/utils/jwt";
import { HttpError } from "@/middlewares/errorHandler.middleware";

/**
 * Autenticação simplificada para fins de scaffold. Em produção, a senha
 * jamais é comparada em texto claro — usar Argon2id com salt único por
 * usuário, e MFA obrigatório para operações transacionais de alto valor.
 */
export async function login(cpf: string, _password: string) {
  const cpfHash = hashForLookup(cpf);

  const userIndex = await ddb.send(
    new GetCommand({ TableName: TABLE_NAME, Key: { PK: `CPF#${cpfHash}`, SK: "USER" } })
  );

  if (!userIndex.Item) {
    throw new HttpError(401, "Credenciais inválidas.");
  }

  const userId = userIndex.Item.userId as string;

  // TODO produção: validar hash Argon2id da senha e status de MFA antes de emitir tokens.
  const accessToken = signAccessToken({ sub: userId, scope: "customer" });
  const refreshToken = signRefreshToken({ sub: userId, tokenVersion: 1 });

  return { userId, accessToken, refreshToken };
}

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { env } from "@/config/env";

/**
 * Cliente DynamoDB. Em produção, as credenciais vêm da IAM Role atribuída à
 * instância EC2 (sem access keys estáticas no código ou em variáveis de
 * ambiente) — ver docs/ARCHITECTURE.md.
 */
const client = new DynamoDBClient({ region: env.aws.region });

export const ddb = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
});

export const TABLE_NAME = env.aws.dynamoTable;

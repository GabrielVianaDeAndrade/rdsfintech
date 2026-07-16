import "dotenv/config";

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  corsOrigin: required("CORS_ORIGIN", "http://localhost:3000"),

  jwt: {
    accessSecret: required("JWT_ACCESS_SECRET", "dev-only-access-secret"),
    refreshSecret: required("JWT_REFRESH_SECRET", "dev-only-refresh-secret"),
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "10m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
  },

  fieldEncryptionKey: required(
    "FIELD_ENCRYPTION_KEY",
    "base64:ZGV2LW9ubHktMzItYnl0ZS1wbGFjZWhvbGRlci1rZXk="
  ),

  csrfSecret: required("CSRF_SECRET", "dev-only-csrf-secret"),

  baas: {
    baseUrl: required("BAAS_BASE_URL", "https://sandbox.provedor-baas.com.br/v1"),
    clientId: process.env.BAAS_CLIENT_ID ?? "",
    clientSecret: process.env.BAAS_CLIENT_SECRET ?? "",
    webhookSecret: process.env.BAAS_WEBHOOK_SECRET ?? "",
  },

  aws: {
    region: process.env.AWS_REGION ?? "sa-east-1",
    dynamoTable: process.env.DYNAMODB_TABLE_NAME ?? "rdsfintech-core",
  },
} as const;

export const isProduction = env.nodeEnv === "production";

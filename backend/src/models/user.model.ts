/**
 * Modelagem single-table no DynamoDB.
 *
 * PK                  | SK                   | Entidade
 * --------------------|----------------------|----------------------------------
 * USER#<userId>       | PROFILE              | Dados cadastrais (KYC) do usuário
 * USER#<userId>       | PIXKEY#<key>         | Chave Pix vinculada ao usuário
 * CPF#<cpfHash>        | USER                 | Índice de unicidade/lookup por CPF
 *
 * GSI1 (GSI1PK / GSI1SK) é usado para consultas por status de KYC / criação.
 * Campos sensíveis (cpf, address, phone, monthlyIncome) são armazenados
 * cifrados via encryptField() — ver backend/src/utils/crypto.ts.
 */
export interface UserProfileItem {
  PK: `USER#${string}`;
  SK: "PROFILE";
  userId: string;
  fullName: string;
  cpfEncrypted: string;
  cpfHash: string; // hash determinístico para lookup/unicidade, sem expor o CPF
  phoneEncrypted: string;
  addressEncrypted: string;
  occupation: string;
  monthlyIncomeEncrypted: string;
  kycStatus: "pending" | "approved" | "rejected";
  baasAccountId?: string; // id da conta no provedor BaaS, após provisionamento
  createdAt: string;
  updatedAt: string;
  GSI1PK: `KYC#${UserProfileItem["kycStatus"]}`;
  GSI1SK: string; // createdAt, para ordenação
}

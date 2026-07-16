/**
 * PK: USER#<userId>   SK: TX#<isoTimestamp>#<txId>
 * GSI1PK: TX#<baasTransactionId> — para reconciliar webhooks do provedor BaaS.
 */
export interface TransactionItem {
  PK: `USER#${string}`;
  SK: `TX#${string}`;
  txId: string;
  type: "pix_in" | "pix_out" | "boleto_payment" | "boleto_issue" | "loan_disbursement";
  amount: number;
  status: "pending" | "processing" | "completed" | "failed";
  baasTransactionId?: string;
  counterparty?: string;
  createdAt: string;
  updatedAt: string;
  GSI1PK?: `TX#${string}`;
}

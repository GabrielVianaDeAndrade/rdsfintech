/**
 * PK: USER#<userId>   SK: LOAN#<loanId>
 */
export interface LoanItem {
  PK: `USER#${string}`;
  SK: `LOAN#${string}`;
  loanId: string;
  requestedAmount: number;
  approvedAmount: number;
  monthlyInterestRate: number;
  installments: number;
  installmentValue: number;
  cet: number;
  status: "simulated" | "pending_approval" | "approved" | "rejected" | "disbursed";
  baasLoanId?: string;
  createdAt: string;
  updatedAt: string;
}

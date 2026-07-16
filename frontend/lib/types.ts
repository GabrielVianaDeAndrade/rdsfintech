export interface KycFormData {
  fullName: string;
  cpf: string;
  phone: string;
  address: string;
  occupation: string;
  monthlyIncome: string;
}

export interface LoanSimulationInput {
  requestedAmount: number;
  installments: number;
}

export interface LoanSimulationResult {
  requestedAmount: number;
  approvedAmount: number;
  monthlyInterestRate: number; // taxa de juros a.m. (%)
  installments: number;
  installmentValue: number;
  totalCost: number;
  cet: number; // Custo Efetivo Total (% a.a.)
}

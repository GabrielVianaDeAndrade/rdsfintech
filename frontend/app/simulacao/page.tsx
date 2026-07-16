"use client";

import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/ui/AuthShell";
import { LoanCalculator } from "@/components/shared/LoanCalculator";

/**
 * Simulação pública de empréstimo. Ao avançar, o cliente é direcionado ao
 * fluxo obrigatório de abertura de conta (KYC) — a contratação só existe
 * para titulares identificados.
 */
export default function SimulacaoPage() {
  const router = useRouter();

  return (
    <AuthShell
      title="Simule seu empréstimo"
      subtitle="Escolha o valor e em quantos meses quer pagar. Sem consulta ao seu CPF nesta etapa."
      backHref="/"
    >
      <div className="card">
        <LoanCalculator
          actionLabel="Continuar e abrir minha conta"
          onSubmit={() => router.push("/cadastro")}
        />
      </div>

      <p className="mt-5 text-center text-xs leading-relaxed text-muted/70">
        Para contratar, é necessário abrir uma conta e concluir a verificação de
        identidade.
      </p>
    </AuthShell>
  );
}

"use client";

import { useState } from "react";
import { CheckCircle2, HandCoins } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { LoanCalculator } from "@/components/shared/LoanCalculator";
import { useApp } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { formatBRL, formatDateTime } from "@/lib/utils";

const APPROVED_LIMIT = 15000;

export default function EmprestimoPage() {
  const { loans, contractLoan } = useApp();
  const toast = useToast();
  const [confirming, setConfirming] = useState<{ amount: number; months: number } | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const activeLoans = loans.filter((l) => l.status === "active");

  async function handleContract() {
    if (!confirming) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    contractLoan(confirming.amount, confirming.months);
    setLoading(false);
    setConfirming(null);
    toast(`${formatBRL(confirming.amount)} creditados na sua conta.`);
  }

  return (
    <DashboardShell title="Empréstimo" subtitle="Simule e contrate com prazo livre">
      {/* Limite */}
      <section className="card mb-4">
        <div className="flex items-center gap-4">
          <span className="icon-tile">
            <HandCoins size={18} strokeWidth={1.6} />
          </span>
          <div>
            <p className="text-xs text-muted">Crédito pré-aprovado</p>
            <p className="mt-0.5 text-2xl font-semibold tracking-tight text-white">
              {formatBRL(APPROVED_LIMIT)}
            </p>
          </div>
        </div>
        <p className="mt-4 border-t border-line pt-4 text-xs leading-relaxed text-muted">
          Limite baseado na renda informada no seu cadastro. A liberação final
          depende da análise de crédito do nosso parceiro.
        </p>
      </section>

      {/* Empréstimos ativos */}
      {activeLoans.length > 0 && (
        <section className="card mb-4">
          <h2 className="mb-3 text-sm font-semibold text-white">Contratos ativos</h2>
          <ul className="divide-y divide-line/70">
            {activeLoans.map((loan) => (
              <li key={loan.id} className="py-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">
                      {formatBRL(loan.amount)} em {loan.installments}x
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      Contratado em {formatDateTime(loan.contractedAt)}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold tabular-nums text-white">
                      {formatBRL(loan.installmentValue)}
                    </p>
                    <p className="text-[11px] text-muted">por mês</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full bg-emerald"
                      style={{
                        width: `${(loan.paidInstallments / loan.installments) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="shrink-0 text-[11px] tabular-nums text-muted">
                    {loan.paidInstallments}/{loan.installments}
                  </span>
                </div>
                <p className="mt-2 text-[11px] text-muted">
                  Taxa {loan.monthlyRate.toFixed(2)}% a.m. • CET {loan.cet.toFixed(1)}% a.a.
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Simulação / confirmação */}
      {confirming ? (
        <section className="card">
          <div className="mb-5 flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald" />
            <h2 className="text-sm font-semibold text-white">Confirmar contratação</h2>
          </div>

          <div className="rounded-2xl border border-line bg-background p-5">
            <p className="text-xs text-muted">Você vai receber</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight text-emerald">
              {formatBRL(confirming.amount)}
            </p>
            <p className="mt-4 border-t border-line pt-4 text-sm text-white/85">
              Pagando <strong className="font-semibold">{confirming.months}x</strong> a
              partir do próximo mês. O valor cai na sua conta imediatamente após a
              confirmação.
            </p>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              onClick={() => setConfirming(null)}
              disabled={loading}
              className="btn-secondary flex-1"
            >
              Voltar
            </button>
            <button onClick={handleContract} disabled={loading} className="btn-primary flex-[1.5]">
              {loading ? "Processando..." : "Confirmar e receber"}
            </button>
          </div>
        </section>
      ) : (
        <section className="card">
          <h2 className="mb-5 text-sm font-semibold text-white">Nova simulação</h2>
          <LoanCalculator
            actionLabel="Contratar empréstimo"
            maxAmount={APPROVED_LIMIT}
            onSubmit={(amount, months) => setConfirming({ amount, months })}
          />
        </section>
      )}
    </DashboardShell>
  );
}

"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { simulateLoan, formatBRL } from "@/lib/utils";

const INSTALLMENT_OPTIONS = [6, 12, 24, 36, 48];

export function LoanSimulator({
  onSimulate,
}: {
  onSimulate: (amount: number, installments: number) => void;
}) {
  const [amount, setAmount] = useState(10000);
  const [installments, setInstallments] = useState(24);

  const result = useMemo(
    () => simulateLoan({ requestedAmount: amount, installments }),
    [amount, installments]
  );

  return (
    <section id="simular-emprestimo" className="section py-20 sm:py-28">
      <div className="card mx-auto max-w-3xl border-emerald/20 bg-background-elevated/60 p-8 sm:p-10">
        <span className="text-xs font-medium uppercase tracking-wide text-emerald-soft">
          Simulação de empréstimo
        </span>
        <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
          Quanto você precisa?
        </h2>
        <p className="mt-2 text-sm text-muted">
          Valores aproximados. Para ver a proposta final e contratar, você
          precisará concluir seu cadastro (KYC).
        </p>

        <div className="mt-8 space-y-6">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted">Valor solicitado</span>
              <span className="font-semibold text-white">
                {formatBRL(amount)}
              </span>
            </div>
            <input
              type="range"
              min={1000}
              max={50000}
              step={500}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full accent-emerald"
            />
          </div>

          <div>
            <span className="mb-2 block text-sm text-muted">
              Parcelas
            </span>
            <div className="flex flex-wrap gap-2">
              {INSTALLMENT_OPTIONS.map((n) => (
                <button
                  key={n}
                  onClick={() => setInstallments(n)}
                  className={
                    n === installments
                      ? "rounded-pill bg-emerald px-4 py-2 text-xs font-semibold text-background"
                      : "rounded-pill border border-line px-4 py-2 text-xs text-muted hover:border-emerald/40 hover:text-white"
                  }
                >
                  {n}x
                </button>
              ))}
            </div>
          </div>

          <motion.div
            key={`${amount}-${installments}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-4 rounded-2xl border border-line bg-background p-5 sm:grid-cols-3"
          >
            <SimStat label="Parcela estimada" value={formatBRL(result.installmentValue)} />
            <SimStat
              label="Taxa de juros (a.m.)"
              value={`${result.monthlyInterestRate.toFixed(2)}%`}
            />
            <SimStat label="CET (a.a.)" value={`${result.cet.toFixed(1)}%`} />
          </motion.div>

          <button
            onClick={() => onSimulate(amount, installments)}
            className="btn-primary w-full"
          >
            Continuar e criar minha conta
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

function SimStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

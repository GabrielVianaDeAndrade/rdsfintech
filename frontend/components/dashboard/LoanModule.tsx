"use client";

import { useMemo, useState } from "react";
import { HandCoins, Info } from "lucide-react";
import { Sheet } from "../ui/Sheet";
import { simulateLoan, formatBRL } from "@/lib/utils";

const APPROVED_LIMIT = 15000;
const INSTALLMENT_OPTIONS = [6, 12, 18, 24, 36, 48];

export function LoanCard({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="card flex items-center gap-4 border-emerald/20 text-left transition-colors hover:border-emerald/50"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-dim to-azure-dim">
        <HandCoins size={22} className="text-emerald-soft" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-white">Empréstimo</h3>
        <p className="text-xs text-muted">
          Até {formatBRL(APPROVED_LIMIT)} pré-aprovado
        </p>
      </div>
    </button>
  );
}

/**
 * Simulação interativa do empréstimo. Os valores exibidos aqui são calculados
 * localmente para preview de UX; a proposta vinculante (valor aprovado, taxa
 * e CET oficiais) vem do backend em POST /api/loan/simulate, que consulta o
 * provedor BaaS — ver backend/src/services/loan.service.ts
 */
export function LoanSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [requestedAmount, setRequestedAmount] = useState(8000);
  const [installments, setInstallments] = useState(24);

  const result = useMemo(
    () => simulateLoan({ requestedAmount, installments }),
    [requestedAmount, installments]
  );

  const approvedAmount = Math.min(requestedAmount, APPROVED_LIMIT);

  return (
    <Sheet open={open} onClose={onClose} title="Simular empréstimo">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Stat label="Valor solicitado" value={formatBRL(requestedAmount)} />
          <Stat
            label="Valor aprovado"
            value={formatBRL(approvedAmount)}
            highlight
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted">Ajustar valor</span>
          </div>
          <input
            type="range"
            min={500}
            max={APPROVED_LIMIT}
            step={100}
            value={requestedAmount}
            onChange={(e) => setRequestedAmount(Number(e.target.value))}
            className="w-full accent-emerald"
          />
        </div>

        <div>
          <span className="mb-2 block text-sm text-muted">
            Parcelamento
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

        <div className="rounded-2xl border border-line bg-background p-5">
          <Row label="Taxa de juros" value={`${result.monthlyInterestRate.toFixed(2)}% a.m.`} />
          <Row
            label="Valor da parcela"
            value={`${installments}x de ${formatBRL(result.installmentValue)}`}
          />
          <Row label="Custo total" value={formatBRL(result.totalCost)} />
          <Row label="CET" value={`${result.cet.toFixed(1)}% a.a.`} last />
        </div>

        <div className="flex items-start gap-2 rounded-xl bg-azure-dim p-3">
          <Info size={14} className="mt-0.5 shrink-0 text-azure-soft" />
          <p className="text-[11px] leading-relaxed text-white/80">
            O Custo Efetivo Total (CET) inclui juros, tarifas e demais
            encargos, conforme regulação do Banco Central. Valores sujeitos a
            análise final do provedor de crédito.
          </p>
        </div>

        <button className="btn-primary w-full">Contratar empréstimo</button>
      </div>
    </Sheet>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-line p-4">
      <p className="text-xs text-muted">{label}</p>
      <p
        className={
          highlight
            ? "mt-1 text-lg font-semibold text-emerald-soft"
            : "mt-1 text-lg font-semibold text-white"
        }
      >
        {value}
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={
        last
          ? "flex items-center justify-between py-2"
          : "flex items-center justify-between border-b border-line/60 py-2"
      }
    >
      <span className="text-sm text-muted">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

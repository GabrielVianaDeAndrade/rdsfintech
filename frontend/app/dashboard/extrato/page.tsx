"use client";

import { useMemo, useState } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { useApp } from "@/lib/store";
import { formatBRL } from "@/lib/utils";

const FILTERS = [
  { key: "all", label: "Tudo" },
  { key: "in", label: "Entradas" },
  { key: "out", label: "Saídas" },
] as const;

export default function ExtratoPage() {
  const { transactions } = useApp();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");

  const filtered = useMemo(() => {
    if (filter === "in") return transactions.filter((t) => t.amount > 0);
    if (filter === "out") return transactions.filter((t) => t.amount < 0);
    return transactions;
  }, [transactions, filter]);

  const totals = useMemo(() => {
    const income = transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const outcome = transactions.filter((t) => t.amount < 0).reduce((s, t) => s + t.amount, 0);
    return { income, outcome: Math.abs(outcome) };
  }, [transactions]);

  return (
    <DashboardShell title="Extrato" subtitle={`${transactions.length} movimentações`}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card">
          <p className="text-xs text-muted">Entradas</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-emerald">
            +{formatBRL(totals.income)}
          </p>
        </div>
        <div className="card">
          <p className="text-xs text-muted">Saídas</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-white/80">
            −{formatBRL(totals.outcome)}
          </p>
        </div>
      </div>

      <div className="card mt-4">
        <div className="mb-2 flex gap-1.5 rounded-pill bg-background p-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex-1 rounded-pill py-2 text-xs font-medium transition-colors ${
                filter === f.key
                  ? "bg-white/[0.08] text-white"
                  : "text-muted hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <TransactionList
          transactions={filtered}
          emptyMessage="Nenhuma movimentação neste filtro."
        />
      </div>
    </DashboardShell>
  );
}

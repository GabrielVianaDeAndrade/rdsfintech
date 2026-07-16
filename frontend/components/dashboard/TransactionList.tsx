"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  Barcode,
  CreditCard,
  HandCoins,
  Landmark,
} from "lucide-react";
import type { Transaction, TransactionType } from "@/lib/types";
import { formatBRL, formatDateTime } from "@/lib/utils";

const ICONS: Record<TransactionType, typeof ArrowDownLeft> = {
  pix_in: ArrowDownLeft,
  pix_out: ArrowUpRight,
  boleto_paid: Barcode,
  boleto_received: Barcode,
  card_purchase: CreditCard,
  loan_credit: HandCoins,
  deposit: Landmark,
};

export function TransactionList({
  transactions,
  limit,
  emptyMessage = "Nenhuma movimentação por aqui ainda.",
}: {
  transactions: Transaction[];
  limit?: number;
  emptyMessage?: string;
}) {
  const items = limit ? transactions.slice(0, limit) : transactions;

  if (items.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted">{emptyMessage}</p>
    );
  }

  return (
    <ul className="divide-y divide-line/70">
      {items.map((tx) => {
        const Icon = ICONS[tx.type];
        const positive = tx.amount > 0;
        return (
          <li key={tx.id} className="flex items-center justify-between gap-3 py-3.5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-background">
                <Icon
                  size={14}
                  strokeWidth={1.8}
                  className={positive ? "text-emerald" : "text-muted"}
                />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm text-white/90">{tx.label}</p>
                <p className="text-xs text-muted">{formatDateTime(tx.createdAt)}</p>
              </div>
            </div>
            <span
              className={`shrink-0 text-sm font-medium tabular-nums ${
                positive ? "text-emerald" : "text-white/70"
              }`}
            >
              {positive ? "+" : "−"}
              {formatBRL(Math.abs(tx.amount))}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

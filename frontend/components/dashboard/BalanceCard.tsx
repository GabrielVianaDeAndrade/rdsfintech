"use client";

import { useState } from "react";
import { Eye, EyeOff, Plus, ArrowUpRight } from "lucide-react";
import { formatBRL } from "@/lib/utils";

export function BalanceCard() {
  const [visible, setVisible] = useState(true);

  return (
    <div className="card bg-gradient-to-br from-background-elevated to-background-surface">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">Saldo disponível</span>
        <button
          onClick={() => setVisible((v) => !v)}
          className="text-muted hover:text-white"
          aria-label="Alternar visibilidade do saldo"
        >
          {visible ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      </div>

      <p className="mt-2 text-3xl font-bold text-white">
        {visible ? formatBRL(7580.2) : "R$ ••••••"}
      </p>

      <div className="mt-6 flex gap-3">
        <button className="btn-primary !py-2.5 flex-1">
          <Plus size={16} />
          Adicionar
        </button>
        <button className="btn-secondary !py-2.5 flex-1">
          <ArrowUpRight size={16} />
          Transferir
        </button>
      </div>
    </div>
  );
}

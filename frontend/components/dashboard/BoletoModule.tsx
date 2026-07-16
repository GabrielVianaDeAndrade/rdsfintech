"use client";

import { useState } from "react";
import { FileText, Barcode } from "lucide-react";
import { Sheet } from "../ui/Sheet";

const TABS = ["Pagar", "Emitir"] as const;
type Tab = (typeof TABS)[number];

export function BoletoCard({ onOpen }: { onOpen: () => void }) {
  return (
    <button onClick={onOpen} className="card flex items-center gap-4 text-left transition-colors hover:border-azure/40">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-azure-dim">
        <FileText size={22} className="text-azure-soft" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-white">Boleto</h3>
        <p className="text-xs text-muted">Emissão e pagamento</p>
      </div>
    </button>
  );
}

export function BoletoSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("Pagar");

  return (
    <Sheet open={open} onClose={onClose} title="Boleto">
      <div className="mb-6 flex gap-2 rounded-pill bg-background p-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={
              t === tab
                ? "flex-1 rounded-pill bg-azure py-2 text-xs font-semibold text-white"
                : "flex-1 rounded-pill py-2 text-xs text-muted"
            }
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Pagar" && (
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted">
              Linha digitável
            </span>
            <div className="flex items-center gap-2 rounded-xl border border-line bg-background px-4 py-2.5">
              <Barcode size={16} className="text-muted" />
              <input
                placeholder="00190.00009 03949.318017 ..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-muted/60"
              />
            </div>
          </label>
          <button className="btn-primary w-full">Consultar boleto</button>
        </div>
      )}

      {tab === "Emitir" && (
        <div className="space-y-4">
          <Field label="Nome do pagador" placeholder="Nome completo" />
          <Field label="CPF/CNPJ do pagador" placeholder="000.000.000-00" />
          <Field label="Valor" placeholder="R$ 0,00" />
          <Field label="Vencimento" placeholder="DD/MM/AAAA" />
          <button className="btn-secondary w-full border-azure/40 text-azure-soft">
            Gerar boleto
          </button>
        </div>
      )}
    </Sheet>
  );
}

function Field({ label, placeholder }: { label: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
      <input
        placeholder={placeholder}
        className="w-full rounded-xl border border-line bg-background px-4 py-2.5 text-sm text-white outline-none focus:border-azure"
      />
    </label>
  );
}

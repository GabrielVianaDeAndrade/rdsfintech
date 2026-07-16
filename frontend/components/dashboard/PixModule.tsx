"use client";

import { useState } from "react";
import { QrCode, Key, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Sheet } from "../ui/Sheet";

const TABS = ["Chaves", "Enviar", "Receber"] as const;
type Tab = (typeof TABS)[number];

export function PixCard({ onOpen }: { onOpen: () => void }) {
  return (
    <button onClick={onOpen} className="card flex items-center gap-4 text-left transition-colors hover:border-emerald/40">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-dim">
        <QrCode size={22} className="text-emerald-soft" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-white">Pix</h3>
        <p className="text-xs text-muted">Chaves, envio e recebimento</p>
      </div>
    </button>
  );
}

export function PixSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("Chaves");

  return (
    <Sheet open={open} onClose={onClose} title="Pix">
      <div className="mb-6 flex gap-2 rounded-pill bg-background p-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={
              t === tab
                ? "flex-1 rounded-pill bg-emerald py-2 text-xs font-semibold text-background"
                : "flex-1 rounded-pill py-2 text-xs text-muted"
            }
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Chaves" && (
        <div className="space-y-3">
          {["CPF", "E-mail", "Telefone", "Chave aleatória"].map((k) => (
            <div key={k} className="flex items-center justify-between rounded-xl border border-line p-4">
              <div className="flex items-center gap-3">
                <Key size={16} className="text-emerald-soft" />
                <span className="text-sm text-white">{k}</span>
              </div>
              <span className="text-xs text-muted">Cadastrar</span>
            </div>
          ))}
        </div>
      )}

      {tab === "Enviar" && (
        <div className="space-y-4">
          <Field label="Chave Pix do destinatário" placeholder="CPF, e-mail, telefone ou aleatória" />
          <Field label="Valor" placeholder="R$ 0,00" />
          <button className="btn-primary w-full">
            <ArrowUpRight size={16} />
            Enviar Pix
          </button>
        </div>
      )}

      {tab === "Receber" && (
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="flex h-40 w-40 items-center justify-center rounded-2xl border border-line bg-background">
            <QrCode size={72} className="text-muted" />
          </div>
          <Field label="Valor a receber (opcional)" placeholder="R$ 0,00" />
          <button className="btn-primary w-full">
            <ArrowDownLeft size={16} />
            Gerar QR Code
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
        className="w-full rounded-xl border border-line bg-background px-4 py-2.5 text-sm text-white outline-none focus:border-emerald"
      />
    </label>
  );
}

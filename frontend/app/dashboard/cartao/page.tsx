"use client";

import { useState } from "react";
import {
  Lock,
  Unlock,
  Plus,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Wifi,
  Settings2,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Field } from "@/components/ui/Field";
import { useApp } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import type { Card as CardType } from "@/lib/types";
import { applyCurrencyMask, formatBRL, parseCurrency } from "@/lib/utils";

export default function CartaoPage() {
  const { cards } = useApp();
  const [creating, setCreating] = useState(false);

  return (
    <DashboardShell title="Cartões" subtitle={`${cards.length} cartões ativos`}>
      <div className="space-y-4">
        {cards.map((card) => (
          <CardItem key={card.id} card={card} />
        ))}

        {creating ? (
          <NewVirtualCardForm onDone={() => setCreating(false)} />
        ) : (
          <button onClick={() => setCreating(true)} className="btn-secondary w-full">
            <Plus size={16} />
            Criar cartão virtual
          </button>
        )}
      </div>
    </DashboardShell>
  );
}

function CardItem({ card }: { card: CardType }) {
  const { toggleCardBlock, deleteCard } = useApp();
  const toast = useToast();
  const [showData, setShowData] = useState(false);

  const available = card.limit - card.used;
  const usedPct = Math.min((card.used / card.limit) * 100, 100);

  const number = showData
    ? `5412 8834 2291 ${card.last4}`
    : `•••• •••• •••• ${card.last4}`;

  return (
    <section className="card">
      {/* Cartão visual */}
      <div
        className={`relative overflow-hidden rounded-2xl border border-white/[0.08] p-5 transition-opacity ${
          card.blocked
            ? "bg-background opacity-50"
            : "bg-gradient-to-br from-[#16191c] via-[#0e1113] to-[#0a3b30]"
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40">
              {card.kind === "physical" ? "Físico" : "Virtual"}
            </p>
            <p className="mt-0.5 text-sm font-medium text-white">{card.label}</p>
          </div>
          <Wifi size={16} className="rotate-90 text-white/40" />
        </div>

        <p className="mt-8 font-mono text-lg tracking-[0.15em] text-white">{number}</p>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-wider text-white/40">Titular</p>
            <p className="mt-0.5 text-[11px] text-white/85">{card.holder}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-wider text-white/40">Validade</p>
            <p className="mt-0.5 text-[11px] tabular-nums text-white/85">{card.expiry}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-wider text-white/40">CVV</p>
            <p className="mt-0.5 text-[11px] tabular-nums text-white/85">
              {showData ? card.cvv : "•••"}
            </p>
          </div>
          <span className="text-[11px] font-semibold italic text-white/70">
            {card.brand}
          </span>
        </div>

        {card.blocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="flex items-center gap-2 rounded-pill border border-white/20 bg-black/70 px-4 py-1.5 text-xs font-semibold text-white">
              <Lock size={12} />
              Bloqueado
            </span>
          </div>
        )}
      </div>

      {/* Limite */}
      <div className="mt-5">
        <div className="mb-2 flex items-baseline justify-between text-xs">
          <span className="text-muted">
            Disponível: <span className="tabular-nums text-white/85">{formatBRL(available)}</span>
          </span>
          <span className="tabular-nums text-muted">
            {formatBRL(card.used)} / {formatBRL(card.limit)}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-emerald transition-all"
            style={{ width: `${usedPct}%` }}
          />
        </div>
      </div>

      {/* Ações */}
      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <ActionButton
          icon={showData ? EyeOff : Eye}
          label={showData ? "Ocultar" : "Ver dados"}
          onClick={() => setShowData((v) => !v)}
        />
        <ActionButton
          icon={Copy}
          label="Copiar nº"
          onClick={() => {
            navigator.clipboard.writeText(`5412883422291${card.last4}`);
            toast("Número do cartão copiado.");
          }}
        />
        <ActionButton
          icon={card.blocked ? Unlock : Lock}
          label={card.blocked ? "Desbloquear" : "Bloquear"}
          onClick={() => {
            toggleCardBlock(card.id);
            toast(card.blocked ? "Cartão desbloqueado." : "Cartão bloqueado.");
          }}
          highlight={card.blocked}
        />
        {card.kind === "virtual" ? (
          <ActionButton
            icon={Trash2}
            label="Excluir"
            danger
            onClick={() => {
              deleteCard(card.id);
              toast("Cartão virtual excluído.");
            }}
          />
        ) : (
          <ActionButton
            icon={Settings2}
            label="Ajustar limite"
            onClick={() => toast("Ajuste de limite disponível após a análise do BaaS.")}
          />
        )}
      </div>
    </section>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  danger,
  highlight,
}: {
  icon: typeof Lock;
  label: string;
  onClick: () => void;
  danger?: boolean;
  highlight?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 rounded-xl border border-line py-3 text-[11px] font-medium transition-colors ${
        danger
          ? "text-muted hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
          : highlight
            ? "border-emerald/40 text-emerald hover:bg-emerald/10"
            : "text-muted hover:border-white/20 hover:text-white"
      }`}
    >
      <Icon size={15} strokeWidth={1.7} />
      {label}
    </button>
  );
}

function NewVirtualCardForm({ onDone }: { onDone: () => void }) {
  const { createVirtualCard } = useApp();
  const toast = useToast();
  const [label, setLabel] = useState("");
  const [limitText, setLimitText] = useState("1.000,00");

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const limit = parseCurrency(limitText);
    if (limit <= 0) {
      toast("Informe um limite válido.", "error");
      return;
    }
    const card = createVirtualCard(label || "Cartão virtual", limit);
    toast(`Cartão virtual •••• ${card.last4} criado.`);
    onDone();
  }

  return (
    <form onSubmit={handleCreate} className="card space-y-4">
      <h2 className="text-sm font-semibold text-white">Novo cartão virtual</h2>

      <Field
        label="Apelido"
        value={label}
        onChange={setLabel}
        placeholder="Ex.: Assinaturas, Compras online"
        autoFocus
      />

      <div>
        <span className="mb-1.5 block text-xs font-medium text-muted">Limite</span>
        <div className="flex items-center gap-2 rounded-xl border border-line bg-background px-4 transition-colors focus-within:border-emerald">
          <span className="text-sm text-muted">R$</span>
          <input
            inputMode="numeric"
            value={limitText}
            onChange={(e) => setLimitText(applyCurrencyMask(e.target.value))}
            className="w-full bg-transparent py-3 text-sm font-semibold text-white outline-none"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={onDone} className="btn-secondary flex-1">
          Cancelar
        </button>
        <button type="submit" className="btn-primary flex-1">
          Criar cartão
        </button>
      </div>
    </form>
  );
}

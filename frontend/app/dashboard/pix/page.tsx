"use client";

import { useState } from "react";
import { Key, Plus, Trash2, QrCode, Copy, Check, ArrowUpRight } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Field, Select } from "@/components/ui/Field";
import { useApp } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import type { PixKeyType } from "@/lib/types";
import {
  applyCpfMask,
  applyCurrencyMask,
  applyPhoneMask,
  formatBRL,
  parseCurrency,
  randomId,
} from "@/lib/utils";

const TABS = ["Enviar", "Receber", "Chaves"] as const;
type Tab = (typeof TABS)[number];

const KEY_LABELS: Record<PixKeyType, string> = {
  cpf: "CPF",
  email: "E-mail",
  phone: "Telefone",
  random: "Chave aleatória",
};

export default function PixPage() {
  const [tab, setTab] = useState<Tab>("Enviar");

  return (
    <DashboardShell title="Pix" subtitle="Envie, receba e gerencie suas chaves">
      <div className="mb-4 flex gap-1.5 rounded-pill bg-background-surface p-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-pill py-2.5 text-xs font-semibold transition-colors ${
              tab === t ? "bg-emerald text-background" : "text-muted hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Enviar" && <SendTab />}
      {tab === "Receber" && <ReceiveTab />}
      {tab === "Chaves" && <KeysTab />}
    </DashboardShell>
  );
}

function SendTab() {
  const { sendPix, balance } = useApp();
  const toast = useToast();
  const [key, setKey] = useState("");
  const [amountText, setAmountText] = useState("");
  const [description, setDescription] = useState("");
  const [sending, setSending] = useState(false);

  const amount = parseCurrency(amountText);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!key.trim()) {
      toast("Informe a chave Pix do destinatário.", "error");
      return;
    }

    setSending(true);
    await new Promise((r) => setTimeout(r, 600));
    const result = sendPix(key.trim(), amount);
    setSending(false);

    if (!result.ok) {
      toast(result.error ?? "Não foi possível enviar o Pix.", "error");
      return;
    }

    toast(`Pix de ${formatBRL(amount)} enviado.`);
    setKey("");
    setAmountText("");
    setDescription("");
  }

  return (
    <form onSubmit={handleSend} className="card space-y-5">
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-semibold text-white">Enviar Pix</h2>
        <span className="text-xs text-muted">
          Saldo: <span className="tabular-nums text-white/80">{formatBRL(balance)}</span>
        </span>
      </div>

      <Field
        label="Chave Pix do destinatário"
        value={key}
        onChange={setKey}
        placeholder="CPF, e-mail, telefone ou chave aleatória"
        autoFocus
      />

      <div>
        <span className="mb-1.5 block text-xs font-medium text-muted">Valor</span>
        <div className="flex items-center gap-2 rounded-xl border border-line bg-background px-4 transition-colors focus-within:border-emerald">
          <span className="text-sm text-muted">R$</span>
          <input
            inputMode="numeric"
            value={amountText}
            onChange={(e) => setAmountText(applyCurrencyMask(e.target.value))}
            placeholder="0,00"
            className="w-full bg-transparent py-3 text-xl font-semibold text-white outline-none placeholder:text-muted/40"
          />
        </div>
        {amount > balance && (
          <p className="mt-1.5 text-xs text-red-400">Saldo insuficiente.</p>
        )}
      </div>

      <Field
        label="Descrição (opcional)"
        value={description}
        onChange={setDescription}
        placeholder="Ex.: aluguel, divisão da conta"
      />

      <button
        type="submit"
        disabled={sending || amount <= 0 || amount > balance}
        className="btn-primary w-full"
      >
        {sending ? "Enviando..." : "Enviar Pix"}
        {!sending && <ArrowUpRight size={16} />}
      </button>
    </form>
  );
}

function ReceiveTab() {
  const { receivePixCharge } = useApp();
  const toast = useToast();
  const [amountText, setAmountText] = useState("");
  const [generated, setGenerated] = useState<{ code: string; amount: number } | null>(null);
  const [copied, setCopied] = useState(false);

  const amount = parseCurrency(amountText);

  function handleGenerate() {
    if (amount <= 0) {
      toast("Informe um valor para a cobrança.", "error");
      return;
    }
    setGenerated({
      code: `00020126580014BR.GOV.BCB.PIX0136${randomId()}-rdsfintech520400005303986540${amount.toFixed(2)}5802BR6009SAO PAULO`,
      amount,
    });
    toast("Cobrança gerada com sucesso.");
  }

  function handleCopy() {
    if (!generated) return;
    navigator.clipboard.writeText(generated.code);
    setCopied(true);
    toast("Código copiado.");
    setTimeout(() => setCopied(false), 2000);
  }

  function handleSimulatePayment() {
    if (!generated) return;
    receivePixCharge(generated.amount);
    toast(`${formatBRL(generated.amount)} recebidos.`);
    setGenerated(null);
    setAmountText("");
  }

  return (
    <div className="card space-y-5">
      <h2 className="text-sm font-semibold text-white">Receber via Pix</h2>

      {!generated ? (
        <>
          <div>
            <span className="mb-1.5 block text-xs font-medium text-muted">
              Valor da cobrança
            </span>
            <div className="flex items-center gap-2 rounded-xl border border-line bg-background px-4 transition-colors focus-within:border-emerald">
              <span className="text-sm text-muted">R$</span>
              <input
                inputMode="numeric"
                autoFocus
                value={amountText}
                onChange={(e) => setAmountText(applyCurrencyMask(e.target.value))}
                placeholder="0,00"
                className="w-full bg-transparent py-3 text-xl font-semibold text-white outline-none placeholder:text-muted/40"
              />
            </div>
          </div>

          <button onClick={handleGenerate} className="btn-primary w-full">
            <QrCode size={16} />
            Gerar QR Code
          </button>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-background p-6">
            <div className="flex h-44 w-44 items-center justify-center rounded-2xl border border-line">
              <QrCode size={92} strokeWidth={0.8} className="text-white/70" />
            </div>
            <p className="text-2xl font-semibold tracking-tight text-white">
              {formatBRL(generated.amount)}
            </p>
            <p className="break-all px-2 text-center font-mono text-[10px] leading-relaxed text-muted">
              {generated.code}
            </p>
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row">
            <button onClick={handleCopy} className="btn-secondary flex-1">
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? "Copiado" : "Copiar código"}
            </button>
            <button
              onClick={() => {
                setGenerated(null);
                setAmountText("");
              }}
              className="btn-ghost flex-1 border border-line"
            >
              Nova cobrança
            </button>
          </div>

          <div className="rounded-xl border border-dashed border-line p-3.5">
            <p className="mb-2.5 text-[11px] leading-relaxed text-muted">
              Demonstração: simule o pagamento desta cobrança por um terceiro
              para ver o crédito na conta.
            </p>
            <button onClick={handleSimulatePayment} className="btn-secondary w-full !py-2">
              Simular pagamento recebido
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function KeysTab() {
  const { pixKeys, addPixKey, removePixKey } = useApp();
  const toast = useToast();
  const [adding, setAdding] = useState(false);
  const [type, setType] = useState<PixKeyType>("phone");
  const [value, setValue] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const finalValue = type === "random" ? crypto.randomUUID() : value;
    const result = addPixKey(type, finalValue);

    if (!result.ok) {
      toast(result.error ?? "Não foi possível cadastrar a chave.", "error");
      return;
    }

    toast("Chave Pix cadastrada.");
    setValue("");
    setAdding(false);
  }

  function handleValueChange(v: string) {
    if (type === "cpf") setValue(applyCpfMask(v));
    else if (type === "phone") setValue(applyPhoneMask(v));
    else setValue(v);
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Minhas chaves</h2>
          <span className="text-xs text-muted">{pixKeys.length} de 5</span>
        </div>

        {pixKeys.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted">
            Você ainda não cadastrou nenhuma chave.
          </p>
        ) : (
          <ul className="divide-y divide-line/70">
            {pixKeys.map((k) => (
              <li key={k.id} className="flex items-center justify-between gap-3 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="icon-tile !h-9 !w-9">
                    <Key size={14} strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-muted">{KEY_LABELS[k.type]}</p>
                    <p className="truncate text-sm text-white/90">{k.value}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    removePixKey(k.id);
                    toast("Chave removida.");
                  }}
                  className="shrink-0 rounded-lg p-2 text-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
                  aria-label={`Remover chave ${k.value}`}
                >
                  <Trash2 size={15} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {adding ? (
        <form onSubmit={handleAdd} className="card space-y-4">
          <h3 className="text-sm font-semibold text-white">Nova chave</h3>

          <Select
            label="Tipo de chave"
            value={type}
            onChange={(v) => {
              setType(v as PixKeyType);
              setValue("");
            }}
            options={[
              { value: "phone", label: "Telefone" },
              { value: "email", label: "E-mail" },
              { value: "cpf", label: "CPF" },
              { value: "random", label: "Chave aleatória" },
            ]}
          />

          {type !== "random" ? (
            <Field
              label={KEY_LABELS[type]}
              value={value}
              onChange={handleValueChange}
              placeholder={
                type === "cpf"
                  ? "000.000.000-00"
                  : type === "phone"
                    ? "(11) 98234-5671"
                    : "voce@email.com"
              }
              autoFocus
            />
          ) : (
            <p className="rounded-xl border border-dashed border-line p-3.5 text-xs leading-relaxed text-muted">
              Uma chave aleatória será gerada automaticamente. Ideal para receber
              sem expor CPF, e-mail ou telefone.
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="btn-secondary flex-1"
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary flex-1">
              Cadastrar
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          disabled={pixKeys.length >= 5}
          className="btn-secondary w-full"
        >
          <Plus size={16} />
          Cadastrar nova chave
        </button>
      )}
    </div>
  );
}

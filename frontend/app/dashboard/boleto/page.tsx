"use client";

import { useState } from "react";
import { Barcode, Copy, Check, Download, FileText, Clock } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Field } from "@/components/ui/Field";
import { useApp } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import type { Boleto } from "@/lib/types";
import {
  applyCpfMask,
  applyCurrencyMask,
  formatBRL,
  formatDateBR,
  parseCurrency,
} from "@/lib/utils";

const TABS = ["Pagar", "Emitir", "Histórico"] as const;
type Tab = (typeof TABS)[number];

export default function BoletoPage() {
  const [tab, setTab] = useState<Tab>("Pagar");

  return (
    <DashboardShell title="Boleto" subtitle="Pague e emita cobranças">
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

      {tab === "Pagar" && <PayTab />}
      {tab === "Emitir" && <IssueTab />}
      {tab === "Histórico" && <HistoryTab />}
    </DashboardShell>
  );
}

function PayTab() {
  const { payBoleto, balance } = useApp();
  const toast = useToast();
  const [barcode, setBarcode] = useState("");
  const [consulted, setConsulted] = useState<{
    beneficiary: string;
    amount: number;
    dueDate: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Consulta fictícia: o beneficiário e o valor viriam do provedor BaaS a
   * partir da linha digitável (POST /api/boleto/pay consulta antes de pagar).
   */
  async function handleConsult() {
    const digits = barcode.replace(/\D/g, "");
    if (digits.length < 44) {
      toast("A linha digitável deve ter 44 a 48 dígitos.", "error");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setConsulted({
      beneficiary: "Enel Distribuição São Paulo S.A.",
      amount: 184.32,
      dueDate: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
    });
    setLoading(false);
  }

  async function handlePay() {
    if (!consulted) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const result = payBoleto(barcode, consulted.amount);
    setLoading(false);

    if (!result.ok) {
      toast(result.error ?? "Não foi possível pagar o boleto.", "error");
      return;
    }

    toast(`Boleto de ${formatBRL(consulted.amount)} pago.`);
    setBarcode("");
    setConsulted(null);
  }

  return (
    <div className="card space-y-5">
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-semibold text-white">Pagar boleto</h2>
        <span className="text-xs text-muted">
          Saldo: <span className="tabular-nums text-white/80">{formatBRL(balance)}</span>
        </span>
      </div>

      <div>
        <span className="mb-1.5 block text-xs font-medium text-muted">
          Linha digitável
        </span>
        <div className="flex items-center gap-2 rounded-xl border border-line bg-background px-4 transition-colors focus-within:border-emerald">
          <Barcode size={16} className="shrink-0 text-muted" />
          <input
            inputMode="numeric"
            autoFocus
            value={barcode}
            onChange={(e) => {
              setBarcode(e.target.value);
              setConsulted(null);
            }}
            placeholder="00190.00009 03949.318017 00040.000006 1 96500000010000"
            className="w-full bg-transparent py-3 font-mono text-xs text-white outline-none placeholder:text-muted/40"
          />
        </div>
        <p className="mt-1.5 text-[11px] text-muted/70">
          Demonstração: digite 44+ dígitos para simular a consulta.
        </p>
      </div>

      {consulted && (
        <div className="rounded-2xl border border-line bg-background p-5">
          <p className="text-xs text-muted">Beneficiário</p>
          <p className="mt-0.5 text-sm font-medium text-white">{consulted.beneficiary}</p>

          <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
            <div>
              <p className="text-xs text-muted">Vencimento</p>
              <p className="mt-0.5 text-sm text-white/85">
                {formatDateBR(consulted.dueDate)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted">Valor</p>
              <p className="mt-0.5 text-xl font-semibold tracking-tight text-white">
                {formatBRL(consulted.amount)}
              </p>
            </div>
          </div>
        </div>
      )}

      {!consulted ? (
        <button onClick={handleConsult} disabled={loading} className="btn-primary w-full">
          {loading ? "Consultando..." : "Consultar boleto"}
        </button>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={() => {
              setConsulted(null);
              setBarcode("");
            }}
            className="btn-secondary flex-1"
          >
            Cancelar
          </button>
          <button onClick={handlePay} disabled={loading} className="btn-primary flex-[1.5]">
            {loading ? "Pagando..." : `Pagar ${formatBRL(consulted.amount)}`}
          </button>
        </div>
      )}
    </div>
  );
}

function IssueTab() {
  const { issueBoleto } = useApp();
  const toast = useToast();
  const [payerName, setPayerName] = useState("");
  const [payerDoc, setPayerDoc] = useState("");
  const [amountText, setAmountText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [issued, setIssued] = useState<Boleto | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const amount = parseCurrency(amountText);

  async function handleIssue(e: React.FormEvent) {
    e.preventDefault();
    if (payerName.trim().length < 3) return toast("Informe o nome do pagador.", "error");
    if (amount <= 0) return toast("Informe o valor do boleto.", "error");
    if (!dueDate) return toast("Informe a data de vencimento.", "error");

    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const boleto = issueBoleto(payerName, amount, dueDate, description);
    setIssued(boleto);
    setLoading(false);
    toast("Boleto emitido com sucesso.");
  }

  function handleCopy() {
    if (!issued) return;
    navigator.clipboard.writeText(issued.barcode);
    setCopied(true);
    toast("Linha digitável copiada.");
    setTimeout(() => setCopied(false), 2000);
  }

  function reset() {
    setIssued(null);
    setPayerName("");
    setPayerDoc("");
    setAmountText("");
    setDueDate("");
    setDescription("");
  }

  if (issued) {
    return (
      <div className="card space-y-5">
        <div className="flex flex-col items-center rounded-2xl border border-line bg-background p-6 text-center">
          <FileText size={36} strokeWidth={1.2} className="mb-3 text-emerald" />
          <p className="text-xs text-muted">Boleto emitido para</p>
          <p className="mt-0.5 text-sm font-medium text-white">{issued.payerName}</p>
          <p className="mt-4 text-2xl font-semibold tracking-tight text-white">
            {formatBRL(issued.amount)}
          </p>
          <p className="mt-1 text-xs text-muted">
            Vence em {formatDateBR(issued.dueDate)}
          </p>

          <div className="mt-5 w-full rounded-xl border border-line p-3">
            <p className="break-all font-mono text-[10px] leading-relaxed text-muted">
              {issued.barcode}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 sm:flex-row">
          <button onClick={handleCopy} className="btn-secondary flex-1">
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? "Copiado" : "Copiar linha"}
          </button>
          <button
            onClick={() => toast("PDF disponível após a integração com o BaaS.")}
            className="btn-secondary flex-1"
          >
            <Download size={15} />
            Baixar PDF
          </button>
        </div>

        <button onClick={reset} className="btn-primary w-full">
          Emitir outro boleto
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleIssue} className="card space-y-5">
      <h2 className="text-sm font-semibold text-white">Emitir cobrança</h2>

      <Field
        label="Nome do pagador"
        value={payerName}
        onChange={setPayerName}
        placeholder="Delta Comércio LTDA"
        autoFocus
      />
      <Field
        label="CPF/CNPJ do pagador"
        value={payerDoc}
        onChange={(v) => setPayerDoc(applyCpfMask(v))}
        placeholder="000.000.000-00"
        inputMode="numeric"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <span className="mb-1.5 block text-xs font-medium text-muted">Valor</span>
          <div className="flex items-center gap-2 rounded-xl border border-line bg-background px-4 transition-colors focus-within:border-emerald">
            <span className="text-sm text-muted">R$</span>
            <input
              inputMode="numeric"
              value={amountText}
              onChange={(e) => setAmountText(applyCurrencyMask(e.target.value))}
              placeholder="0,00"
              className="w-full bg-transparent py-3 text-sm font-semibold text-white outline-none placeholder:text-muted/40"
            />
          </div>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted">Vencimento</span>
          <input
            type="date"
            value={dueDate}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-xl border border-line bg-background px-4 py-3 text-sm text-white outline-none transition-colors focus:border-emerald [color-scheme:dark]"
          />
        </label>
      </div>

      <Field
        label="Descrição (opcional)"
        value={description}
        onChange={setDescription}
        placeholder="Serviço de consultoria — junho"
      />

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Gerando boleto..." : "Gerar boleto"}
      </button>
    </form>
  );
}

function HistoryTab() {
  const { boletos } = useApp();

  if (boletos.length === 0) {
    return (
      <div className="card">
        <p className="py-8 text-center text-sm text-muted">
          Você ainda não emitiu nem pagou boletos.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="mb-1 text-sm font-semibold text-white">Seus boletos</h2>
      <ul className="divide-y divide-line/70">
        {boletos.map((b) => (
          <li key={b.id} className="flex items-center justify-between gap-3 py-3.5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="icon-tile !h-9 !w-9">
                {b.status === "paid" ? (
                  <Check size={14} strokeWidth={2} className="text-emerald" />
                ) : (
                  <Clock size={14} strokeWidth={1.8} />
                )}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm text-white/90">{b.description}</p>
                <p className="text-xs text-muted">
                  {b.direction === "issued" ? "Emitido" : "Pago"} • vence{" "}
                  {formatDateBR(b.dueDate)}
                </p>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm font-medium tabular-nums text-white/85">
                {formatBRL(b.amount)}
              </p>
              <p
                className={`text-[11px] ${
                  b.status === "paid" ? "text-emerald" : "text-muted"
                }`}
              >
                {b.status === "paid" ? "Pago" : "Em aberto"}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

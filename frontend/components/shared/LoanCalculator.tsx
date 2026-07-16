"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { applyCurrencyMask, formatBRL, parseCurrency, quoteLoan } from "@/lib/utils";

const MIN_AMOUNT = 500;
const MAX_AMOUNT = 15000;
const MIN_MONTHS = 1;
const MAX_MONTHS = 60;

/**
 * Calculadora de empréstimo com prazo LIVRE: o cliente digita qualquer
 * número de meses entre 1 e 60 (ou usa o slider), em vez de escolher entre
 * opções predefinidas. Valores são indicativos — a proposta vinculante vem
 * do provedor BaaS via POST /api/loan/simulate.
 */
export function LoanCalculator({
  actionLabel,
  onSubmit,
  maxAmount = MAX_AMOUNT,
  disabled,
}: {
  actionLabel: string;
  onSubmit: (amount: number, installments: number) => void;
  maxAmount?: number;
  disabled?: boolean;
}) {
  const [amountText, setAmountText] = useState("8.000,00");
  const [monthsText, setMonthsText] = useState("24");

  const amount = parseCurrency(amountText);
  const months = Number(monthsText) || 0;

  const amountError =
    amount > 0 && amount < MIN_AMOUNT
      ? `Valor mínimo de ${formatBRL(MIN_AMOUNT)}`
      : amount > maxAmount
        ? `Valor máximo de ${formatBRL(maxAmount)}`
        : "";

  const monthsError =
    monthsText !== "" && (months < MIN_MONTHS || months > MAX_MONTHS)
      ? `Escolha entre ${MIN_MONTHS} e ${MAX_MONTHS} meses`
      : "";

  const valid = !amountError && !monthsError && amount >= MIN_AMOUNT && months >= MIN_MONTHS;

  const quote = useMemo(
    () => (valid ? quoteLoan(amount, months) : null),
    [valid, amount, months]
  );

  function handleMonthsInput(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 2);
    setMonthsText(digits);
  }

  return (
    <div className="space-y-6">
      {/* Valor */}
      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <label htmlFor="loan-amount" className="text-xs font-medium text-muted">
            Quanto você precisa?
          </label>
          <span className="text-[11px] text-muted/70">
            {formatBRL(MIN_AMOUNT)} — {formatBRL(maxAmount)}
          </span>
        </div>
        <div
          className={`flex items-center gap-2 rounded-xl border bg-background px-4 transition-colors focus-within:border-emerald ${
            amountError ? "border-red-500/60" : "border-line"
          }`}
        >
          <span className="text-sm text-muted">R$</span>
          <input
            id="loan-amount"
            inputMode="numeric"
            value={amountText}
            onChange={(e) => setAmountText(applyCurrencyMask(e.target.value))}
            className="w-full bg-transparent py-3 text-lg font-semibold text-white outline-none"
          />
        </div>
        {amountError && <p className="mt-1.5 text-xs text-red-400">{amountError}</p>}
        <input
          type="range"
          aria-label="Ajustar valor do empréstimo"
          min={MIN_AMOUNT}
          max={maxAmount}
          step={100}
          value={Math.min(Math.max(amount, MIN_AMOUNT), maxAmount)}
          onChange={(e) =>
            setAmountText(
              Number(e.target.value).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            )
          }
          className="mt-4 w-full"
        />
      </div>

      {/* Prazo livre */}
      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <label htmlFor="loan-months" className="text-xs font-medium text-muted">
            Em quantos meses quer pagar?
          </label>
          <span className="text-[11px] text-muted/70">
            {MIN_MONTHS} a {MAX_MONTHS} meses
          </span>
        </div>
        <div
          className={`flex items-center gap-2 rounded-xl border bg-background px-4 transition-colors focus-within:border-emerald ${
            monthsError ? "border-red-500/60" : "border-line"
          }`}
        >
          <input
            id="loan-months"
            inputMode="numeric"
            value={monthsText}
            onChange={(e) => handleMonthsInput(e.target.value)}
            placeholder="24"
            className="w-full bg-transparent py-3 text-lg font-semibold text-white outline-none placeholder:text-muted/40"
          />
          <span className="shrink-0 text-sm text-muted">
            {months === 1 ? "mês" : "meses"}
          </span>
        </div>
        {monthsError && <p className="mt-1.5 text-xs text-red-400">{monthsError}</p>}
        <input
          type="range"
          aria-label="Ajustar prazo em meses"
          min={MIN_MONTHS}
          max={MAX_MONTHS}
          step={1}
          value={Math.min(Math.max(months, MIN_MONTHS), MAX_MONTHS)}
          onChange={(e) => setMonthsText(e.target.value)}
          className="mt-4 w-full"
        />
      </div>

      {/* Resultado */}
      {quote ? (
        <motion.div
          key={`${amount}-${months}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-line bg-background p-5"
        >
          <div className="mb-4 border-b border-line pb-4">
            <p className="text-xs text-muted">Sua parcela mensal</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight text-emerald">
              {formatBRL(quote.installmentValue)}
            </p>
            <p className="mt-1 text-xs text-muted">
              {months}x • primeira em 30 dias
            </p>
          </div>
          <Row label="Valor solicitado" value={formatBRL(quote.amount)} />
          <Row label="Taxa de juros" value={`${quote.monthlyRate.toFixed(2)}% a.m.`} />
          <Row label="Total a pagar" value={formatBRL(quote.totalCost)} />
          <Row
            label="Custo Efetivo Total (CET)"
            value={`${quote.cet.toFixed(1)}% a.a.`}
            strong
            last
          />
        </motion.div>
      ) : (
        <div className="rounded-2xl border border-dashed border-line p-5 text-center">
          <p className="text-sm text-muted">
            Informe um valor e um prazo válidos para ver sua simulação.
          </p>
        </div>
      )}

      <div className="flex items-start gap-2.5 rounded-xl border border-line bg-background-surface p-3.5">
        <Info size={14} className="mt-0.5 shrink-0 text-muted" />
        <p className="text-[11px] leading-relaxed text-muted">
          O Custo Efetivo Total (CET) reúne juros, tarifas, IOF e demais
          encargos, conforme exigido pelo Banco Central. Simulação indicativa,
          sujeita à análise de crédito.
        </p>
      </div>

      <button
        onClick={() => quote && onSubmit(amount, months)}
        disabled={!valid || disabled}
        className="btn-primary w-full"
      >
        {actionLabel}
      </button>
    </div>
  );
}

function Row({
  label,
  value,
  strong,
  last,
}: {
  label: string;
  value: string;
  strong?: boolean;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between py-2 ${
        last ? "" : "border-b border-line/60"
      }`}
    >
      <span className="text-sm text-muted">{label}</span>
      <span
        className={`text-sm tabular-nums ${
          strong ? "font-semibold text-white" : "font-medium text-white/85"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

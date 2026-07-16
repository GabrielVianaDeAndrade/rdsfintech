"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Plus,
  ArrowUpRight,
  QrCode,
  Barcode,
  CreditCard,
  HandCoins,
  ChevronRight,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { useApp } from "@/lib/store";
import { formatBRL } from "@/lib/utils";

const SHORTCUTS = [
  { icon: QrCode, label: "Pix", href: "/dashboard/pix" },
  { icon: Barcode, label: "Boleto", href: "/dashboard/boleto" },
  { icon: CreditCard, label: "Cartão", href: "/dashboard/cartao" },
  { icon: HandCoins, label: "Crédito", href: "/dashboard/emprestimo" },
];

export default function DashboardPage() {
  const { profile, balance, transactions, loans, cards } = useApp();
  const [visible, setVisible] = useState(true);

  const firstName = profile.fullName.split(" ")[0];
  const activeLoan = loans.find((l) => l.status === "active");
  const mainCard = cards[0];

  return (
    <DashboardShell
      title={`Olá, ${firstName}`}
      subtitle={`Ag. ${profile.agency} • Conta ${profile.accountNumber}`}
      showBack={false}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Saldo */}
        <section className="card lg:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">Saldo disponível</span>
            <button
              onClick={() => setVisible((v) => !v)}
              className="text-muted transition-colors hover:text-white"
              aria-label={visible ? "Ocultar saldo" : "Mostrar saldo"}
            >
              {visible ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>

          <p className="mt-1.5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {visible ? formatBRL(balance) : "R$ ••••••"}
          </p>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <Link href="/dashboard/depositar" className="btn-primary flex-1">
              <Plus size={16} />
              Adicionar dinheiro
            </Link>
            <Link href="/dashboard/pix" className="btn-secondary flex-1">
              <ArrowUpRight size={16} />
              Transferir
            </Link>
          </div>
        </section>

        {/* Atalhos */}
        <section className="grid grid-cols-4 gap-2.5 lg:grid-cols-2">
          {SHORTCUTS.map(({ icon: Icon, label, href }) => (
            <Link
              key={href}
              href={href}
              className="card flex flex-col items-center justify-center gap-2 !p-4 transition-colors hover:border-white/15"
            >
              <Icon size={19} strokeWidth={1.6} className="text-white/70" />
              <span className="text-xs text-white/90">{label}</span>
            </Link>
          ))}
        </section>
      </div>

      {/* Cards de contexto */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Link
          href="/dashboard/emprestimo"
          className="card group flex items-center justify-between transition-colors hover:border-white/15"
        >
          <div className="min-w-0">
            <p className="text-xs text-muted">
              {activeLoan ? "Empréstimo ativo" : "Crédito pré-aprovado"}
            </p>
            <p className="mt-1 truncate text-lg font-semibold text-white">
              {activeLoan
                ? `${activeLoan.installments}x de ${formatBRL(activeLoan.installmentValue)}`
                : formatBRL(15000)}
            </p>
            <p className="mt-0.5 text-xs text-muted">
              {activeLoan
                ? `${activeLoan.paidInstallments}/${activeLoan.installments} parcelas pagas`
                : "Simule com o prazo que quiser"}
            </p>
          </div>
          <ChevronRight size={18} className="shrink-0 text-muted group-hover:text-white" />
        </Link>

        {mainCard && (
          <Link
            href="/dashboard/cartao"
            className="card group flex items-center justify-between transition-colors hover:border-white/15"
          >
            <div className="min-w-0">
              <p className="text-xs text-muted">{mainCard.label}</p>
              <p className="mt-1 truncate text-lg font-semibold text-white">
                •••• {mainCard.last4}
              </p>
              <p className="mt-0.5 text-xs text-muted">
                {mainCard.blocked
                  ? "Bloqueado"
                  : `${formatBRL(mainCard.limit - mainCard.used)} disponível`}
              </p>
            </div>
            <ChevronRight size={18} className="shrink-0 text-muted group-hover:text-white" />
          </Link>
        )}
      </div>

      {/* Atividade */}
      <section className="card mt-4">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Atividade recente</h2>
          <Link
            href="/dashboard/extrato"
            className="text-xs font-medium text-emerald hover:text-emerald-soft"
          >
            Ver extrato
          </Link>
        </div>
        <TransactionList transactions={transactions} limit={6} />
      </section>
    </DashboardShell>
  );
}

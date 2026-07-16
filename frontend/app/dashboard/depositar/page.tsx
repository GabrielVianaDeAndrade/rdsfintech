"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QrCode, Copy, Check } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { useApp } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { applyCurrencyMask, formatBRL, parseCurrency } from "@/lib/utils";

const PRESETS = [50, 100, 250, 500];

export default function DepositarPage() {
  const router = useRouter();
  const { addMoney } = useApp();
  const toast = useToast();

  const [amountText, setAmountText] = useState("");
  const [copied, setCopied] = useState(false);
  const amount = parseCurrency(amountText);

  const pixCode =
    "00020126580014BR.GOV.BCB.PIX0136a1f8c3d2-9b47-4e15-8a21-rdsfintech5204000053039865802BR6009SAO PAULO62070503***6304A1B2";

  function handleCopy() {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    toast("Código Pix copiado.");
    setTimeout(() => setCopied(false), 2000);
  }

  function handleSimulate() {
    if (amount <= 0) {
      toast("Informe um valor para depositar.", "error");
      return;
    }
    addMoney(amount);
    toast(`${formatBRL(amount)} adicionados à sua conta.`);
    router.push("/dashboard");
  }

  return (
    <DashboardShell title="Adicionar dinheiro" subtitle="Depósito via Pix">
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card">
          <h2 className="text-sm font-semibold text-white">Quanto quer adicionar?</h2>

          <div className="mt-4 flex items-center gap-2 rounded-xl border border-line bg-background px-4 transition-colors focus-within:border-emerald">
            <span className="text-sm text-muted">R$</span>
            <input
              inputMode="numeric"
              autoFocus
              value={amountText}
              onChange={(e) => setAmountText(applyCurrencyMask(e.target.value))}
              placeholder="0,00"
              className="w-full bg-transparent py-3 text-2xl font-semibold text-white outline-none placeholder:text-muted/40"
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {PRESETS.map((v) => (
              <button
                key={v}
                onClick={() =>
                  setAmountText(
                    v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
                  )
                }
                className="rounded-pill border border-line px-3.5 py-1.5 text-xs text-muted transition-colors hover:border-emerald/50 hover:text-white"
              >
                {formatBRL(v)}
              </button>
            ))}
          </div>

          <button onClick={handleSimulate} className="btn-primary mt-6 w-full">
            Confirmar depósito
          </button>

          <p className="mt-3 text-center text-[11px] leading-relaxed text-muted/70">
            Ambiente de demonstração: o valor é creditado na hora. Na integração
            real, o crédito ocorre após a confirmação do Pix pelo BaaS.
          </p>
        </section>

        <section className="card">
          <h2 className="text-sm font-semibold text-white">Pix Copia e Cola</h2>
          <p className="mt-1 text-xs text-muted">
            Use este código no app do seu outro banco.
          </p>

          <div className="mt-5 flex justify-center">
            <div className="flex h-40 w-40 items-center justify-center rounded-2xl border border-line bg-background">
              <QrCode size={80} strokeWidth={1} className="text-muted/60" />
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-line bg-background p-3">
            <p className="break-all font-mono text-[10px] leading-relaxed text-muted">
              {pixCode}
            </p>
          </div>

          <button onClick={handleCopy} className="btn-secondary mt-3 w-full">
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? "Copiado" : "Copiar código"}
          </button>
        </section>
      </div>
    </DashboardShell>
  );
}

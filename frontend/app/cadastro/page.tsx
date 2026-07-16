"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import { AuthShell } from "@/components/ui/AuthShell";
import { Field } from "@/components/ui/Field";
import { useApp } from "@/lib/store";
import { applyCpfMask, applyCurrencyMask, applyPhoneMask, parseCurrency } from "@/lib/utils";

/**
 * Abertura de conta (KYC) em página dedicada — substitui o modal flutuante.
 * Dividido em duas etapas para reduzir a carga do formulário, com navegação
 * de voltar entre elas. Enviará POST /api/kyc/register quando a API entrar.
 */
export default function CadastroPage() {
  const router = useRouter();
  const { updateProfile } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    fullName: "",
    cpf: "",
    phone: "",
    email: "",
    address: "",
    occupation: "",
    monthlyIncome: "",
  });

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: "" }));
  }

  function validateStep1() {
    const e: Record<string, string> = {};
    if (form.fullName.trim().split(" ").length < 2) e.fullName = "Informe seu nome completo.";
    if (form.cpf.replace(/\D/g, "").length !== 11) e.cpf = "CPF deve ter 11 dígitos.";
    if (form.phone.replace(/\D/g, "").length < 10) e.phone = "Telefone inválido.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "E-mail inválido.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep2() {
    const e: Record<string, string> = {};
    if (form.address.trim().length < 10) e.address = "Informe o endereço completo.";
    if (form.occupation.trim().length < 2) e.occupation = "Informe seu cargo.";
    if (parseCurrency(form.monthlyIncome) <= 0) e.monthlyIncome = "Informe sua renda mensal.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));

    updateProfile({
      fullName: form.fullName,
      cpf: form.cpf,
      phone: form.phone,
      email: form.email,
      address: form.address,
      occupation: form.occupation,
      monthlyIncome: parseCurrency(form.monthlyIncome),
    });

    setLoading(false);
    setStep(3);
  }

  if (step === 3) {
    return (
      <AuthShell title="Conta criada" backHref="/">
        <div className="card flex flex-col items-center py-10 text-center">
          <CheckCircle2 size={44} className="mb-5 text-emerald" strokeWidth={1.5} />
          <h2 className="text-lg font-semibold text-white">
            Bem-vindo à RDS Fintech, {form.fullName.split(" ")[0]}
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
            Seus dados foram validados e sua conta digital está ativa. Você já
            pode movimentar, emitir boletos e simular crédito.
          </p>
          <Link href="/dashboard" className="btn-primary mt-7 w-full">
            Acessar meu painel
            <ArrowRight size={16} />
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Abrir sua conta"
      subtitle="Precisamos confirmar sua identidade para abrir a conta (KYC), como exige a regulação."
      backHref="/"
      footer={
        <p className="text-center text-sm text-muted">
          Já tem conta?{" "}
          <Link href="/login" className="font-medium text-emerald hover:text-emerald-soft">
            Entrar
          </Link>
        </p>
      }
    >
      {/* Progresso */}
      <div className="mb-5 flex items-center gap-3">
        {[1, 2].map((n) => (
          <div key={n} className="flex flex-1 items-center gap-3">
            <div
              className={`h-1 flex-1 rounded-full transition-colors ${
                step >= n ? "bg-emerald" : "bg-line"
              }`}
            />
          </div>
        ))}
        <span className="shrink-0 text-xs tabular-nums text-muted">{step} de 2</span>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        {step === 1 ? (
          <>
            <Field
              label="Nome completo"
              value={form.fullName}
              onChange={(v) => set("fullName", v)}
              placeholder="Maria Santos Oliveira"
              error={errors.fullName}
              autoFocus
            />
            <Field
              label="CPF"
              value={form.cpf}
              onChange={(v) => set("cpf", applyCpfMask(v))}
              placeholder="000.000.000-00"
              inputMode="numeric"
              error={errors.cpf}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Telefone"
                value={form.phone}
                onChange={(v) => set("phone", applyPhoneMask(v))}
                placeholder="(11) 98234-5671"
                inputMode="tel"
                error={errors.phone}
              />
              <Field
                label="E-mail"
                value={form.email}
                onChange={(v) => set("email", v)}
                placeholder="voce@email.com"
                inputMode="email"
                error={errors.email}
              />
            </div>

            <button
              type="button"
              onClick={() => validateStep1() && setStep(2)}
              className="btn-primary w-full"
            >
              Continuar
              <ArrowRight size={16} />
            </button>
          </>
        ) : (
          <>
            <Field
              label="Endereço completo"
              value={form.address}
              onChange={(v) => set("address", v)}
              placeholder="Rua, número, complemento, bairro, cidade - UF"
              error={errors.address}
              autoFocus
            />
            <Field
              label="Cargo que exerce"
              value={form.occupation}
              onChange={(v) => set("occupation", v)}
              placeholder="Analista Financeira Sênior"
              error={errors.occupation}
            />
            <Field
              label="Renda fixa mensal"
              value={form.monthlyIncome}
              onChange={(v) => set("monthlyIncome", applyCurrencyMask(v))}
              placeholder="9.400,00"
              prefix="R$"
              inputMode="numeric"
              error={errors.monthlyIncome}
              hint="Usada para definir seu limite de crédito."
            />

            <div className="flex items-start gap-2.5 rounded-xl border border-line bg-background p-3.5">
              <ShieldCheck size={14} className="mt-0.5 shrink-0 text-emerald" />
              <p className="text-[11px] leading-relaxed text-muted">
                Seus dados são cifrados antes do armazenamento e nunca aparecem
                em texto claro em nossos registros internos. Ao continuar, você
                autoriza a validação junto a bases de identidade.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-secondary flex-1"
              >
                <ArrowLeft size={16} />
                Voltar
              </button>
              <button type="submit" disabled={loading} className="btn-primary flex-[1.5]">
                {loading ? "Validando dados..." : "Criar minha conta"}
              </button>
            </div>
          </>
        )}
      </form>
    </AuthShell>
  );
}

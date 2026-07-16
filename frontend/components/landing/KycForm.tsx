"use client";

import { useState } from "react";
import type { KycFormData } from "@/lib/types";

const EMPTY_FORM: KycFormData = {
  fullName: "",
  cpf: "",
  phone: "",
  address: "",
  occupation: "",
  monthlyIncome: "",
};

/**
 * Formulário de abertura de conta (KYC). O envio é feito para o BFF
 * (POST /api/kyc/register), que orquestra a criação da conta junto ao
 * provedor BaaS — ver backend/src/controllers/kyc.controller.ts
 */
export function KycForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [form, setForm] = useState<KycFormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof KycFormData>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Integração real: await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/kyc/register`, { method: "POST", body: JSON.stringify(form) })
      await new Promise((resolve) => setTimeout(resolve, 900));
      onSubmitted();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field
        label="Nome completo"
        value={form.fullName}
        onChange={(v) => update("fullName", v)}
        placeholder="Maria da Silva Santos"
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Field
          label="CPF"
          value={form.cpf}
          onChange={(v) => update("cpf", v)}
          placeholder="000.000.000-00"
          required
        />
        <Field
          label="Telefone"
          value={form.phone}
          onChange={(v) => update("phone", v)}
          placeholder="(11) 91234-5678"
          required
        />
      </div>
      <Field
        label="Endereço completo"
        value={form.address}
        onChange={(v) => update("address", v)}
        placeholder="Rua, número, bairro, cidade - UF"
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Cargo que exerce"
          value={form.occupation}
          onChange={(v) => update("occupation", v)}
          placeholder="Analista Financeiro"
          required
        />
        <Field
          label="Renda fixa mensal"
          value={form.monthlyIncome}
          onChange={(v) => update("monthlyIncome", v)}
          placeholder="R$ 5.000,00"
          required
        />
      </div>

      <p className="text-xs leading-relaxed text-muted">
        Ao continuar, você autoriza a RDS Fintech a validar seus dados junto a
        bases de identidade (KYC) para abertura de conta, conforme nossa
        Política de Privacidade.
      </p>

      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? "Validando dados..." : "Criar minha conta"}
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted">
        {label}
      </span>
      <input
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-line bg-background px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-muted/60 focus:border-emerald"
      />
    </label>
  );
}

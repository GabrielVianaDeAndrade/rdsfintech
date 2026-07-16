"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Wallet,
  Landmark,
  Calendar,
  Pencil,
  Eye,
  EyeOff,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Check,
  X,
  RotateCcw,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Field } from "@/components/ui/Field";
import { resetDemoData, useApp } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import {
  applyCurrencyMask,
  applyPhoneMask,
  formatBRL,
  formatDateBR,
  maskCpf,
  parseCurrency,
} from "@/lib/utils";

export default function PerfilPage() {
  const { profile, updateProfile } = useApp();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [showCpf, setShowCpf] = useState(false);

  const [form, setForm] = useState({
    phone: profile.phone,
    email: profile.email,
    address: profile.address,
    occupation: profile.occupation,
    monthlyIncome: profile.monthlyIncome.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    }),
  });

  function handleSave() {
    updateProfile({
      phone: form.phone,
      email: form.email,
      address: form.address,
      occupation: form.occupation,
      monthlyIncome: parseCurrency(form.monthlyIncome),
    });
    setEditing(false);
    toast("Dados atualizados com sucesso.");
  }

  function handleCancel() {
    setForm({
      phone: profile.phone,
      email: profile.email,
      address: profile.address,
      occupation: profile.occupation,
      monthlyIncome: profile.monthlyIncome.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      }),
    });
    setEditing(false);
  }

  const initials = profile.fullName
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");

  return (
    <DashboardShell title="Perfil" subtitle="Seus dados e configurações">
      {/* Identificação */}
      <section className="card">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-line bg-background text-lg font-semibold text-white">
            {initials}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-white">
              {profile.fullName}
            </h2>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-emerald">
              <ShieldCheck size={12} />
              Identidade verificada
            </p>
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-5">
          <div>
            <dt className="flex items-center gap-1.5 text-[11px] text-muted">
              <Landmark size={11} /> Agência
            </dt>
            <dd className="mt-1 text-sm tabular-nums text-white">{profile.agency}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-[11px] text-muted">
              <Wallet size={11} /> Conta
            </dt>
            <dd className="mt-1 text-sm tabular-nums text-white">
              {profile.accountNumber}
            </dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-[11px] text-muted">
              <Calendar size={11} /> Cliente desde
            </dt>
            <dd className="mt-1 text-sm text-white">{formatDateBR(profile.memberSince)}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-[11px] text-muted">
              <User size={11} /> CPF
            </dt>
            <dd className="mt-1 flex items-center gap-2 text-sm tabular-nums text-white">
              {showCpf ? profile.cpf : maskCpf(profile.cpf)}
              <button
                onClick={() => setShowCpf((v) => !v)}
                className="text-muted hover:text-white"
                aria-label={showCpf ? "Ocultar CPF" : "Mostrar CPF"}
              >
                {showCpf ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </dd>
          </div>
        </dl>
      </section>

      {/* Informações pessoais */}
      <section className="card mt-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Informações pessoais</h2>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 text-xs font-medium text-emerald hover:text-emerald-soft"
            >
              <Pencil size={12} />
              Editar
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted hover:text-white"
              >
                <X size={12} />
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1 rounded-lg bg-emerald px-2.5 py-1 text-xs font-semibold text-background"
              >
                <Check size={12} />
                Salvar
              </button>
            </div>
          )}
        </div>

        {editing ? (
          <div className="space-y-4">
            <Field
              label="Telefone"
              value={form.phone}
              onChange={(v) => setForm((p) => ({ ...p, phone: applyPhoneMask(v) }))}
              inputMode="tel"
            />
            <Field
              label="E-mail"
              value={form.email}
              onChange={(v) => setForm((p) => ({ ...p, email: v }))}
              inputMode="email"
            />
            <Field
              label="Endereço completo"
              value={form.address}
              onChange={(v) => setForm((p) => ({ ...p, address: v }))}
            />
            <Field
              label="Cargo que exerce"
              value={form.occupation}
              onChange={(v) => setForm((p) => ({ ...p, occupation: v }))}
            />
            <Field
              label="Renda fixa mensal"
              value={form.monthlyIncome}
              onChange={(v) => setForm((p) => ({ ...p, monthlyIncome: applyCurrencyMask(v) }))}
              prefix="R$"
              inputMode="numeric"
            />
            <p className="text-[11px] leading-relaxed text-muted/70">
              Nome completo e CPF não podem ser alterados após a verificação de
              identidade. Para corrigi-los, fale com o suporte.
            </p>
          </div>
        ) : (
          <dl className="divide-y divide-line/70">
            <InfoRow icon={Phone} label="Telefone" value={profile.phone} />
            <InfoRow icon={Mail} label="E-mail" value={profile.email} />
            <InfoRow icon={MapPin} label="Endereço" value={profile.address} />
            <InfoRow icon={Briefcase} label="Cargo" value={profile.occupation} />
            <InfoRow
              icon={Wallet}
              label="Renda fixa mensal"
              value={formatBRL(profile.monthlyIncome)}
            />
          </dl>
        )}
      </section>

      {/* Segurança */}
      <section className="card mt-4">
        <h2 className="mb-1 text-sm font-semibold text-white">Segurança</h2>
        <div className="divide-y divide-line/70">
          <SettingRow label="Alterar senha" description="Última alteração há 3 meses" />
          <SettingRow
            label="Autenticação em dois fatores"
            description="Recomendado para operações de alto valor"
            badge="Inativo"
          />
          <SettingRow
            label="Dispositivos conectados"
            description="2 dispositivos com acesso ativo"
          />
        </div>
      </section>

      {/* Utilitário de demonstração — removível junto com a camada mock */}
      <section className="card mt-4 border-dashed">
        <h2 className="text-sm font-semibold text-white">Dados de demonstração</h2>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          Suas ações neste painel (Pix, boletos, cartões, empréstimos) ficam
          salvas neste navegador. Restaure os dados originais a qualquer momento.
        </p>
        <button
          onClick={resetDemoData}
          className="btn-secondary mt-4 w-full !py-2.5"
        >
          <RotateCcw size={15} />
          Restaurar dados originais
        </button>
      </section>

      <Link href="/" className="btn-secondary mt-4 w-full">
        <LogOut size={15} />
        Sair da conta
      </Link>
    </DashboardShell>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3.5">
      <dt className="flex shrink-0 items-center gap-2 text-xs text-muted">
        <Icon size={13} strokeWidth={1.7} />
        {label}
      </dt>
      <dd className="text-right text-sm leading-relaxed text-white/90">{value}</dd>
    </div>
  );
}

function SettingRow({
  label,
  description,
  badge,
}: {
  label: string;
  description: string;
  badge?: string;
}) {
  const toast = useToast();
  return (
    <button
      onClick={() => toast("Disponível na próxima versão do painel.")}
      className="flex w-full items-center justify-between gap-3 py-3.5 text-left"
    >
      <div className="min-w-0">
        <p className="text-sm text-white/90">{label}</p>
        <p className="mt-0.5 text-xs text-muted">{description}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {badge && (
          <span className="rounded-pill border border-line px-2 py-0.5 text-[10px] text-muted">
            {badge}
          </span>
        )}
        <ChevronRight size={16} className="text-muted" />
      </div>
    </button>
  );
}

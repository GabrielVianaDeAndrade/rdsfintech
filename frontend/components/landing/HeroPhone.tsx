"use client";

import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, Search, Bell } from "lucide-react";

/**
 * Mockup de iPhone flutuante com leve rotação/translação contínua (Framer Motion),
 * exibindo um recorte da interface da conta digital RDS Fintech.
 */
export function HeroPhone() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: -6 }}
      animate={{
        opacity: 1,
        y: [0, -18, 0],
        rotate: [-6, -3, -6],
      }}
      transition={{
        opacity: { duration: 0.8 },
        y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
      }}
      className="relative mx-auto w-[300px] select-none sm:w-[340px]"
    >
      {/* Glow de fundo */}
      <div className="absolute inset-0 -z-10 scale-110 rounded-[3rem] bg-emerald/20 blur-3xl" />

      {/* Corpo do iPhone */}
      <div className="relative rounded-[3rem] border-[6px] border-[#1c1f22] bg-black p-2 shadow-2xl">
        <div className="absolute left-1/2 top-2 z-10 h-6 w-28 -translate-x-1/2 rounded-full bg-black" />
        <div className="overflow-hidden rounded-[2.3rem] bg-background-surface">
          {/* Status bar */}
          <div className="flex items-center justify-between px-6 pb-1 pt-4 text-[11px] text-white">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <Search size={12} />
              <Bell size={12} />
            </div>
          </div>

          {/* Card de saldo */}
          <div className="mx-4 mt-3 rounded-2xl bg-gradient-to-br from-background-elevated to-black p-4">
            <p className="text-xs text-muted">Saldo em conta</p>
            <p className="mt-1 text-2xl font-semibold text-white">
              R$ 7.580,20
            </p>
            <div className="mt-4 flex gap-2">
              <span className="rounded-pill bg-emerald px-3 py-1.5 text-[11px] font-semibold text-background">
                Adicionar
              </span>
              <span className="rounded-pill border border-line px-3 py-1.5 text-[11px] text-white">
                Detalhes
              </span>
            </div>
          </div>

          {/* Banner */}
          <div className="mx-4 mt-3 flex items-center gap-3 rounded-2xl bg-azure-dim p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-azure/20">
              <ArrowUpRight size={14} className="text-azure-soft" />
            </div>
            <div className="text-[11px] leading-tight text-white/90">
              Sua conta está mais segura.
              <br />
              <span className="text-muted">Confira as novidades</span>
            </div>
          </div>

          {/* Atividade recente */}
          <div className="mx-4 mb-5 mt-3 rounded-2xl border border-line p-3">
            <p className="mb-2 text-[11px] font-medium text-muted">
              Atividade recente
            </p>
            <ActivityRow
              label="Pix recebido"
              value="+R$ 253,10"
              positive
            />
            <ActivityRow label="Apple Pay" value="-R$ 27,89" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ActivityRow({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-background-elevated">
          {positive ? (
            <ArrowDownLeft size={11} className="text-emerald-soft" />
          ) : (
            <ArrowUpRight size={11} className="text-muted" />
          )}
        </div>
        <span className="text-[11px] text-white/80">{label}</span>
      </div>
      <span
        className={
          positive
            ? "text-[11px] font-medium text-emerald-soft"
            : "text-[11px] font-medium text-white/70"
        }
      >
        {value}
      </span>
    </div>
  );
}

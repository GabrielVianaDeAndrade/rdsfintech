"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, Barcode, QrCode, Plus, CreditCard } from "lucide-react";

/**
 * Mockup de iPhone COMPLETO — moldura inteira sempre visível, sem corte pela
 * viewport. A proporção segue a de um iPhone real (~19.5:9) e escala por
 * breakpoint. A flutuação é sutil (translação vertical de poucos pixels) e
 * respeita `prefers-reduced-motion`.
 */
export function HeroPhone() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex justify-center"
    >
      {/* Halo duplo atrás do aparelho: esmeralda por baixo, azul deslocado —
          a sobreposição cria a borda de luz nas laterais do celular. */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -z-10 h-[80%] w-[80%] -translate-x-[58%] -translate-y-1/2 rounded-full bg-emerald/25 blur-[70px]"
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -z-10 h-[75%] w-[75%] -translate-x-[38%] -translate-y-[45%] rounded-full bg-azure/25 blur-[70px]"
      />

      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-[248px] shrink-0 sm:w-[272px] lg:w-[292px]"
      >
        {/* Moldura do aparelho — o ring translúcido pega a luz dos halos */}
        <div className="relative aspect-[9/19.5] w-full rounded-[2.6rem] bg-gradient-to-b from-[#2a2f34] to-[#141719] p-[3px] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.9),0_0_50px_-12px_rgba(0,200,150,0.35)] ring-1 ring-white/10">
          {/* Botões laterais */}
          <span aria-hidden className="absolute -left-[2px] top-[19%] h-9 w-[2px] rounded-l bg-[#3a4045]" />
          <span aria-hidden className="absolute -left-[2px] top-[27%] h-14 w-[2px] rounded-l bg-[#3a4045]" />
          <span aria-hidden className="absolute -right-[2px] top-[24%] h-16 w-[2px] rounded-r bg-[#3a4045]" />

          <div className="relative h-full w-full overflow-hidden rounded-[2.45rem] bg-[#08090a]">
            {/* Dynamic island */}
            <div
              aria-hidden
              className="absolute left-1/2 top-[9px] z-20 h-[22px] w-[76px] -translate-x-1/2 rounded-full bg-black"
            />

            <div className="flex h-full flex-col">
              {/* Status bar */}
              <div className="flex items-center justify-between px-5 pb-1 pt-3 text-[10px] font-medium text-white">
                <span>9:41</span>
                <div className="flex items-center gap-[3px]">
                  <SignalIcon />
                  <BatteryIcon />
                </div>
              </div>

              {/* Conteúdo da tela */}
              <div className="flex-1 overflow-hidden px-3 pt-2">
                <div className="mb-2.5 flex items-center justify-between px-1">
                  <div>
                    <p className="text-[9px] text-white/40">Boa tarde,</p>
                    <p className="text-[11px] font-semibold text-white">Maria</p>
                  </div>
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-emerald/70 to-azure/70" />
                </div>

                {/* Saldo */}
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3">
                  <p className="text-[9px] text-white/40">Saldo disponível</p>
                  <p className="mt-0.5 text-[19px] font-semibold tracking-tight text-white">
                    R$ 7.580,20
                  </p>
                  <div className="mt-2.5 flex gap-1.5">
                    <span className="flex items-center gap-1 rounded-lg bg-emerald px-2 py-1 text-[8px] font-semibold text-background">
                      <Plus size={8} strokeWidth={3} /> Adicionar
                    </span>
                    <span className="rounded-lg border border-white/10 px-2 py-1 text-[8px] text-white/80">
                      Transferir
                    </span>
                  </div>
                </div>

                {/* Atalhos */}
                <div className="mt-2.5 grid grid-cols-4 gap-1.5">
                  {[
                    { Icon: QrCode, label: "Pix" },
                    { Icon: Barcode, label: "Boleto" },
                    { Icon: CreditCard, label: "Cartão" },
                    { Icon: ArrowUpRight, label: "Enviar" },
                  ].map(({ Icon, label }) => (
                    <div
                      key={label}
                      className="flex flex-col items-center gap-1 rounded-xl border border-white/[0.06] py-2"
                    >
                      <Icon size={11} className="text-white/70" strokeWidth={1.75} />
                      <span className="text-[7px] text-white/50">{label}</span>
                    </div>
                  ))}
                </div>

                {/* Atividade */}
                <div className="mt-2.5 rounded-2xl border border-white/[0.06] p-2.5">
                  <p className="mb-1.5 text-[8px] font-medium text-white/40">
                    Atividade recente
                  </p>
                  <PhoneRow label="Pix recebido" sub="João P." value="+R$ 253,10" positive />
                  <PhoneRow label="Apple Pay" sub="Hoje" value="-R$ 27,89" />
                  <PhoneRow label="Enel Energia" sub="Boleto" value="-R$ 184,32" />
                </div>
              </div>

              {/* Tab bar */}
              <div className="mt-auto flex items-center justify-around border-t border-white/[0.06] px-3 pb-3 pt-2">
                {["Início", "Pix", "Cartão", "Perfil"].map((t, i) => (
                  <span
                    key={t}
                    className={
                      i === 0
                        ? "text-[7px] font-medium text-emerald"
                        : "text-[7px] text-white/30"
                    }
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Home indicator */}
              <div aria-hidden className="mx-auto mb-1.5 h-[3px] w-24 rounded-full bg-white/25" />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function PhoneRow({
  label,
  sub,
  value,
  positive,
}: {
  label: string;
  sub: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-[5px]">
      <div className="flex items-center gap-1.5">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/[0.06]">
          {positive ? (
            <ArrowDownLeft size={8} className="text-emerald" strokeWidth={2.5} />
          ) : (
            <ArrowUpRight size={8} className="text-white/40" strokeWidth={2.5} />
          )}
        </div>
        <div>
          <p className="text-[8px] leading-tight text-white/80">{label}</p>
          <p className="text-[7px] leading-tight text-white/35">{sub}</p>
        </div>
      </div>
      <span
        className={
          positive
            ? "text-[8px] font-semibold text-emerald"
            : "text-[8px] font-medium text-white/60"
        }
      >
        {value}
      </span>
    </div>
  );
}

function SignalIcon() {
  return (
    <svg width="12" height="8" viewBox="0 0 16 11" fill="none" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={i * 4}
          y={8 - i * 2.4}
          width="2.5"
          height={3 + i * 2.4}
          rx="0.7"
          fill="white"
          opacity={i === 3 ? 0.4 : 1}
        />
      ))}
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="16" height="8" viewBox="0 0 22 11" fill="none" aria-hidden>
      <rect x="0.5" y="0.5" width="18" height="10" rx="2.5" stroke="white" strokeOpacity="0.4" />
      <rect x="2" y="2" width="13" height="7" rx="1.5" fill="white" />
      <path d="M20.5 4v3a2 2 0 0 0 0-3Z" fill="white" fillOpacity="0.4" />
    </svg>
  );
}

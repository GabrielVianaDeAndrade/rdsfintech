"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";
import { HeroPhone } from "./HeroPhone";
import { AmbientLights } from "./AmbientLights";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <AmbientLights />

      <div className="section grid items-center gap-12 pb-16 pt-12 sm:pb-20 sm:pt-16 lg:grid-cols-[1fr_auto] lg:gap-16 lg:pb-28 lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl text-center lg:text-left"
        >
          <span className="inline-flex items-center gap-2 rounded-pill border border-line px-3.5 py-1.5 text-xs text-muted">
            <Lock size={12} className="text-emerald" />
            Criptografia de ponta a ponta em cada transação
          </span>

          <h1 className="mt-6 text-[2.1rem] font-semibold leading-[1.1] tracking-[-0.02em] text-white sm:text-5xl lg:text-[3.4rem]">
            Controle total das suas finanças, com a seriedade que seu dinheiro exige
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-muted sm:text-base lg:mx-0">
            Conta digital, Pix, boletos e crédito em uma única plataforma. Sem
            taxa escondida, sem letra miúda — cada custo é apresentado antes de
            você decidir.
          </p>

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
            <Link href="/cadastro" className="btn-primary">
              Abrir minha conta
              <ArrowRight size={16} />
            </Link>
            <Link href="/simulacao" className="btn-secondary">
              Simular empréstimo
            </Link>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-line pt-6 text-center lg:text-left">
            {[
              { value: "R$ 0", label: "Anuidade e manutenção" },
              { value: "1,89%", label: "Taxa a.m. a partir de" },
              { value: "24/7", label: "Monitoramento antifraude" },
            ].map((s) => (
              <div key={s.label}>
                <dt className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                  {s.value}
                </dt>
                <dd className="mt-1 text-[11px] leading-tight text-muted sm:text-xs">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <div className="flex justify-center lg:justify-end">
          <HeroPhone />
        </div>
      </div>
    </section>
  );
}

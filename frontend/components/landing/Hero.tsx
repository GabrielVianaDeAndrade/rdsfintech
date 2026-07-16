"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { HeroPhone } from "./HeroPhone";

export function Hero({ onOpenSignup }: { onOpenSignup: () => void }) {
  return (
    <section className="relative overflow-hidden bg-grid-fade pb-10 pt-16 sm:pt-24">
      <div className="section grid items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="mb-5 inline-flex items-center gap-2 rounded-pill border border-emerald/30 bg-emerald-dim px-4 py-1.5 text-xs font-medium text-emerald-soft">
            <ShieldCheck size={14} />
            Segurança e confidencialidade em primeiro lugar
          </span>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Descubra a liberdade do{" "}
            <span className="bg-gradient-to-r from-emerald to-azure bg-clip-text text-transparent">
              banking digital
            </span>
          </h1>

          <p className="mt-6 max-w-md text-base text-muted">
            Uma conta para todos os seus pagamentos. Envie dinheiro para
            amigos e família com a RDS Fintech, sempre gratuito — com
            criptografia de ponta a ponta em cada transação.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button onClick={onOpenSignup} className="btn-primary">
              Simular empréstimo
              <ArrowRight size={16} />
            </button>
            <button className="btn-secondary">Abrir minha conta</button>
          </div>
        </motion.div>

        <div className="relative flex justify-center lg:justify-end">
          <HeroPhone />
        </div>
      </div>
    </section>
  );
}

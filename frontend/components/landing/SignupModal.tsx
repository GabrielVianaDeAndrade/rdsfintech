"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { KycForm } from "./KycForm";

export function SignupModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [done, setDone] = useState(false);

  function handleClose() {
    onClose();
    setTimeout(() => setDone(false), 300);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="card w-full max-w-md border-line bg-background-surface p-6 sm:p-8"
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {done ? "Conta criada!" : "Abra sua conta RDS Fintech"}
                </h3>
                {!done && (
                  <p className="mt-1 text-sm text-muted">
                    Precisamos confirmar sua identidade para continuar (KYC).
                  </p>
                )}
              </div>
              <button
                onClick={handleClose}
                className="text-muted hover:text-white"
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>

            {done ? (
              <div className="flex flex-col items-center py-6 text-center">
                <CheckCircle2 size={40} className="mb-4 text-emerald-soft" />
                <p className="text-sm text-muted">
                  Seus dados foram enviados para análise. Em instantes você
                  poderá acessar seu painel e concluir a contratação do
                  empréstimo.
                </p>
                <a href="/dashboard" className="btn-primary mt-6 w-full">
                  Ir para o painel
                </a>
              </div>
            ) : (
              <KycForm onSubmitted={() => setDone(true)} />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { randomId } from "@/lib/utils";

interface ToastItem {
  id: string;
  message: string;
  kind: "success" | "error";
}

const ToastContext = createContext<{
  toast: (message: string, kind?: "success" | "error") => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, kind: "success" | "error" = "success") => {
    const id = randomId();
    setItems((prev) => [...prev, { id, message, kind }]);
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[200] flex flex-col items-center gap-2 px-4 sm:bottom-6">
        <AnimatePresence>
          {items.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-line bg-background-elevated px-4 py-3 shadow-card"
            >
              {t.kind === "success" ? (
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald" />
              ) : (
                <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-400" />
              )}
              <p className="flex-1 text-sm text-white/90">{t.message}</p>
              <button
                onClick={() => setItems((prev) => prev.filter((i) => i.id !== t.id))}
                className="text-muted hover:text-white"
                aria-label="Fechar aviso"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast deve ser usado dentro de <ToastProvider>");
  return ctx.toast;
}

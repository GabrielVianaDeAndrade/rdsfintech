"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

/**
 * Botão de voltar presente em todas as páginas internas.
 * Usa o histórico do browser quando possível; `fallbackHref` cobre o caso
 * de acesso direto à URL (sem histórico), evitando um voltar que sai do app.
 */
export function BackButton({
  label = "Voltar",
  fallbackHref = "/dashboard",
}: {
  label?: string;
  fallbackHref?: string;
}) {
  const router = useRouter();

  function handleBack() {
    if (window.history.length > 1) router.back();
    else router.push(fallbackHref);
  }

  return (
    <button
      onClick={handleBack}
      className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-white"
      aria-label={label}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition-colors group-hover:border-white/30">
        <ArrowLeft size={16} />
      </span>
      {label}
    </button>
  );
}

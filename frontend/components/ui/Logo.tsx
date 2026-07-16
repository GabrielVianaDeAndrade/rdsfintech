/**
 * Marca RDS Fintech — monograma geométrico em branco, fixado no topo.
 * Sem gradiente: a marca precisa funcionar em preto, branco e monocromático.
 */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden>
        <rect x="1" y="1" width="30" height="30" rx="9" stroke="white" strokeWidth="1.6" />
        <path
          d="M11 22V10h5.6a3.7 3.7 0 0 1 0 7.4H11"
          stroke="white"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="m16.4 17.4 4.6 4.6" stroke="white" strokeWidth="1.9" strokeLinecap="round" />
      </svg>
      {!compact && (
        <span className="text-[15px] font-semibold tracking-tight text-white">
          RDS Fintech
        </span>
      )}
    </span>
  );
}

/**
 * Camada de luzes ambientes da primeira dobra.
 *
 * Puro CSS (keyframes em globals.css) em vez de Framer Motion: são elementos
 * grandes e desfocados, e animar só transform/opacity mantém tudo na GPU.
 * Fica atrás do conteúdo, sem capturar clique, e é invisível a leitores de
 * tela — é decoração, não informação.
 */
export function AmbientLights() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Esmeralda — atrás do título */}
      <div className="light-blob light-emerald left-[-18%] top-[-22%] h-[520px] w-[520px] md:left-[-8%] md:h-[680px] md:w-[680px]" />

      {/* Azul — atrás do aparelho */}
      <div className="light-blob light-azure right-[-24%] top-[8%] h-[480px] w-[480px] md:right-[-6%] md:h-[620px] md:w-[620px]" />

      {/* Esmeralda secundária, mais baixa — dá profundidade */}
      <div className="light-blob light-emerald bottom-[-30%] left-[35%] hidden h-[420px] w-[420px] opacity-70 lg:block" />

      {/* Faixa de luz cruzando o topo */}
      <div className="absolute inset-x-0 top-0 h-px overflow-hidden">
        <div className="light-sweep h-px w-full bg-gradient-to-r from-transparent via-emerald to-transparent" />
      </div>

      {/* Véu escuro: mantém o texto legível sobre as luzes */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/40 to-background" />
    </div>
  );
}

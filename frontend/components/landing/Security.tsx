const ITEMS = [
  {
    title: "Criptografia de ponta a ponta",
    description:
      "Dados pessoais são cifrados com AES-256-GCM na camada de aplicação, antes mesmo de chegarem ao banco de dados. Nem um acesso indevido à base os revelaria.",
  },
  {
    title: "Confidencialidade por padrão",
    description:
      "Registros internos são ofuscados automaticamente: CPF, renda e credenciais nunca aparecem em texto claro em nenhum log do sistema.",
  },
  {
    title: "Sessões de curta duração",
    description:
      "Tokens de acesso expiram em 10 minutos e a renovação usa cookies inacessíveis a scripts, reduzindo a janela de exploração em caso de vazamento.",
  },
  {
    title: "Infraestrutura isolada",
    description:
      "Os servidores operam em rede privada, sem exposição direta à internet, com limites rígidos de requisição em todas as rotas transacionais.",
  },
];

export function Security() {
  return (
    <section id="seguranca" className="border-t border-line bg-background-surface/40">
      <div className="section py-16 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <span className="label-xs">Segurança</span>
            <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">
              Rigor de instituição financeira regulada
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Tratamos dados financeiros com o mesmo nível de exigência aplicado
              a bancos tradicionais — e documentamos publicamente cada medida.
            </p>
          </div>

          <dl className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
            {ITEMS.map((item, i) => (
              <div key={item.title}>
                <span className="text-xs font-medium tabular-nums text-emerald">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <dt className="mb-2 mt-2 text-[15px] font-semibold text-white">
                  {item.title}
                </dt>
                <dd className="text-sm leading-relaxed text-muted">{item.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

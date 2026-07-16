import { Lock, ShieldCheck, Zap, EyeOff } from "lucide-react";

const ITEMS = [
  {
    icon: Lock,
    title: "Criptografia de ponta a ponta",
    description:
      "Seus dados financeiros são cifrados em trânsito e em repouso, do seu dispositivo até nossos servidores.",
  },
  {
    icon: ShieldCheck,
    title: "Confidencialidade garantida",
    description:
      "Nenhum dado sensível é compartilhado sem sua autorização explícita. Você está no controle.",
  },
  {
    icon: Zap,
    title: "Transações instantâneas",
    description:
      "PIX, boletos e transferências processados em segundos, com monitoramento antifraude em tempo real.",
  },
  {
    icon: EyeOff,
    title: "Privacidade por padrão",
    description:
      "Logs de sistema ofuscados e acesso segmentado — sua identidade nunca fica exposta internamente.",
  },
];

export function ValueProps() {
  return (
    <section className="section py-20 sm:py-28">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Segurança que você pode sentir
        </h2>
        <p className="mt-4 text-muted">
          Construímos a RDS Fintech com o mesmo rigor de segurança de
          instituições financeiras reguladas — sem abrir mão da simplicidade.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, title, description }) => (
          <div key={title} className="card">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-dim">
              <Icon size={20} className="text-emerald-soft" />
            </div>
            <h3 className="mb-2 text-sm font-semibold text-white">
              {title}
            </h3>
            <p className="text-sm leading-relaxed text-muted">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

import Link from "next/link";
import { QrCode, Barcode, CreditCard, HandCoins, ArrowRight } from "lucide-react";

const PRODUCTS = [
  {
    icon: QrCode,
    title: "Pix",
    description:
      "Envie e receba em segundos, 24 horas por dia. Cadastre até cinco chaves e gere cobranças por QR Code.",
  },
  {
    icon: Barcode,
    title: "Boletos",
    description:
      "Pague qualquer boleto pela linha digitável e emita cobranças para seus clientes sem custo por emissão.",
  },
  {
    icon: CreditCard,
    title: "Cartões",
    description:
      "Cartão físico sem anuidade e cartões virtuais ilimitados, com limite e bloqueio ajustáveis a qualquer momento.",
  },
  {
    icon: HandCoins,
    title: "Crédito",
    description:
      "Empréstimo com prazo definido por você e o Custo Efetivo Total exibido antes da contratação.",
  },
];

export function Products() {
  return (
    <section id="produtos" className="section border-t border-line py-16 sm:py-24">
      <div className="mb-10 flex flex-col gap-4 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-lg">
          <span className="label-xs">Produtos</span>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Tudo que sua conta precisa, sem custo escondido
          </h2>
        </div>
        <Link
          href="/cadastro"
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-emerald hover:text-emerald-soft"
        >
          Abrir conta gratuita
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PRODUCTS.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="card transition-colors duration-200 hover:border-white/15"
          >
            <span className="icon-tile">
              <Icon size={17} strokeWidth={1.6} />
            </span>
            <h3 className="mb-2 mt-4 text-[15px] font-semibold text-white">{title}</h3>
            <p className="text-sm leading-relaxed text-muted">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

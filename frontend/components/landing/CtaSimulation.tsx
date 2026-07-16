import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CtaSimulation() {
  return (
    <section className="section pb-16 sm:pb-24">
      <div className="overflow-hidden rounded-card border border-line bg-background-surface">
        <div className="grid items-center gap-8 p-8 sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12 lg:p-12">
          <div>
            <span className="label-xs">Crédito</span>
            <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">
              Simule seu empréstimo com o prazo que fizer sentido para você
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
              Escolha exatamente em quantos meses quer pagar — de 1 a 60. Você
              vê a parcela, a taxa e o Custo Efetivo Total antes de decidir, sem
              compromisso.
            </p>
            <Link href="/simulacao" className="btn-primary mt-7">
              Simular agora
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="rounded-2xl border border-line bg-background p-6">
            <p className="text-xs text-muted">Exemplo — R$ 8.000 em 24x</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-emerald">
              R$ 446,81
            </p>
            <p className="mt-1 text-xs text-muted">por mês</p>
            <dl className="mt-5 space-y-2.5 border-t border-line pt-5 text-xs">
              <div className="flex justify-between">
                <dt className="text-muted">Taxa</dt>
                <dd className="tabular-nums text-white/85">2,32% a.m.</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">CET</dt>
                <dd className="tabular-nums text-white/85">33,8% a.a.</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

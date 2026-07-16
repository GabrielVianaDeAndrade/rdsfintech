import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="section py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-3 text-xs leading-relaxed text-muted">
              RDS Fintech — plataforma de serviços financeiros digitais.
              Operação de pagamentos e crédito processada por instituição
              parceira autorizada pelo Banco Central.
            </p>
          </div>

          <div className="flex gap-10 sm:gap-14">
            <div className="flex flex-col gap-2.5">
              <span className="label-xs">Produtos</span>
              <Link href="#produtos" className="text-xs text-muted hover:text-white">
                Conta digital
              </Link>
              <Link href="/simulacao" className="text-xs text-muted hover:text-white">
                Empréstimo
              </Link>
            </div>
            <div className="flex flex-col gap-2.5">
              <span className="label-xs">Institucional</span>
              <Link href="#seguranca" className="text-xs text-muted hover:text-white">
                Segurança
              </Link>
              <Link href="#" className="text-xs text-muted hover:text-white">
                Privacidade
              </Link>
              <Link href="#" className="text-xs text-muted hover:text-white">
                Termos de uso
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-line pt-6">
          <p className="text-xs text-muted/70">
            © {new Date().getFullYear()} RDS Fintech. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

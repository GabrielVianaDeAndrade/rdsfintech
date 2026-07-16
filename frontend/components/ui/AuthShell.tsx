import Link from "next/link";
import { Logo } from "./Logo";
import { BackButton } from "./BackButton";

/**
 * Moldura das páginas de autenticação (/login, /cadastro, /simulacao).
 * Sempre com botão de voltar, conforme padrão de navegação do produto.
 */
export function AuthShell({
  title,
  subtitle,
  children,
  backHref = "/",
  backLabel = "Voltar",
  footer,
  wide,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  footer?: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line/70">
        <div className="section flex h-16 items-center justify-between">
          <BackButton label={backLabel} fallbackHref={backHref} />
          <Link href="/" aria-label="RDS Fintech — início">
            <Logo compact />
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-start justify-center px-5 py-10 sm:items-center sm:py-14">
        <div className={wide ? "w-full max-w-2xl" : "w-full max-w-md"}>
          <div className="mb-7">
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-[28px]">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-sm leading-relaxed text-muted">{subtitle}</p>
            )}
          </div>

          {children}

          {footer && <div className="mt-6">{footer}</div>}
        </div>
      </main>
    </div>
  );
}

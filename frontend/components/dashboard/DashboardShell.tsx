"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Home, QrCode, Barcode, CreditCard, HandCoins, User } from "lucide-react";
import { useApp } from "@/lib/store";
import { Logo } from "@/components/ui/Logo";
import { BackButton } from "@/components/ui/BackButton";

const NAV = [
  { icon: Home, label: "Início", href: "/dashboard" },
  { icon: QrCode, label: "Pix", href: "/dashboard/pix" },
  { icon: Barcode, label: "Boleto", href: "/dashboard/boleto" },
  { icon: CreditCard, label: "Cartão", href: "/dashboard/cartao" },
  { icon: HandCoins, label: "Crédito", href: "/dashboard/emprestimo" },
  { icon: User, label: "Perfil", href: "/dashboard/perfil" },
];

/**
 * Moldura do painel: navegação lateral (desktop) / inferior (mobile),
 * sininho de notificações com contador de não-lidas e botão de voltar
 * presente em todas as páginas internas.
 */
export function DashboardShell({
  title,
  subtitle,
  showBack = true,
  backHref = "/dashboard",
  children,
}: {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  backHref?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { unreadCount } = useApp();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Nav desktop */}
      <aside className="sticky top-0 hidden h-screen w-[68px] shrink-0 flex-col items-center gap-8 border-r border-line/70 py-6 lg:flex xl:w-56 xl:items-start xl:px-4">
        <Link href="/dashboard" className="xl:px-2" aria-label="RDS Fintech — início">
          <span className="xl:hidden">
            <Logo compact />
          </span>
          <span className="hidden xl:block">
            <Logo />
          </span>
        </Link>

        <nav className="flex w-full flex-1 flex-col items-center gap-1 xl:items-stretch">
          {NAV.map(({ icon: Icon, label, href }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                title={label}
                className={`flex h-11 items-center gap-3 rounded-xl px-3 transition-colors xl:w-full ${
                  active
                    ? "bg-white/[0.06] text-emerald"
                    : "text-muted hover:bg-white/[0.03] hover:text-white"
                } ${"w-11 justify-center xl:w-full xl:justify-start"}`}
              >
                <Icon size={19} strokeWidth={1.7} />
                <span className="hidden text-sm font-medium xl:inline">{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col pb-20 lg:pb-0">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-line/70 bg-background/85 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-4">
              {showBack && pathname !== "/dashboard" && (
                <BackButton label="" fallbackHref={backHref} />
              )}
              <div className="min-w-0">
                <h1 className="truncate text-base font-semibold text-white sm:text-lg">
                  {title}
                </h1>
                {subtitle && (
                  <p className="truncate text-xs text-muted">{subtitle}</p>
                )}
              </div>
            </div>

            <NotificationBell count={unreadCount} />
          </div>
        </header>

        <main className="flex-1 px-5 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>

      {/* Nav mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 border-t border-line/70 bg-background-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        {NAV.map(({ icon: Icon, label, href }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 py-2.5 transition-colors ${
                active ? "text-emerald" : "text-muted"
              }`}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span className="text-[9px] font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function NotificationBell({ count }: { count: number }) {
  return (
    <Link
      href="/dashboard/notificacoes"
      className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-white/25 hover:text-white"
      aria-label={
        count > 0 ? `Notificações — ${count} não lidas` : "Notificações"
      }
    >
      <Bell size={17} strokeWidth={1.8} />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-emerald px-1 text-[10px] font-bold tabular-nums text-background">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}

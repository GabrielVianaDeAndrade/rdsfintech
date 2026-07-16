"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

const NAV_ITEMS = [
  { label: "Conta", href: "#produtos" },
  { label: "Crédito", href: "/simulacao" },
  { label: "Segurança", href: "#seguranca" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-background/85 backdrop-blur-md">
      <div className="section flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5" aria-label="RDS Fintech — início">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm text-muted transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/login" className="btn-ghost">
            Entrar
          </Link>
          <Link href="/cadastro" className="btn-primary !px-5 !py-2">
            Abrir conta
          </Link>
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line/70 bg-background md:hidden">
          <nav className="section flex flex-col gap-1 py-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 text-sm text-muted hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/login" onClick={() => setOpen(false)} className="btn-secondary">
                Entrar
              </Link>
              <Link href="/cadastro" onClick={() => setOpen(false)} className="btn-primary">
                Abrir conta
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

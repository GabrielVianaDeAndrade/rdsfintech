"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = ["Home", "Feature", "Product", "Resources", "Community"];

export function Header({ onOpenSignup }: { onOpenSignup: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-background/80 backdrop-blur-md">
      <div className="section flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <LogoMark />
          <span className="text-lg font-semibold tracking-tight text-white">
            RDS Fintech
          </span>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm text-muted transition-colors hover:text-white"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button className="rounded-pill px-4 py-2 text-sm font-medium text-white hover:text-emerald-soft">
            Sign in
          </button>
          <button onClick={onOpenSignup} className="btn-primary !py-2">
            Sign up
          </button>
        </div>

        <button
          className="text-white md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Abrir menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-line/60 px-6 pb-6 md:hidden">
          <nav className="flex flex-col gap-4 pt-4">
            {NAV_ITEMS.map((item) => (
              <a key={item} href="#" className="text-sm text-muted">
                {item}
              </a>
            ))}
            <button onClick={onOpenSignup} className="btn-primary mt-2">
              Sign up
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

function LogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="13" stroke="white" strokeWidth="2" />
      <path
        d="M14 7c-3.5 0-6 2.5-6 6s2.5 6 6 6"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

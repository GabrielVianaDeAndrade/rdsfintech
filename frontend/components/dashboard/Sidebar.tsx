"use client";

import { Home, QrCode, FileText, HandCoins, User } from "lucide-react";

const NAV = [
  { icon: Home, label: "Início" },
  { icon: QrCode, label: "Pix" },
  { icon: FileText, label: "Boletos" },
  { icon: HandCoins, label: "Empréstimo" },
  { icon: User, label: "Perfil" },
];

export function Sidebar() {
  return (
    <>
      {/* Desktop */}
      <aside className="sticky top-0 hidden h-screen w-20 flex-col items-center gap-8 border-r border-line/60 bg-background-surface py-8 lg:flex">
        <LogoMark />
        <nav className="flex flex-1 flex-col items-center gap-6">
          {NAV.map(({ icon: Icon, label }, i) => (
            <button
              key={label}
              className={
                i === 0
                  ? "flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-dim text-emerald-soft"
                  : "flex h-11 w-11 items-center justify-center rounded-2xl text-muted hover:bg-background-elevated hover:text-white"
              }
              title={label}
            >
              <Icon size={20} />
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-line/60 bg-background-surface/95 py-2 backdrop-blur lg:hidden">
        {NAV.map(({ icon: Icon, label }, i) => (
          <button
            key={label}
            className={
              i === 0
                ? "flex flex-col items-center gap-1 px-3 py-1 text-emerald-soft"
                : "flex flex-col items-center gap-1 px-3 py-1 text-muted"
            }
          >
            <Icon size={20} />
            <span className="text-[10px]">{label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}

function LogoMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
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

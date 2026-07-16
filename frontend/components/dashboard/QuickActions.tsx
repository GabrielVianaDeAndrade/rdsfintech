import { QrCode, FileText, HandCoins, CreditCard } from "lucide-react";

const ACTIONS = [
  { icon: QrCode, label: "Pix" },
  { icon: FileText, label: "Boleto" },
  { icon: HandCoins, label: "Empréstimo" },
  { icon: CreditCard, label: "Cartão" },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {ACTIONS.map(({ icon: Icon, label }) => (
        <button
          key={label}
          className="card flex flex-col items-center gap-2 !p-4 transition-colors hover:border-emerald/40"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-dim">
            <Icon size={18} className="text-emerald-soft" />
          </div>
          <span className="text-xs text-white">{label}</span>
        </button>
      ))}
    </div>
  );
}

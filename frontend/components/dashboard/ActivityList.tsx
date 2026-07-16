import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { formatBRL } from "@/lib/utils";

const ACTIVITY = [
  { label: "Pix recebido — João P.", value: 253.1, positive: true },
  { label: "Apple Pay", value: -27.89 },
  { label: "Boleto — Energia", value: -184.32 },
  { label: "Pix enviado — Ana C.", value: -60 },
];

export function ActivityList() {
  return (
    <div className="card">
      <h3 className="mb-4 text-sm font-semibold text-white">
        Atividade recente
      </h3>
      <div className="divide-y divide-line">
        {ACTIVITY.map((item) => (
          <div key={item.label} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-background-elevated">
                {item.value > 0 ? (
                  <ArrowDownLeft size={15} className="text-emerald-soft" />
                ) : (
                  <ArrowUpRight size={15} className="text-muted" />
                )}
              </div>
              <span className="text-sm text-white/90">{item.label}</span>
            </div>
            <span
              className={
                item.value > 0
                  ? "text-sm font-medium text-emerald-soft"
                  : "text-sm font-medium text-white/70"
              }
            >
              {item.value > 0 ? "+" : "-"}
              {formatBRL(Math.abs(item.value))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { BalanceCard } from "./BalanceCard";
import { QuickActions } from "./QuickActions";
import { ActivityList } from "./ActivityList";
import { PixCard, PixSheet } from "./PixModule";
import { BoletoCard, BoletoSheet } from "./BoletoModule";
import { LoanCard, LoanSheet } from "./LoanModule";

type ActiveSheet = "pix" | "boleto" | "loan" | null;

export function DashboardClient() {
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>(null);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 pb-24 lg:pb-0">
        <header className="section flex items-center justify-between py-6">
          <div>
            <p className="text-sm text-muted">Boa tarde,</p>
            <h1 className="text-xl font-semibold text-white">Maria Santos</h1>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted hover:text-white">
            <Bell size={18} />
          </button>
        </header>

        <main className="section grid gap-5 pb-10 lg:grid-cols-3">
          <div className="lg:col-span-2 lg:row-span-2">
            <BalanceCard />
          </div>

          <div className="lg:col-span-1">
            <QuickActions />
          </div>

          <PixCard onOpen={() => setActiveSheet("pix")} />
          <BoletoCard onOpen={() => setActiveSheet("boleto")} />
          <LoanCard onOpen={() => setActiveSheet("loan")} />

          <div className="lg:col-span-3">
            <ActivityList />
          </div>
        </main>
      </div>

      <PixSheet open={activeSheet === "pix"} onClose={() => setActiveSheet(null)} />
      <BoletoSheet open={activeSheet === "boleto"} onClose={() => setActiveSheet(null)} />
      <LoanSheet open={activeSheet === "loan"} onClose={() => setActiveSheet(null)} />
    </div>
  );
}

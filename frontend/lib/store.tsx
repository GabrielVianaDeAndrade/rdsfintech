"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type {
  AppNotification,
  Boleto,
  Card,
  Loan,
  PixKey,
  PixKeyType,
  Profile,
  Transaction,
} from "./types";
import { generateBarcode, quoteLoan, randomId } from "./utils";

/**
 * Camada de estado da conta digital.
 *
 * IMPORTANTE: os dados aqui são FICTÍCIOS e vivem apenas em memória no
 * browser, para que toda a interface seja navegável e testável antes da
 * integração com o provedor BaaS. Cada ação abaixo tem um equivalente já
 * mapeado no backend (ver backend/src/routes) — quando a API entrar, o corpo
 * destas funções passa a ser uma chamada fetch, e os componentes não mudam.
 */

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function daysAhead(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

const SEED_PROFILE: Profile = {
  fullName: "Maria Santos Oliveira",
  cpf: "312.456.789-01",
  phone: "(11) 98234-5671",
  email: "maria.oliveira@email.com",
  address: "Rua das Laranjeiras, 240, apto 82 — Pinheiros, São Paulo - SP, 05422-000",
  occupation: "Analista Financeira Sênior",
  monthlyIncome: 9400,
  agency: "0001",
  accountNumber: "84512-3",
  memberSince: "2024-03-18",
};

const SEED_TRANSACTIONS: Transaction[] = [
  { id: randomId(), type: "pix_in", label: "Pix recebido — João Pereira", amount: 253.1, createdAt: daysAgo(0), status: "completed" },
  { id: randomId(), type: "card_purchase", label: "Apple Pay", amount: -27.89, createdAt: daysAgo(1), status: "completed" },
  { id: randomId(), type: "boleto_paid", label: "Boleto — Enel Energia", amount: -184.32, createdAt: daysAgo(2), status: "completed" },
  { id: randomId(), type: "pix_out", label: "Pix enviado — Ana Carolina", amount: -60, createdAt: daysAgo(3), status: "completed" },
  { id: randomId(), type: "deposit", label: "Salário — Consultoria RM", amount: 9400, createdAt: daysAgo(5), status: "completed" },
  { id: randomId(), type: "card_purchase", label: "Mercado Pinheiros", amount: -312.44, createdAt: daysAgo(6), status: "completed" },
  { id: randomId(), type: "pix_out", label: "Pix enviado — Aluguel", amount: -2400, createdAt: daysAgo(8), status: "completed" },
];

const SEED_PIX_KEYS: PixKey[] = [
  { id: randomId(), type: "cpf", value: "312.456.789-01", createdAt: daysAgo(400) },
  { id: randomId(), type: "email", value: "maria.oliveira@email.com", createdAt: daysAgo(320) },
];

const SEED_BOLETOS: Boleto[] = [
  { id: randomId(), direction: "paid", description: "Enel Energia — Fatura maio", amount: 184.32, dueDate: daysAhead(-2), barcode: generateBarcode(), status: "paid", createdAt: daysAgo(2) },
  { id: randomId(), direction: "issued", description: "Consultoria — Cliente Delta", amount: 1800, dueDate: daysAhead(9), barcode: generateBarcode(), status: "open", payerName: "Delta Comércio LTDA", createdAt: daysAgo(4) },
];

const SEED_CARDS: Card[] = [
  { id: randomId(), kind: "physical", label: "Cartão físico", last4: "4417", holder: "MARIA S OLIVEIRA", expiry: "09/29", cvv: "412", brand: "Mastercard", blocked: false, limit: 8000, used: 1340.33 },
  { id: randomId(), kind: "virtual", label: "Virtual — Assinaturas", last4: "8823", holder: "MARIA S OLIVEIRA", expiry: "04/31", cvv: "907", brand: "Mastercard", blocked: false, limit: 2000, used: 127.89 },
];

const SEED_NOTIFICATIONS: AppNotification[] = [
  { id: randomId(), title: "Pix recebido", message: "Você recebeu R$ 253,10 de João Pereira.", createdAt: daysAgo(0), read: false, kind: "transaction" },
  { id: randomId(), title: "Novo acesso detectado", message: "Login realizado em Chrome • São Paulo, SP. Se não foi você, revise sua segurança.", createdAt: daysAgo(1), read: false, kind: "security" },
  { id: randomId(), title: "Boleto disponível", message: "Seu boleto para Delta Comércio LTDA foi emitido e está aguardando pagamento.", createdAt: daysAgo(4), read: true, kind: "info" },
];

const SEED_LOANS: Loan[] = [];

const STORAGE_PREFIX = "rds.demo.";

/**
 * Estado que sobrevive a recarregamentos da página (localStorage).
 *
 * O valor inicial é sempre a semente, idêntico no servidor e no cliente, para
 * não quebrar a hidratação do React; a leitura do localStorage acontece só
 * após a montagem. Quando o BaaS entrar, esta persistência sai e o estado
 * passa a vir da API.
 */
function usePersistentState<T>(key: string, seed: T) {
  const [state, setState] = useState<T>(seed);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_PREFIX + key);
      if (raw !== null) setState(JSON.parse(raw) as T);
    } catch {
      // localStorage indisponível (modo privado//quota) — segue com a semente
    }
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(state));
    } catch {
      // ignora falha de escrita: a sessão continua funcionando em memória
    }
  }, [key, state, hydrated]);

  return [state, setState] as const;
}

export function resetDemoData() {
  try {
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith(STORAGE_PREFIX))
      .forEach((k) => window.localStorage.removeItem(k));
  } catch {
    // ignora
  }
  window.location.href = "/dashboard";
}

interface AppState {
  profile: Profile;
  balance: number;
  transactions: Transaction[];
  pixKeys: PixKey[];
  boletos: Boleto[];
  cards: Card[];
  notifications: AppNotification[];
  loans: Loan[];
  unreadCount: number;

  // Ações — cada uma corresponde a um endpoint do BFF
  sendPix: (pixKey: string, amount: number) => { ok: boolean; error?: string };
  addPixKey: (type: PixKeyType, value: string) => { ok: boolean; error?: string };
  removePixKey: (id: string) => void;
  receivePixCharge: (amount: number) => void;

  payBoleto: (barcode: string, amount: number) => { ok: boolean; error?: string };
  issueBoleto: (payerName: string, amount: number, dueDate: string, description: string) => Boleto;

  toggleCardBlock: (id: string) => void;
  createVirtualCard: (label: string, limit: number) => Card;
  deleteCard: (id: string) => void;

  contractLoan: (amount: number, installments: number) => Loan;

  addMoney: (amount: number) => void;
  updateProfile: (patch: Partial<Profile>) => void;

  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  clearNotifications: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = usePersistentState<Profile>("profile", SEED_PROFILE);
  const [balance, setBalance] = usePersistentState<number>("balance", 7580.2);
  const [transactions, setTransactions] = usePersistentState<Transaction[]>(
    "transactions",
    SEED_TRANSACTIONS
  );
  const [pixKeys, setPixKeys] = usePersistentState<PixKey[]>("pixKeys", SEED_PIX_KEYS);
  const [boletos, setBoletos] = usePersistentState<Boleto[]>("boletos", SEED_BOLETOS);
  const [cards, setCards] = usePersistentState<Card[]>("cards", SEED_CARDS);
  const [notifications, setNotifications] = usePersistentState<AppNotification[]>(
    "notifications",
    SEED_NOTIFICATIONS
  );
  const [loans, setLoans] = usePersistentState<Loan[]>("loans", SEED_LOANS);

  const pushTransaction = useCallback((tx: Omit<Transaction, "id" | "createdAt">) => {
    setTransactions((prev) => [
      { ...tx, id: randomId(), createdAt: new Date().toISOString() },
      ...prev,
    ]);
  }, []);

  const pushNotification = useCallback(
    (n: Omit<AppNotification, "id" | "createdAt" | "read">) => {
      setNotifications((prev) => [
        { ...n, id: randomId(), createdAt: new Date().toISOString(), read: false },
        ...prev,
      ]);
    },
    []
  );

  const sendPix = useCallback<AppState["sendPix"]>(
    (pixKey, amount) => {
      if (amount <= 0) return { ok: false, error: "Informe um valor maior que zero." };
      if (amount > balance) return { ok: false, error: "Saldo insuficiente para esta transferência." };

      setBalance((b) => b - amount);
      pushTransaction({
        type: "pix_out",
        label: `Pix enviado — ${pixKey}`,
        amount: -amount,
        status: "completed",
      });
      pushNotification({
        title: "Pix enviado",
        message: `Transferência de ${amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} para ${pixKey} concluída.`,
        kind: "transaction",
      });
      return { ok: true };
    },
    [balance, pushTransaction, pushNotification]
  );

  const addPixKey = useCallback<AppState["addPixKey"]>(
    (type, value) => {
      if (!value.trim()) return { ok: false, error: "Informe um valor para a chave." };
      if (pixKeys.some((k) => k.value === value))
        return { ok: false, error: "Esta chave já está cadastrada." };
      if (pixKeys.length >= 5) return { ok: false, error: "Limite de 5 chaves atingido." };

      setPixKeys((prev) => [
        ...prev,
        { id: randomId(), type, value, createdAt: new Date().toISOString() },
      ]);
      pushNotification({
        title: "Chave Pix cadastrada",
        message: `A chave ${value} foi vinculada à sua conta.`,
        kind: "security",
      });
      return { ok: true };
    },
    [pixKeys, pushNotification]
  );

  const removePixKey = useCallback((id: string) => {
    setPixKeys((prev) => prev.filter((k) => k.id !== id));
  }, []);

  const receivePixCharge = useCallback(
    (amount: number) => {
      setBalance((b) => b + amount);
      pushTransaction({
        type: "pix_in",
        label: "Pix recebido — cobrança QR Code",
        amount,
        status: "completed",
      });
      pushNotification({
        title: "Pix recebido",
        message: `Sua cobrança de ${amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} foi paga.`,
        kind: "transaction",
      });
    },
    [pushTransaction, pushNotification]
  );

  const payBoleto = useCallback<AppState["payBoleto"]>(
    (barcode, amount) => {
      if (amount > balance) return { ok: false, error: "Saldo insuficiente para pagar este boleto." };

      setBalance((b) => b - amount);
      setBoletos((prev) => [
        {
          id: randomId(),
          direction: "paid",
          description: "Boleto pago",
          amount,
          dueDate: new Date().toISOString().slice(0, 10),
          barcode,
          status: "paid",
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      pushTransaction({
        type: "boleto_paid",
        label: "Boleto pago",
        amount: -amount,
        status: "completed",
      });
      pushNotification({
        title: "Boleto pago",
        message: `Pagamento de ${amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} confirmado.`,
        kind: "transaction",
      });
      return { ok: true };
    },
    [balance, pushTransaction, pushNotification]
  );

  const issueBoleto = useCallback<AppState["issueBoleto"]>(
    (payerName, amount, dueDate, description) => {
      const boleto: Boleto = {
        id: randomId(),
        direction: "issued",
        description: description || `Cobrança — ${payerName}`,
        amount,
        dueDate,
        barcode: generateBarcode(),
        status: "open",
        payerName,
        createdAt: new Date().toISOString(),
      };
      setBoletos((prev) => [boleto, ...prev]);
      pushNotification({
        title: "Boleto emitido",
        message: `Boleto de ${amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} para ${payerName} gerado com sucesso.`,
        kind: "info",
      });
      return boleto;
    },
    [pushNotification]
  );

  const toggleCardBlock = useCallback(
    (id: string) => {
      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, blocked: !c.blocked } : c))
      );
      const card = cards.find((c) => c.id === id);
      if (card) {
        pushNotification({
          title: card.blocked ? "Cartão desbloqueado" : "Cartão bloqueado",
          message: `${card.label} •••• ${card.last4} foi ${card.blocked ? "desbloqueado" : "bloqueado"}.`,
          kind: "security",
        });
      }
    },
    [cards, pushNotification]
  );

  const createVirtualCard = useCallback<AppState["createVirtualCard"]>(
    (label, limit) => {
      const card: Card = {
        id: randomId(),
        kind: "virtual",
        label: label || "Cartão virtual",
        last4: String(Math.floor(1000 + Math.random() * 9000)),
        holder: profile.fullName.toUpperCase(),
        expiry: "12/32",
        cvv: String(Math.floor(100 + Math.random() * 900)),
        brand: "Mastercard",
        blocked: false,
        limit,
        used: 0,
      };
      setCards((prev) => [...prev, card]);
      pushNotification({
        title: "Cartão virtual criado",
        message: `${card.label} •••• ${card.last4} está pronto para uso.`,
        kind: "info",
      });
      return card;
    },
    [profile.fullName, pushNotification]
  );

  const deleteCard = useCallback((id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const contractLoan = useCallback<AppState["contractLoan"]>(
    (amount, installments) => {
      const q = quoteLoan(amount, installments);
      const loan: Loan = {
        id: randomId(),
        amount,
        installments,
        monthlyRate: q.monthlyRate,
        installmentValue: q.installmentValue,
        totalCost: q.totalCost,
        cet: q.cet,
        status: "active",
        contractedAt: new Date().toISOString(),
        paidInstallments: 0,
      };
      setLoans((prev) => [loan, ...prev]);
      setBalance((b) => b + amount);
      pushTransaction({
        type: "loan_credit",
        label: `Crédito de empréstimo — ${installments}x`,
        amount,
        status: "completed",
      });
      pushNotification({
        title: "Empréstimo contratado",
        message: `${amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} creditados na sua conta em ${installments}x.`,
        kind: "transaction",
      });
      return loan;
    },
    [pushTransaction, pushNotification]
  );

  const addMoney = useCallback(
    (amount: number) => {
      setBalance((b) => b + amount);
      pushTransaction({
        type: "deposit",
        label: "Depósito via Pix",
        amount,
        status: "completed",
      });
    },
    [pushTransaction]
  );

  const updateProfile = useCallback((patch: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => setNotifications([]), []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const value: AppState = {
    profile,
    balance,
    transactions,
    pixKeys,
    boletos,
    cards,
    notifications,
    loans,
    unreadCount,
    sendPix,
    addPixKey,
    removePixKey,
    receivePixCharge,
    payBoleto,
    issueBoleto,
    toggleCardBlock,
    createVirtualCard,
    deleteCard,
    contractLoan,
    addMoney,
    updateProfile,
    markNotificationRead,
    markAllRead,
    clearNotifications,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp deve ser usado dentro de <AppProvider>");
  return ctx;
}

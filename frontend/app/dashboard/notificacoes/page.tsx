"use client";

import { ArrowLeftRight, ShieldAlert, Info, CheckCheck, Trash2, BellOff } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { useApp } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { formatDateTime } from "@/lib/utils";
import type { AppNotification } from "@/lib/types";

const ICONS = {
  transaction: ArrowLeftRight,
  security: ShieldAlert,
  info: Info,
} as const;

export default function NotificacoesPage() {
  const { notifications, unreadCount, markNotificationRead, markAllRead, clearNotifications } =
    useApp();
  const toast = useToast();

  return (
    <DashboardShell
      title="Notificações"
      subtitle={unreadCount > 0 ? `${unreadCount} não lidas` : "Tudo em dia"}
    >
      {notifications.length > 0 && (
        <div className="mb-4 flex gap-2.5">
          <button
            onClick={() => {
              markAllRead();
              toast("Todas marcadas como lidas.");
            }}
            disabled={unreadCount === 0}
            className="btn-secondary flex-1 !py-2.5"
          >
            <CheckCheck size={15} />
            Marcar todas como lidas
          </button>
          <button
            onClick={() => {
              clearNotifications();
              toast("Notificações limpas.");
            }}
            className="btn-secondary !px-4 !py-2.5"
            aria-label="Limpar notificações"
          >
            <Trash2 size={15} />
          </button>
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="card flex flex-col items-center py-14 text-center">
          <BellOff size={32} strokeWidth={1.2} className="mb-4 text-muted" />
          <p className="text-sm font-medium text-white">Nenhuma notificação</p>
          <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted">
            Avisos de transações, segurança e novidades da sua conta aparecem
            aqui.
          </p>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {notifications.map((n) => (
            <NotificationCard
              key={n.id}
              notification={n}
              onRead={() => markNotificationRead(n.id)}
            />
          ))}
        </ul>
      )}
    </DashboardShell>
  );
}

function NotificationCard({
  notification: n,
  onRead,
}: {
  notification: AppNotification;
  onRead: () => void;
}) {
  const Icon = ICONS[n.kind];

  return (
    <li>
      <button
        onClick={onRead}
        className={`card flex w-full items-start gap-3.5 text-left transition-colors hover:border-white/15 ${
          n.read ? "" : "border-emerald/25 bg-emerald-dim/20"
        }`}
      >
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
            n.kind === "security"
              ? "border-amber-500/30 text-amber-400"
              : "border-line text-muted"
          }`}
        >
          <Icon size={14} strokeWidth={1.8} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-white">{n.title}</p>
            {!n.read && (
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald"
                aria-label="Não lida"
              />
            )}
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted">{n.message}</p>
          <p className="mt-2 text-[11px] text-muted/60">{formatDateTime(n.createdAt)}</p>
        </div>
      </button>
    </li>
  );
}

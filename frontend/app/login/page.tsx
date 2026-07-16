"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { AuthShell } from "@/components/ui/AuthShell";
import { Field } from "@/components/ui/Field";
import { applyCpfMask } from "@/lib/utils";

/**
 * Página dedicada de login (substitui o antigo modal flutuante).
 *
 * Autenticação simulada: qualquer CPF válido + senha de 8+ caracteres entra
 * no painel. A chamada real será POST /api/auth/login, que devolve o access
 * token de curta duração — ver backend/src/controllers/auth.controller.ts
 */
export default function LoginPage() {
  const router = useRouter();
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (cpf.replace(/\D/g, "").length !== 11) {
      setError("Informe um CPF válido com 11 dígitos.");
      return;
    }
    if (password.length < 8) {
      setError("A senha deve ter ao menos 8 caracteres.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    router.push("/dashboard");
  }

  return (
    <AuthShell
      title="Entrar na sua conta"
      subtitle="Use o CPF cadastrado para acessar seu painel."
      backHref="/"
      footer={
        <p className="text-center text-sm text-muted">
          Ainda não tem conta?{" "}
          <Link href="/cadastro" className="font-medium text-emerald hover:text-emerald-soft">
            Abrir conta gratuita
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="card space-y-5">
        <Field
          label="CPF"
          value={cpf}
          onChange={(v) => setCpf(applyCpfMask(v))}
          placeholder="000.000.000-00"
          inputMode="numeric"
          autoFocus
        />

        <div>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted">Senha</span>
            <div className="flex items-center gap-2 rounded-xl border border-line bg-background px-4 transition-colors focus-within:border-emerald">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo de 8 caracteres"
                className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-muted/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="shrink-0 text-muted hover:text-white"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>
          <div className="mt-2 flex justify-end">
            <Link href="#" className="text-xs text-muted hover:text-white">
              Esqueci minha senha
            </Link>
          </div>
        </div>

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Verificando..." : "Entrar"}
          {!loading && <ArrowRight size={16} />}
        </button>

        <p className="text-center text-[11px] leading-relaxed text-muted/70">
          Ambiente de demonstração: qualquer CPF válido e senha com 8+
          caracteres acessa o painel.
        </p>
      </form>
    </AuthShell>
  );
}

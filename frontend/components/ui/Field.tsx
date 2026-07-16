"use client";

import { cn } from "@/lib/utils";

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  prefix,
  hint,
  error,
  required,
  inputMode,
  autoFocus,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  prefix?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  inputMode?: "text" | "numeric" | "decimal" | "email" | "tel";
  autoFocus?: boolean;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
      <div
        className={cn(
          "flex items-center gap-2 rounded-xl border bg-background px-4 transition-colors focus-within:border-emerald",
          error ? "border-red-500/60" : "border-line"
        )}
      >
        {prefix && <span className="text-sm text-muted">{prefix}</span>}
        <input
          type={type}
          required={required}
          value={value}
          inputMode={inputMode}
          autoFocus={autoFocus}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-muted/50"
        />
      </div>
      {error ? (
        <span className="mt-1.5 block text-xs text-red-400">{error}</span>
      ) : hint ? (
        <span className="mt-1.5 block text-xs text-muted/70">{hint}</span>
      ) : null}
    </label>
  );
}

export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-line bg-background px-4 py-3 text-sm text-white outline-none transition-colors focus:border-emerald"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-background-surface">
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

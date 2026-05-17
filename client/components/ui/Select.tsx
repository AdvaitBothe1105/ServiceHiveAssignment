import type { SelectHTMLAttributes } from "react";

export type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: SelectOption[];
  error?: string;
};

export default function Select({
  label,
  options,
  error,
  id,
  className = "",
  ...props
}: SelectProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <label className="block text-sm" htmlFor={fieldId}>
      <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{label}</span>
      <select
        id={fieldId}
        className={`mt-2 w-full rounded-2xl border px-4 py-3 text-sm text-foreground shadow-sm outline-none transition ${
          error
            ? "border-destructive/80 bg-destructive/10"
            : "border-border bg-background/80 focus:border-primary/70"
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <p className="mt-1.5 min-h-[1rem] text-xs text-destructive">{error ?? ""}</p>
    </label>
  );
}

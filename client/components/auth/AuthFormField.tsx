"use client";

type AuthFormFieldProps = {
  id: string;
  label: string;
  type: "text" | "email" | "password";
  value: string;
  placeholder?: string;
  error?: string;
  onBlur: () => void;
  onChange: (value: string) => void;
};

export default function AuthFormField({
  id,
  label,
  type,
  value,
  placeholder,
  error,
  onBlur,
  onChange
}: AuthFormFieldProps) {
  return (
    <label className="block text-sm">
      <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{label}</span>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.value)}
        className={`mt-2 w-full rounded-2xl border px-4 py-3 text-sm text-foreground shadow-sm outline-none transition ${
          error
            ? "border-destructive/80 bg-destructive/10"
            : "border-border bg-background/80 focus:border-primary/70"
        }`}
      />
      <p className="mt-2 min-h-[1rem] text-xs text-destructive">{error ?? ""}</p>
    </label>
  );
}

import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-sm hover:shadow-md disabled:opacity-70",
  secondary:
    "border border-border bg-card text-card-foreground hover:border-primary/50",
  ghost: "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
  destructive:
    "bg-destructive text-destructive-foreground shadow-sm hover:opacity-90 disabled:opacity-70"
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "rounded-full px-3 py-1.5 text-xs",
  md: "rounded-full px-4 py-2 text-sm",
  lg: "rounded-full px-6 py-3 text-sm"
};

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 font-semibold transition disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
}

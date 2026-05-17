type SpinnerProps = {
  className?: string;
  size?: "sm" | "md";
};

export default function Spinner({ className = "", size = "md" }: SpinnerProps) {
  const sizeClass = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-primary border-t-transparent ${sizeClass} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

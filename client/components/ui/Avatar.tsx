type AvatarProps = {
  name: string;
  className?: string;
};

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

export default function Avatar({ name, className = "" }: AvatarProps) {
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-primary/10 text-xs font-semibold text-primary ${className}`}
      aria-hidden
    >
      {getInitials(name)}
    </span>
  );
}

type IconBadgeProps = {
  label: string;
};

export default function IconBadge({ label }: IconBadgeProps) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card shadow-sm">
      <span className="font-mono text-xs uppercase tracking-[0.24em] text-primary">{label}</span>
    </div>
  );
}

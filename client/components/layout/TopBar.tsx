import IconBadge from "../ui/IconBadge";

export default function TopBar() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border/70 bg-card/50 px-8 py-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Dashboard</p>
        <h1 className="text-2xl font-semibold">Overview</h1>
      </div>

      <div className="flex flex-1 justify-end gap-4">
        <div className="flex items-center gap-3 rounded-full border border-border/70 bg-background/80 px-4 py-2">
          <IconBadge label="AV" />
          <div className="text-sm">
            <p className="font-semibold">Avery Signal</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}

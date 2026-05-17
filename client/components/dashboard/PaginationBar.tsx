import Button from "../ui/Button";

type PaginationBarProps = {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
};

export default function PaginationBar({
  page,
  totalPages,
  total,
  limit,
  onPageChange
}: PaginationBarProps) {
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => {
    if (totalPages <= 7) return true;
    return p === 1 || p === totalPages || Math.abs(p - page) <= 1;
  });

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/70 px-4 py-4">
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        {pages.map((p, idx) => {
          const prev = pages[idx - 1];
          const showEllipsis = prev !== undefined && p - prev > 1;
          return (
            <span key={p} className="flex items-center gap-2">
              {showEllipsis ? <span className="px-1 text-muted-foreground">…</span> : null}
              <Button
                variant={p === page ? "primary" : "ghost"}
                size="sm"
                onClick={() => onPageChange(p)}
              >
                {p}
              </Button>
            </span>
          );
        })}
        <Button
          variant="secondary"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Showing {start}–{end} of {total} leads
      </p>
    </div>
  );
}

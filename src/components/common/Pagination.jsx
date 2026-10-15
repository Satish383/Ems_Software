import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const pages = [];
  const maxVisible = 5;
  let from = Math.max(1, page - Math.floor(maxVisible / 2));
  let to = Math.min(totalPages, from + maxVisible - 1);
  if (to - from + 1 < maxVisible) from = Math.max(1, to - maxVisible + 1);
  for (let i = from; i <= to; i++) pages.push(i);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-t border-border dark:border-slate-800">
      <div className="flex items-center gap-3 text-sm text-muted dark:text-slate-400">
        <span>
          Showing{" "}
          <span className="font-semibold text-ink dark:text-slate-100">
            {start}
          </span>
          –
          <span className="font-semibold text-ink dark:text-slate-100">
            {end}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-ink dark:text-slate-100">
            {total}
          </span>
        </span>
        {onPageSizeChange && (
          <select
            className="input !w-auto !py-1.5 !px-2 !text-xs"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            aria-label="Rows per page"
          >
            {[10, 25, 50].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="flex items-center gap-1">
        <button
          className="btn-secondary !px-2.5 !py-1.5"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`min-w-[34px] h-[34px] rounded-lg text-sm font-medium transition ${
              p === page
                ? "bg-navy-900 dark:bg-accent text-white"
                : "text-ink dark:text-slate-200 hover:bg-surface dark:hover:bg-slate-800"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          className="btn-secondary !px-2.5 !py-1.5"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

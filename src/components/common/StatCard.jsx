import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export default function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendLabel,
  tone = "accent",
}) {
  const toneMap = {
    accent: "bg-blue-50 text-accent dark:bg-blue-950/40 dark:text-blue-300",
    navy: "bg-navy-50 text-navy-900 dark:bg-navy-900/40 dark:text-blue-200",
    success:
      "bg-emerald-50 text-success dark:bg-emerald-950/40 dark:text-emerald-300",
    warning:
      "bg-amber-50 text-warning dark:bg-amber-950/40 dark:text-amber-300",
    danger: "bg-red-50 text-danger dark:bg-red-950/40 dark:text-red-300",
  };
  const isUp = trend >= 0;
  return (
    <div className="card p-5 transition hover:shadow-elevated hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted dark:text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-2xl sm:text-[28px] font-bold text-ink dark:text-white leading-tight">
            {value}
          </p>
          {(trendLabel || typeof trend === "number") && (
            <div className="mt-2 flex items-center gap-1.5 text-xs">
              {typeof trend === "number" && (
                <span
                  className={`inline-flex items-center gap-0.5 font-semibold ${isUp ? "text-success" : "text-danger"}`}
                >
                  {isUp ? (
                    <ArrowUpRight size={13} />
                  ) : (
                    <ArrowDownRight size={13} />
                  )}
                  {Math.abs(trend)}%
                </span>
              )}
              {trendLabel && (
                <span className="text-muted dark:text-slate-500">
                  {trendLabel}
                </span>
              )}
            </div>
          )}
        </div>
        {Icon && (
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${toneMap[tone]}`}
          >
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
}

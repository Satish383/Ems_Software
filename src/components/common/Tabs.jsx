export default function Tabs({ tabs, active, onChange, className = "" }) {
  return (
    <div
      className={`flex items-center gap-1 border-b border-border dark:border-slate-800 overflow-x-auto ${className}`}
    >
      {tabs.map((t) => {
        const isActive = t.value === active;
        return (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            className={`relative px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition ${
              isActive
                ? "text-navy-900 dark:text-white"
                : "text-muted dark:text-slate-400 hover:text-ink dark:hover:text-white"
            }`}
          >
            {t.label}
            {typeof t.count === "number" && (
              <span
                className={`ml-2 text-[11px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-navy-900/10 dark:bg-accent/20 text-navy-900 dark:text-accent" : "bg-surface dark:bg-slate-800 text-muted"}`}
              >
                {t.count}
              </span>
            )}
            {isActive && (
              <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-navy-900 dark:bg-accent rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default function PageHeader({ title, subtitle, actions, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink dark:text-white truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-muted dark:text-slate-400">
            {subtitle}
          </p>
        )}
        {children}
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}

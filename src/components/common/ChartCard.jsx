export default function ChartCard({
  title,
  subtitle,
  action,
  children,
  height = 300,
}) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-semibold text-ink dark:text-white">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-muted dark:text-slate-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </div>
      <div style={{ height }} className="w-full">
        {children}
      </div>
    </div>
  );
}

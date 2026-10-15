export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      {Icon && (
        <div className="w-14 h-14 rounded-full bg-surface dark:bg-slate-800 text-muted dark:text-slate-400 flex items-center justify-center mb-4">
          <Icon size={24} />
        </div>
      )}
      <h3 className="text-base font-semibold text-ink dark:text-slate-100">
        {title}
      </h3>
      {description && (
        <p className="mt-1 text-sm text-muted dark:text-slate-400 max-w-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

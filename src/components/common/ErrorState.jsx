import { AlertTriangle } from "lucide-react";

export default function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-950/50 text-danger flex items-center justify-center mb-4">
        <AlertTriangle size={24} />
      </div>
      <h3 className="text-base font-semibold text-ink dark:text-slate-100">
        {title}
      </h3>
      {description && (
        <p className="mt-1 text-sm text-muted dark:text-slate-400 max-w-sm">
          {description}
        </p>
      )}
      {onRetry && (
        <button className="btn-secondary mt-5" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

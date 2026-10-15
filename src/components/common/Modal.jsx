import { useEffect } from "react";
import { X } from "lucide-react";

const sizeMap = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${sizeMap[size]} bg-card dark:bg-slate-900 rounded-t-2xl sm:rounded-card border border-border dark:border-slate-800 shadow-popover animate-scale-in max-h-[92vh] flex flex-col`}
      >
        {(title || onClose) && (
          <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-border dark:border-slate-800">
            <h3 className="text-base font-semibold text-ink dark:text-slate-100">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-surface dark:hover:bg-slate-800 dark:hover:text-white"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="px-5 py-5 overflow-y-auto flex-1">{children}</div>
        {footer && (
          <div className="px-5 py-4 border-t border-border dark:border-slate-800 flex items-center justify-end gap-2 bg-surface/60 dark:bg-slate-900/60 rounded-b-card">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

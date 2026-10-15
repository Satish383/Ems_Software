import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from "lucide-react";

const ToastContext = createContext(null);

const iconMap = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
};

const colorMap = {
  success: "text-success",
  info: "text-accent",
  warning: "text-warning",
  error: "text-danger",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback(
    (message, type = "info", duration = 3200) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((t) => [...t, { id, message, type }]);
      if (duration) setTimeout(() => remove(id), duration);
    },
    [remove],
  );

  const toast = useMemo(
    () => ({
      success: (m) => push(m, "success"),
      error: (m) => push(m, "error"),
      info: (m) => push(m, "info"),
      warning: (m) => push(m, "warning"),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-[min(360px,calc(100vw-2rem))]">
        {toasts.map((t) => {
          const Icon = iconMap[t.type] || Info;
          return (
            <div
              key={t.id}
              className="card p-3.5 flex items-start gap-3 animate-slide-in-right shadow-elevated"
              role="status"
            >
              <Icon
                size={18}
                className={`mt-0.5 shrink-0 ${colorMap[t.type]}`}
              />
              <p className="text-sm text-ink dark:text-slate-100 flex-1">
                {t.message}
              </p>
              <button
                onClick={() => remove(t.id)}
                className="text-muted hover:text-ink dark:hover:text-white p-0.5 rounded"
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
};

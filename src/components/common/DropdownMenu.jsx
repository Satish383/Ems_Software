import { useEffect, useRef, useState } from "react";

export default function DropdownMenu({
  trigger,
  items,
  align = "right",
  width = "w-48",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {trigger}
      </button>
      {open && (
        <div
          role="menu"
          className={`absolute z-50 mt-2 ${align === "right" ? "right-0" : "left-0"} ${width} bg-card dark:bg-slate-900 border border-border dark:border-slate-800 rounded-xl shadow-popover p-1.5 animate-fade-in`}
        >
          {items.map((item, i) =>
            item.divider ? (
              <div
                key={i}
                className="my-1 border-t border-border dark:border-slate-800"
              />
            ) : (
              <button
                key={item.label || i}
                role="menuitem"
                onClick={() => {
                  item.onClick?.();
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-left transition ${
                  item.danger
                    ? "text-danger hover:bg-red-50 dark:hover:bg-red-950/40"
                    : "text-ink dark:text-slate-200 hover:bg-surface dark:hover:bg-slate-800"
                }`}
              >
                {item.icon && <item.icon size={15} />}
                <span>{item.label}</span>
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}

import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const prettify = (s) =>
  s
    .split("-")
    .map((p) => (p ? p[0].toUpperCase() + p.slice(1) : p))
    .join(" ");

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  const crumbs = segments.map((seg, i) => {
    const to = "/" + segments.slice(0, i + 1).join("/");
    const isLast = i === segments.length - 1;
    const label =
      /^(EMP|DEP|DSG|LV|PAY|PR|ATT|NT)-\d+/i.test(seg) || seg.length > 18
        ? "Details"
        : prettify(seg);
    return { to, label, isLast };
  });

  return (
    <nav
      aria-label="Breadcrumb"
      className="hidden md:flex items-center gap-1.5 text-xs text-muted dark:text-slate-400"
    >
      <Link
        to="/dashboard"
        className="hover:text-ink dark:hover:text-white inline-flex items-center gap-1"
      >
        <Home size={12} /> Home
      </Link>
      {crumbs.map((c) => (
        <span key={c.to} className="flex items-center gap-1.5">
          <ChevronRight
            size={12}
            className="text-slate-300 dark:text-slate-600"
          />
          {c.isLast ? (
            <span className="text-ink dark:text-white font-semibold">
              {c.label}
            </span>
          ) : (
            <Link to={c.to} className="hover:text-ink dark:hover:text-white">
              {c.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}

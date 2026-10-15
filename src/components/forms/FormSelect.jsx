import { forwardRef } from "react";

const FormSelect = forwardRef(function FormSelect(
  { label, error, hint, className = "", required, children, ...props },
  ref,
) {
  return (
    <div className={className}>
      {label && (
        <label className="label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <select
        ref={ref}
        className={`input appearance-none bg-[url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>")] bg-no-repeat bg-[right_0.75rem_center] pr-9 ${
          error ? "!border-danger focus:!ring-danger/20" : ""
        }`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="error-text">{error}</p>}
      {!error && hint && (
        <p className="text-xs text-muted dark:text-slate-500 mt-1">{hint}</p>
      )}
    </div>
  );
});

export default FormSelect;

import { forwardRef } from "react";

const FormInput = forwardRef(function FormInput(
  { label, error, hint, className = "", required, ...props },
  ref,
) {
  return (
    <div className={className}>
      {label && (
        <label className="label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <input
        ref={ref}
        className={`input ${error ? "!border-danger focus:!ring-danger/20" : ""}`}
        {...props}
      />
      {error && <p className="error-text">{error}</p>}
      {!error && hint && (
        <p className="text-xs text-muted dark:text-slate-500 mt-1">{hint}</p>
      )}
    </div>
  );
});

export default FormInput;

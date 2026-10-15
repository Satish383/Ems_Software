import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, LogIn, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import FormInput from "@/components/forms/FormInput";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm();
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPwd, setShowPwd] = useState(false);
  const [serverError, setServerError] = useState("");

  const onSubmit = async (values) => {
    setServerError("");
    try {
      await login(values);
      toast.success("Welcome back! Signed in successfully.");
      navigate(location.state?.from?.pathname || "/dashboard", {
        replace: true,
      });
    } catch (err) {
      setServerError(err.message);
      toast.error(err.message);
    }
  };

  const useDemo = () => {
    setValue("email", "admin@employeehub.demo");
    setValue("password", "demo1234");
  };

  return (
    <div className="animate-fade-in">
      {/* Mobile brand */}
      <div className="lg:hidden mb-8 flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-xl bg-navy-900 flex items-center justify-center text-white font-bold">
          EH
        </div>
        <div>
          <p className="font-bold text-ink dark:text-white">EmployeeHub</p>
          <p className="text-[11px] text-muted">HR Suite</p>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-ink dark:text-white">Sign in</h1>
      <p className="mt-2 text-sm text-muted dark:text-slate-400">
        Welcome back. Use your credentials to access the HR dashboard.
      </p>

      <div className="mt-6 rounded-xl border border-blue-100 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/30 p-3.5 flex gap-3">
        <ShieldCheck size={18} className="text-accent shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
          <p className="font-semibold">Demo authentication</p>
          <p className="mt-0.5">
            This is a frontend demo — no real backend. Use{" "}
            <code className="font-mono bg-white/70 dark:bg-slate-900 px-1 rounded">
              admin@employeehub.demo
            </code>{" "}
            /{" "}
            <code className="font-mono bg-white/70 dark:bg-slate-900 px-1 rounded">
              demo1234
            </code>{" "}
            or click &quot;Use demo credentials&quot; below.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 space-y-4"
        noValidate
      >
        <FormInput
          label="Email address"
          type="email"
          placeholder="you@company.com"
          required
          autoComplete="email"
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Enter a valid email",
            },
          })}
        />

        <div>
          <label className="label">
            Password <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <input
              type={showPwd ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              className={`input !pr-10 ${errors.password ? "!border-danger focus:!ring-danger/20" : ""}`}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-ink dark:hover:text-white"
              aria-label={showPwd ? "Hide password" : "Show password"}
            >
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="error-text">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="inline-flex items-center gap-2 text-sm text-ink dark:text-slate-200 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-border text-accent focus:ring-accent/40"
              defaultChecked
            />
            Remember me
          </label>
          <Link
            to="/forgot-password"
            className="text-sm font-semibold text-accent hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {serverError && (
          <div className="rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-danger text-sm p-3">
            {serverError}
          </div>
        )}

        <button
          type="submit"
          className="btn-primary w-full !py-3"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            "Signing in…"
          ) : (
            <>
              <LogIn size={16} /> Sign in
            </>
          )}
        </button>

        <button
          type="button"
          className="btn-secondary w-full"
          onClick={useDemo}
        >
          Use demo credentials
        </button>
      </form>

      <p className="mt-8 text-xs text-muted dark:text-slate-500 text-center">
        Protected demo — no real authentication. Data is fictional.
      </p>
    </div>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft, MailCheck, Send } from "lucide-react";
import FormInput from "@/components/forms/FormInput";

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [sent, setSent] = useState(false);

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 700));
    setSent(true);
  };

  return (
    <div className="animate-fade-in">
      {!sent ? (
        <>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink dark:hover:text-white mb-6"
          >
            <ArrowLeft size={14} /> Back to sign in
          </Link>
          <h1 className="text-3xl font-bold text-ink dark:text-white">
            Reset your password
          </h1>
          <p className="mt-2 text-sm text-muted dark:text-slate-400">
            Enter the email associated with your account. We&apos;ll send a
            reset link.
          </p>

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
              error={errors.email?.message}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter a valid email",
                },
              })}
            />
            <button
              type="submit"
              className="btn-primary w-full !py-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Sending…"
              ) : (
                <>
                  <Send size={16} /> Send reset link
                </>
              )}
            </button>
          </form>
          <p className="mt-6 text-xs text-muted dark:text-slate-500 text-center">
            Demo only — no email is actually sent.
          </p>
        </>
      ) : (
        <div className="text-center animate-fade-in">
          <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-success flex items-center justify-center mx-auto">
            <MailCheck size={24} />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-ink dark:text-white">
            Check your inbox
          </h1>
          <p className="mt-2 text-sm text-muted dark:text-slate-400">
            If an account exists, a reset link has been sent. (Simulated — no
            real email.)
          </p>
          <Link to="/login" className="btn-secondary mt-6 inline-flex">
            <ArrowLeft size={14} /> Back to sign in
          </Link>
        </div>
      )}
    </div>
  );
}

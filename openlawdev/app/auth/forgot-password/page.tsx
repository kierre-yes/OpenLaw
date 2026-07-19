"use client";

import { useActionState } from "react";
import { forgotPassword } from "../actions";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Loader2, Mail, ArrowRight } from "lucide-react";

const initialState = { error: undefined, message: undefined };

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(
    forgotPassword,
    initialState
  );

  return (
    <div className="flex flex-col gap-8">

      {/* ── Success State ── */}
      {state.message ? (
        <div className="flex flex-col gap-8 py-2">
          {/* Icon */}
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="relative flex items-center justify-center">
              {/* Pulse ring */}
              <div
                className="absolute w-20 h-20 rounded-full animate-ping opacity-10"
                style={{ backgroundColor: "var(--color-text-primary)" }}
                aria-hidden="true"
              />
              <div
                className="relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm"
                style={{ backgroundColor: "rgba(41,47,54,0.06)" }}
              >
                <Mail className="w-7 h-7" style={{ color: "var(--color-text-primary)" }} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h2
                className="text-[1.5rem] font-semibold tracking-tight"
                style={{ color: "var(--color-text-primary)" }}
              >
                Reset link sent
              </h2>
              <p
                className="text-[14px] leading-relaxed max-w-xs mx-auto"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Check your inbox for a reset link. It will expire in one hour.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div
            className="h-px w-full"
            style={{ backgroundColor: "var(--color-border-subtle)" }}
          />

          {/* Status banner */}
          <div
            role="status"
            className="flex items-start gap-2.5 rounded-xl px-4 py-3.5 text-[13px] font-medium"
            style={{
              backgroundColor: "rgba(41,47,54,0.04)",
              border: "1px solid rgba(41,47,54,0.08)",
              color: "var(--color-text-primary)",
            }}
          >
            <CheckCircle2
              className="w-4 h-4 mt-0.5 shrink-0"
              aria-hidden="true"
            />
            {state.message}
          </div>

          {/* Info tips */}
          <div
            className="w-full rounded-xl px-4 py-4 flex flex-col gap-3"
            style={{
              backgroundColor: "rgba(41,47,54,0.04)",
              border: "1px solid rgba(41,47,54,0.08)",
            }}
          >
            <p
              className="text-[12px] font-semibold uppercase tracking-widest"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Didn&apos;t receive it?
            </p>
            {[
              "Check your spam or junk folder.",
              "The link works for one hour only.",
              "Use the same email tied to your account.",
            ].map((tip) => (
              <p key={tip} className="flex items-start gap-2.5 text-[13px] leading-snug" style={{ color: "var(--color-text-primary)" }}>

                <span
                  className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                  style={{ backgroundColor: "var(--color-brand-red)" }}
                  aria-hidden="true"
                />
                {tip}
              </p>
            ))}
          </div>

          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center gap-2 text-[13px] font-semibold cursor-pointer text-center transition-colors duration-150 hover:underline"
            style={{ color: "var(--color-text-primary)" }}
          >
            ← Back to sign in
          </Link>
        </div>
      ) : (
        <>
          {/* ── Form State ── */}

          {/* Heading */}
          <div className="flex flex-col gap-1.5">
            <h2
              className="text-[1.625rem] font-semibold tracking-tight"
              style={{ color: "var(--color-text-primary)" }}
            >
              Reset your password
            </h2>
            <p className="text-[14px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              Enter the email for your account. We&apos;ll send you a link to
              reset your password. The link expires in one hour.
            </p>
          </div>

          {/* Error banner */}
          {state.error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-xl px-4 py-3.5 text-[13px] font-medium"
              style={{
                backgroundColor: "rgba(164,31,19,0.07)",
                color: "var(--color-brand-red)",
                borderLeft: "3px solid #A41F13",
              }}
            >
              <AlertCircle
                className="w-4 h-4 mt-0.5 shrink-0"
                aria-hidden="true"
              />
              {state.error}
            </div>
          )}

          {/* Form */}
          <form action={formAction} noValidate className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-[13px] font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={isPending}
                placeholder="you@example.com"
                className="w-full rounded-xl px-4 py-3 text-[14px] font-normal outline-none border transition-all duration-150 disabled:opacity-50"
                style={{
                  backgroundColor: "var(--color-paper-bg)",
                  borderColor: "var(--color-border-medium)",
                  color: "var(--color-text-primary)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-brand-red)";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(164,31,19,0.10)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border-medium)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="cursor-pointer w-full inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl text-[14px] font-semibold tracking-wide transition-all duration-200 ease-in-out hover:shadow-md active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: "var(--color-brand-red)", color: "var(--color-text-inverse)" }}
            >
              {isPending ? (
                <>
                  <Loader2
                    className="w-4 h-4 animate-spin"
                    aria-hidden="true"
                  />
                  Sending reset link…
                </>
              ) : (
                <>
                  Send reset link
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          {/* Back to login */}
          <p className="text-center text-[13px]" style={{ color: "var(--color-text-secondary)" }}>
            <Link
              href="/auth/login"
              className="font-semibold cursor-pointer transition-colors duration-150 hover:underline"
              style={{ color: "var(--color-text-primary)" }}
            >
              ← Back to sign in
            </Link>
          </p>
        </>
      )}
    </div>
  );
}

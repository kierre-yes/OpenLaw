"use client";

import { useActionState } from "react";
import { updatePassword } from "../actions";
import { AlertCircle, KeyRound, Loader2, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useState } from "react";

const initialState = { error: undefined, message: undefined };

export default function ResetPasswordPage() {
  const [state, formAction, isPending] = useActionState(
    updatePassword,
    initialState
  );
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      {/* Heading */}
      <div className="flex flex-col gap-1.5">
        <h2
          className="text-[1.625rem] font-semibold tracking-tight"
          style={{ color: "var(--color-text-primary)" }}
        >
          Set a new password
        </h2>
        <p className="text-[14px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          Choose a strong password. It must be at least 8 characters.
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
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
          {state.error}
        </div>
      )}

      {/* Form */}
      <form action={formAction} noValidate className="flex flex-col gap-5">

        {/* New password field */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="text-[13px] font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            New password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPass ? "text" : "password"}
              autoComplete="new-password"
              required
              disabled={isPending}
              placeholder="At least 8 characters"
              className="w-full rounded-xl px-4 py-3 pr-11 text-[14px] font-normal outline-none border transition-all duration-150 disabled:opacity-50"
              style={{
                backgroundColor: "var(--color-paper-bg)",
                borderColor: "var(--color-border-medium)",
                color: "var(--color-text-primary)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--color-brand-red)";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(164,31,19,0.10)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border-medium)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors duration-150"
              aria-label={showPass ? "Hide password" : "Show password"}
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm password field */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="confirm"
            className="text-[13px] font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            Confirm new password
          </label>
          <div className="relative">
            <input
              id="confirm"
              name="confirm"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              required
              disabled={isPending}
              placeholder="Re-enter your new password"
              className="w-full rounded-xl px-4 py-3 pr-11 text-[14px] font-normal outline-none border transition-all duration-150 disabled:opacity-50"
              style={{
                backgroundColor: "var(--color-paper-bg)",
                borderColor: "var(--color-border-medium)",
                color: "var(--color-text-primary)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--color-brand-red)";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(164,31,19,0.10)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border-medium)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors duration-150"
              aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Password strength hint */}
        <div
          className="w-full rounded-xl px-4 py-3.5 flex items-start gap-2.5"
          style={{
            backgroundColor: "rgba(41,47,54,0.04)",
            border: "1px solid rgba(41,47,54,0.08)",
          }}
        >
          <KeyRound
            className="w-3.5 h-3.5 mt-0.5 shrink-0"
            style={{ color: "var(--color-text-secondary)" }}
            aria-hidden="true"
          />
          <p className="text-[12px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            Use a mix of letters, numbers, and symbols for a strong password.
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="cursor-pointer w-full inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl text-[14px] font-semibold tracking-wide transition-all duration-200 ease-in-out hover:shadow-md active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ backgroundColor: "var(--color-brand-red)", color: "var(--color-text-inverse)" }}
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              Saving…
            </>
          ) : (
            <>
              Save new password
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

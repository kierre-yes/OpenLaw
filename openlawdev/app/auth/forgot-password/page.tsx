"use client";

import { useActionState } from "react";
import { forgotPassword } from "../actions";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Loader2, Mail } from "lucide-react";

const initialState = { error: undefined, message: undefined };

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(
    forgotPassword,
    initialState
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Heading */}
      <div className="flex flex-col gap-1.5">
        <h2
          className="text-[1.625rem] font-semibold tracking-tight"
          style={{ color: "#292F36" }}
        >
          Reset your password
        </h2>
        <p className="text-[14px] leading-relaxed" style={{ color: "#8F7A6E" }}>
          Enter the email linked to your account. We&apos;ll send a one-time
          reset link that expires in one hour.
        </p>
      </div>

      {/* Success state */}
      {state.message ? (
        <div className="flex flex-col items-center gap-6 py-6 text-center">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "rgba(41,47,54,0.06)" }}
          >
            <Mail className="w-6 h-6" style={{ color: "#292F36" }} />
          </div>
          <div
            role="status"
            className="flex items-start gap-2.5 rounded-xl px-4 py-3.5 text-[13px] font-medium w-full text-left"
            style={{
              backgroundColor: "rgba(41,47,54,0.06)",
              color: "#292F36",
              borderLeft: "3px solid #292F36",
            }}
          >
            <CheckCircle2
              className="w-4 h-4 mt-0.5 shrink-0"
              aria-hidden="true"
            />
            {state.message}
          </div>
          <Link
            href="/auth/login"
            className="text-[13px] font-semibold cursor-pointer"
            style={{ color: "#A41F13" }}
          >
            ← Back to sign in
          </Link>
        </div>
      ) : (
        <>
          {/* Error banner */}
          {state.error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-xl px-4 py-3.5 text-[13px] font-medium"
              style={{
                backgroundColor: "rgba(164,31,19,0.07)",
                color: "#A41F13",
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
                style={{ color: "#292F36" }}
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
                className="
                  w-full rounded-xl px-4 py-3 text-[14px] font-normal
                  outline-none border transition-all duration-150
                  disabled:opacity-50
                "
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "rgba(41,47,54,0.18)",
                  color: "#292F36",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#A41F13";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(164,31,19,0.10)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(41,47,54,0.18)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="
                cursor-pointer w-full inline-flex items-center justify-center gap-2.5
                px-5 py-3.5 rounded-xl text-[14px] font-semibold tracking-wide
                transition-all duration-200 ease-in-out
                hover:shadow-md active:scale-[0.98]
                disabled:opacity-60 disabled:cursor-not-allowed
              "
              style={{ backgroundColor: "#A41F13", color: "#FAF5F1" }}
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
                "Send reset link"
              )}
            </button>
          </form>

          {/* Back to login */}
          <p className="text-center text-[13px]" style={{ color: "#8F7A6E" }}>
            <Link
              href="/auth/login"
              className="font-semibold cursor-pointer transition-colors duration-150"
              style={{ color: "#292F36" }}
            >
              ← Back to sign in
            </Link>
          </p>
        </>
      )}
    </div>
  );
}

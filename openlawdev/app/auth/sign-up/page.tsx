"use client";

import { useActionState, useState } from "react";
import { signUp } from "../actions";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Loader2, Eye, EyeOff } from "lucide-react";

const initialState = { error: undefined, message: undefined };

function InputField({
  id,
  name,
  label,
  type = "text",
  autoComplete,
  placeholder,
  disabled,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[13px] font-semibold"
        style={{ color: "var(--color-text-primary)" }}
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
        disabled={disabled}
        placeholder={placeholder}
        className="
          w-full rounded-xl px-4 py-3 text-[14px] font-normal
          outline-none border transition-all duration-150
          disabled:opacity-50
        "
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
    </div>
  );
}

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(signUp, initialState);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { label: "", color: "" };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score++;

    if (score === 1) {
      return {
        label: "Weak - make it longer, add numbers or mixed case",
        color: "var(--color-brand-red)",
      };
    }
    if (score === 2) {
      return {
        label: "Medium - add symbols or uppercase letters for better security",
        color: "var(--color-text-secondary)",
      };
    }
    return { label: "Strong - secure password", color: "var(--color-text-primary)" };
  };

  const strength = getPasswordStrength(password);

  return (
    <>
      <div className="flex flex-col gap-8">
      {/* Heading */}
      <div className="flex flex-col gap-1.5">
        <h2
          className="text-[1.625rem] font-semibold tracking-tight"
          style={{ color: "var(--color-text-primary)" }}
        >
          Create an account
        </h2>
        <p className="text-[14px]" style={{ color: "var(--color-text-secondary)" }}>
          Start researching Philippine law with cited, source-grounded answers.
        </p>
      </div>

      {/* Success banner */}
      {state.message && (
        <div
          role="status"
          className="flex items-start gap-2.5 rounded-xl px-4 py-3.5 text-[13px] font-medium"
          style={{
            backgroundColor: "rgba(41,47,54,0.06)",
            color: "var(--color-text-primary)",
            borderLeft: "3px solid #292F36",
          }}
        >
          <CheckCircle2
            className="w-4 h-4 mt-0.5 shrink-0"
            aria-hidden="true"
          />
          {state.message}
        </div>
      )}

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
      {!state.message && (
        <form action={formAction} noValidate className="flex flex-col gap-5">
          <InputField
            id="email"
            name="email"
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            disabled={isPending}
          />

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-[13px] font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                disabled={isPending}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="
                  w-full rounded-xl pl-4 pr-11 py-3 text-[14px] font-normal
                  outline-none border transition-all duration-150
                  disabled:opacity-50
                "
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
                disabled={isPending}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer disabled:opacity-50 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="w-4.5 h-4.5" />
                ) : (
                  <Eye className="w-4.5 h-4.5" />
                )}
              </button>
            </div>
            {strength.label && (
              <span
                className="text-[11px] font-semibold leading-relaxed mt-0.5"
                style={{ color: strength.color }}
              >
                {strength.label}
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="confirm"
              className="text-[13px] font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              Confirm password
            </label>
            <div className="relative">
              <input
                id="confirm"
                name="confirm"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                disabled={isPending}
                placeholder="Re-enter your password"
                className="
                  w-full rounded-xl pl-4 pr-11 py-3 text-[14px] font-normal
                  outline-none border transition-all duration-150
                  disabled:opacity-50
                "
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
                disabled={isPending}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer disabled:opacity-50 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4.5 h-4.5" />
                ) : (
                  <Eye className="w-4.5 h-4.5" />
                )}
              </button>
            </div>
          </div>

          {/* Terms note */}
          <p className="text-[12px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            By creating an account you agree to our{" "}
            <Link
              href="/terms"
              className="underline cursor-pointer"
              style={{ color: "var(--color-text-primary)" }}
            >
              Terms of Use
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline cursor-pointer"
              style={{ color: "var(--color-text-primary)" }}
            >
              Privacy Policy
            </Link>
            .
          </p>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="
              cursor-pointer mt-1 w-full inline-flex items-center justify-center gap-2.5
              px-5 py-3.5 rounded-xl text-[14px] font-semibold tracking-wide
              transition-all duration-200 ease-in-out
              hover:shadow-md active:scale-[0.98]
              disabled:opacity-60 disabled:cursor-not-allowed
            "
            style={{ backgroundColor: "var(--color-brand-red)", color: "var(--color-text-inverse)" }}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                Creating account…
              </>
            ) : (
              "Create account"
            )}
          </button>
        </form>
      )}

      {/* Login link */}
      <p className="text-center text-[13px]" style={{ color: "var(--color-text-secondary)" }}>
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-semibold transition-colors duration-150 cursor-pointer"
          style={{ color: "var(--color-text-primary)" }}
        >
          Sign in →
        </Link>
      </p>
      </div>
    </>
  );
}

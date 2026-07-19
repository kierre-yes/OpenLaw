import Link from "next/link";
import { Mail, ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OpenLaw - Confirm your email",
};

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; error?: string }>;
}) {
  const { type, error } = await searchParams;
  const isRecovery = type === "recovery";
  const hasError = !!error;

  /* ── Error State ────────────────────────────────────── */
  if (hasError) {
    return (
      <div className="flex flex-col gap-8 py-4">
        {/* Icon */}
        <div className="flex flex-col items-center gap-5 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: "rgba(164,31,19,0.08)" }}
          >
            <AlertTriangle className="w-7 h-7" style={{ color: "var(--color-brand-red)" }} />
          </div>
          <div className="flex flex-col gap-2">
            <h2
              className="text-[1.5rem] font-semibold tracking-tight"
              style={{ color: "var(--color-text-primary)" }}
            >
              Link expired or invalid
            </h2>
            <p
              className="text-[14px] leading-relaxed max-w-xs mx-auto"
              style={{ color: "var(--color-text-secondary)" }}
            >
              This link has expired or been used already.
              Ask for a new one to continue.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full" style={{ backgroundColor: "var(--color-border-subtle)" }} />

        {/* Actions */}
        <div className="flex flex-col gap-3 w-full">
          <Link
            href="/auth/forgot-password"
            className="cursor-pointer w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-[14px] font-semibold tracking-wide transition-all duration-200 hover:shadow-md active:scale-[0.97]"
            style={{ backgroundColor: "var(--color-brand-red)", color: "var(--color-text-inverse)" }}
          >
            Request a new link
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/auth/login"
            className="text-[13px] font-medium cursor-pointer text-center transition-colors duration-150 hover:underline"
            style={{ color: "var(--color-text-secondary)" }}
          >
            ← Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  /* ── Recovery State ─────────────────────────────────── */
  if (isRecovery) {
    return (
      <div className="flex flex-col gap-8 py-4">
        {/* Icon */}
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="relative flex items-center justify-center">
            {/* Pulse ring */}
            <div
              className="absolute w-20 h-20 rounded-full animate-ping opacity-20"
              style={{ backgroundColor: "var(--color-brand-red)" }}
              aria-hidden="true"
            />
            <div
              className="relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm"
              style={{ backgroundColor: "rgba(164,31,19,0.08)" }}
            >
              <CheckCircle2 className="w-7 h-7" style={{ color: "var(--color-brand-red)" }} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h2
              className="text-[1.5rem] font-semibold tracking-tight"
              style={{ color: "var(--color-text-primary)" }}
            >
              Identity verified
            </h2>
            <p
              className="text-[14px] leading-relaxed max-w-xs mx-auto"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Your identity has been confirmed. You can now set a new password
              for your account.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full" style={{ backgroundColor: "var(--color-border-subtle)" }} />

        <Link
          href="/auth/login"
          className="cursor-pointer w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-[14px] font-semibold tracking-wide transition-all duration-200 hover:shadow-md active:scale-[0.97]"
          style={{ backgroundColor: "var(--color-brand-red)", color: "var(--color-text-inverse)" }}
        >
          Sign in with new password
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  /* ── Default: Email Confirmation Sent ───────────────── */
  return (
    <div className="flex flex-col gap-8 py-4">
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
            Check your inbox
          </h2>
          <p
            className="text-[14px] leading-relaxed max-w-xs mx-auto"
            style={{ color: "var(--color-text-secondary)" }}
          >
            We sent a confirmation link to your email. Click it to activate
            your OpenLaw account.
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full" style={{ backgroundColor: "var(--color-border-subtle)" }} />

      {/* Info card */}
      <div
        className="w-full rounded-xl px-4 py-4 flex flex-col gap-3"
        style={{
          backgroundColor: "rgba(41,47,54,0.04)",
          border: "1px solid rgba(41,47,54,0.08)",
        }}
      >
        <p className="text-[12px] font-semibold uppercase tracking-widest" style={{ color: "var(--color-text-secondary)" }}>
          What to expect
        </p>
        {[
          "Check your spam folder if you don't see it.",
          "The link expires in 24 hours.",
          "You only need to confirm once.",
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
        className="text-[13px] font-semibold cursor-pointer text-center transition-colors duration-150 hover:underline"
        style={{ color: "var(--color-text-primary)" }}
      >
        ← Back to sign in
      </Link>
    </div>
  );
}

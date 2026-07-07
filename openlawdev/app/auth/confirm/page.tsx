import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OpenLaw — Confirm your email",
};

export default function ConfirmPage({
  searchParams,
}: {
  searchParams: { type?: string; error?: string };
}) {
  const isRecovery = searchParams.type === "recovery";
  const hasError = !!searchParams.error;

  return (
    <div className="flex flex-col items-center gap-8 py-4 text-center">
      {/* Icon */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm"
        style={{ backgroundColor: "rgba(41,47,54,0.06)" }}
      >
        <Mail className="w-7 h-7" style={{ color: "#292F36" }} />
      </div>

      {hasError ? (
        <>
          <div className="flex flex-col gap-2">
            <h2
              className="text-[1.5rem] font-semibold tracking-tight"
              style={{ color: "#292F36" }}
            >
              Link expired or invalid
            </h2>
            <p className="text-[14px] leading-relaxed max-w-xs mx-auto" style={{ color: "#8F7A6E" }}>
              This confirmation link has expired or has already been used.
              Request a new one to continue.
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <Link
              href="/auth/forgot-password"
              className="
                cursor-pointer w-full inline-flex items-center justify-center gap-2
                px-5 py-3.5 rounded-xl text-[14px] font-semibold tracking-wide
                transition-all duration-200 hover:shadow-md active:scale-[0.98]
              "
              style={{ backgroundColor: "#A41F13", color: "#FAF5F1" }}
            >
              Request a new link
            </Link>
            <Link
              href="/auth/login"
              className="text-[13px] font-medium cursor-pointer"
              style={{ color: "#8F7A6E" }}
            >
              ← Back to sign in
            </Link>
          </div>
        </>
      ) : isRecovery ? (
        <>
          <div className="flex flex-col gap-2">
            <h2
              className="text-[1.5rem] font-semibold tracking-tight"
              style={{ color: "#292F36" }}
            >
              Password reset ready
            </h2>
            <p className="text-[14px] leading-relaxed max-w-xs mx-auto" style={{ color: "#8F7A6E" }}>
              Your identity has been verified. You can now set a new password
              for your account.
            </p>
          </div>
          <Link
            href="/auth/login"
            className="
              cursor-pointer w-full inline-flex items-center justify-center gap-2
              px-5 py-3.5 rounded-xl text-[14px] font-semibold tracking-wide
              transition-all duration-200 hover:shadow-md active:scale-[0.98]
            "
            style={{ backgroundColor: "#A41F13", color: "#FAF5F1" }}
          >
            Sign in with new password
            <ArrowRight className="w-4 h-4" />
          </Link>
        </>
      ) : (
        <>
          {/* Default: email confirmation */}
          <div className="flex flex-col gap-2">
            <h2
              className="text-[1.5rem] font-semibold tracking-tight"
              style={{ color: "#292F36" }}
            >
              Check your inbox
            </h2>
            <p className="text-[14px] leading-relaxed max-w-xs mx-auto" style={{ color: "#8F7A6E" }}>
              We sent a confirmation link to your email. Click it to activate
              your OpenLaw account.
            </p>
          </div>

          {/* Info card */}
          <div
            className="w-full rounded-xl px-4 py-4 flex flex-col gap-3 text-left"
            style={{
              backgroundColor: "rgba(41,47,54,0.04)",
              borderLeft: "3px solid rgba(41,47,54,0.15)",
            }}
          >
            {[
              "Check your spam or junk folder if you don't see it.",
              "The link expires in 24 hours.",
              "You only need to confirm once.",
            ].map((tip) => (
              <p key={tip} className="flex items-start gap-2.5 text-[12px]" style={{ color: "#8F7A6E" }}>
                <span
                  className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                  style={{ backgroundColor: "rgba(41,47,54,0.3)" }}
                />
                {tip}
              </p>
            ))}
          </div>

          <Link
            href="/auth/login"
            className="text-[13px] font-semibold cursor-pointer transition-colors duration-150"
            style={{ color: "#292F36" }}
          >
            ← Back to sign in
          </Link>
        </>
      )}
    </div>
  );
}

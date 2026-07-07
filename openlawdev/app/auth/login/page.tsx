"use client";

import { useActionState, useState } from "react";
import { signIn } from "../actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import LoadingScreen from "@/components/landing/LoadingScreen";

const initialState = { error: undefined, message: undefined };

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(signIn, initialState);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSwitchClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setIsNavigating(true);
    setTimeout(() => {
      setIsNavigating(false);
      router.push(href);
    }, 1200);
  };

  return (
    <>
      <LoadingScreen isLoading={isNavigating} />
      <div className="flex flex-col gap-8">
      {/* Heading */}
      <div className="flex flex-col gap-1.5">
        <h2
          className="text-[1.625rem] font-semibold tracking-tight"
          style={{ color: "#292F36" }}
        >
          Sign in to OpenLaw
        </h2>
        <p className="text-[14px]" style={{ color: "#8F7A6E" }}>
          Access your legal research workspace.
        </p>
      </div>

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
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
          {state.error}
        </div>
      )}

      {/* Form */}
      <form action={formAction} noValidate className="flex flex-col gap-5">
        {/* Email */}
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
              focus:ring-2
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

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-[13px] font-semibold"
              style={{ color: "#292F36" }}
            >
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-[12px] font-medium transition-colors duration-150 cursor-pointer"
              style={{ color: "#A41F13" }}
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              disabled={isPending}
              placeholder="••••••••"
              className="
                w-full rounded-xl pl-4 pr-11 py-3 text-[14px] font-normal
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
        </div>

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
            focus-visible:outline-none focus-visible:ring-2
          "
          style={{
            backgroundColor: "#A41F13",
            color: "#FAF5F1",
          }}
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div
          className="flex-1 h-px"
          style={{ backgroundColor: "rgba(41,47,54,0.1)" }}
        />
        <span className="text-[12px]" style={{ color: "rgba(41,47,54,0.4)" }}>
          New to OpenLaw?
        </span>
        <div
          className="flex-1 h-px"
          style={{ backgroundColor: "rgba(41,47,54,0.1)" }}
        />
      </div>

      {/* Sign-up link */}
      <p className="text-center text-[13px]" style={{ color: "#8F7A6E" }}>
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/sign-up"
          onClick={(e) => handleSwitchClick(e, "/auth/sign-up")}
          className="font-semibold transition-colors duration-150 cursor-pointer"
          style={{ color: "#292F36" }}
        >
          Create one →
        </Link>
      </p>
      </div>
    </>
  );
}

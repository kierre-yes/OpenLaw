import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import Link from "next/link";
import { ArrowLeft, User, ShieldCheck, ShieldAlert, LogOut } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OpenLaw - Account",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Formatting helpers
  const emailInitials = user.email ? user.email.charAt(0).toUpperCase() : "?";
  const formattedCreatedDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";
  const formattedLastSignIn = user.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "N/A";
  
  const isEmailConfirmed = !!user.email_confirmed_at;
  const authProvider = user.app_metadata?.provider
    ? user.app_metadata.provider.charAt(0).toUpperCase() + user.app_metadata.provider.slice(1)
    : "Email";

  return (
    <div className="flex-1 w-full flex flex-col items-center px-5 sm:px-8 py-12 sm:py-16">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col gap-4">
          <Link
            href="/search"
            className="
              cursor-pointer inline-flex items-center gap-1.5 text-[13px] font-semibold 
              transition-colors duration-150 hover:text-brand-red
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60 rounded-md
            "
            style={{ color: "var(--color-text-secondary)" }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Search
          </Link>
          
          <div className="flex flex-col gap-1.5">
            <h1
              className="text-[2rem] font-semibold tracking-tight"
              style={{ color: "var(--color-text-primary)" }}
            >
              Account
            </h1>
            <p className="text-[14px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              Verify your login credentials and current research session status.
            </p>
          </div>
        </div>

        {/* Legal Notepad Container */}
        <div
          style={{
            backgroundColor: "var(--color-paper-bg)",
            borderColor: "var(--color-border-subtle)",
          }}
          className="w-full relative flex flex-col rounded-[24px] border pl-12 pr-7 py-8 shadow-sm overflow-visible z-10"
        >
          {/* Ruled Legal Notepad red margin line indicator */}
          <div
            className="absolute top-0 bottom-0 left-7 w-[1.5px] bg-brand-red/20"
            aria-hidden="true"
          />

          {/* Memo/Sticky Tape adhesive graphic at top left */}
          <div
            style={{ backgroundColor: "rgba(143, 122, 110, 0.1)" }}
            className="absolute -top-2.5 left-10 w-12 h-5 border-l border-r border-text-secondary/5 transform -rotate-1 rounded-sm"
            aria-hidden="true"
          />

          {/* Sticky Page Marker / Document Tab (User icon badge) */}
          <div
            style={{ backgroundColor: "var(--color-brand-red)", color: "var(--color-text-inverse)" }}
            className="
              absolute -top-3.5 right-6 
              px-3.5 py-2 rounded-lg 
              shadow-md shadow-brand-red/10
              transform rotate-2 
              text-xs font-bold tracking-wide
              flex items-center gap-1.5
              shrink-0 select-none
            "
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile</span>
          </div>

          {/* Card Body */}
          <div className="flex flex-col gap-8 mt-4 relative z-10">
            
            {/* Header / Avatar Row */}
            <div className="flex items-center gap-4 border-b pb-6" style={{ borderColor: "var(--color-border-subtle)" }}>
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center text-[1.25rem] font-bold shadow-sm"
                style={{ backgroundColor: "var(--color-brand-red)", color: "var(--color-text-inverse)" }}
              >
                {emailInitials}
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-semibold" style={{ color: "var(--color-text-primary)" }}>
                  {user.email}
                </span>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              
              {/* User ID */}
              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-semibold tracking-wider" style={{ color: "var(--color-text-secondary)" }}>
                  User identifier
                </span>
                <span className="text-[14px] font-mono break-all" style={{ color: "var(--color-text-primary)" }}>
                  {user.id}
                </span>
              </div>

              {/* Status */}
              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-semibold tracking-wider" style={{ color: "var(--color-text-secondary)" }}>
                  Verification status
                </span>
                <div className="flex items-center gap-1.5 text-[14px] font-medium">
                  {isEmailConfirmed ? (
                    <>
                      <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                      <span style={{ color: "var(--color-text-primary)" }}>Email Confirmed</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-4 h-4 text-[#EF4444]" />
                      <span style={{ color: "var(--color-text-primary)" }}>Email Pending</span>
                    </>
                  )}
                </div>
              </div>

              {/* Provider */}
              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-semibold tracking-wider" style={{ color: "var(--color-text-secondary)" }}>
                  Auth provider
                </span>
                <span className="text-[14px] font-medium" style={{ color: "var(--color-text-primary)" }}>
                  {authProvider}
                </span>
              </div>

              {/* Created At */}
              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-semibold tracking-wider" style={{ color: "var(--color-text-secondary)" }}>
                  Member since
                </span>
                <span className="text-[14px] font-medium" style={{ color: "var(--color-text-primary)" }}>
                  {formattedCreatedDate}
                </span>
              </div>

              {/* Last Sign In */}
              <div className="flex flex-col gap-1 md:col-span-2">
                <span className="text-[12px] font-semibold tracking-wider" style={{ color: "var(--color-text-secondary)" }}>
                  Last active session
                </span>
                <span className="text-[14px] font-medium" style={{ color: "var(--color-text-primary)" }}>
                  {formattedLastSignIn}
                </span>
              </div>

            </div>

            {/* Actions Section */}
            <div className="border-t pt-6 mt-2 flex justify-end" style={{ borderColor: "var(--color-border-subtle)" }}>
              <form action={signOut}>
                <button
                  type="submit"
                  className="
                    cursor-pointer inline-flex items-center justify-center gap-2
                    px-5 py-2.5 rounded-xl text-[13px] font-semibold tracking-wide
                    border border-[rgba(164,31,19,0.2)] transition-all duration-200 ease-in-out
                    hover:bg-[rgba(164,31,19,0.05)] hover:border-[#A41F13] active:scale-[0.97]
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60 focus-visible:ring-offset-2
                  "
                  style={{ color: "var(--color-brand-red)" }}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out of Session
                </button>
              </form>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

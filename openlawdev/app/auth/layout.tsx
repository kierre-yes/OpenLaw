import type { Metadata } from "next";
import Image from "next/image";
import { Scale } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "OpenLaw - Sign In",
  description:
    "Access Philippine legal research powered by AI and grounded in exact sources.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen w-full flex flex-col lg:flex-row"
      style={{ backgroundColor: "var(--color-page-bg)" }}
    >
      {/* ── LEFT: Brand Panel ── */}
      <aside
        className="hidden lg:flex lg:w-[42%] xl:w-[40%] flex-col justify-between px-14 py-14 relative overflow-hidden shrink-0"
        style={{ backgroundColor: "var(--color-page-bg)", color: "var(--color-text-primary)" }}
      >
        {/* Subtle texture lines */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="absolute top-0 left-0 right-0 h-[1.5px]"
            style={{ backgroundColor: "rgba(41,47,54,0.04)" }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-[1.5px]"
            style={{ backgroundColor: "rgba(41,47,54,0.04)" }}
          />
          {/* Vertical divider line */}
          <div
            className="absolute top-0 bottom-0 right-0 w-[1.5px]"
            style={{ backgroundColor: "var(--color-border-subtle)" }}
          />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex justify-center w-full">
          <Link href="/" aria-label="OpenLaw home" className="flex justify-center w-full">
            <div className="relative w-150 h-54">
              <Image
                src="/OpenLAW Logo_full.svg"
                alt="OpenLaw"
                fill
                priority
                className="object-contain object-center"
              />
            </div>
          </Link>
        </div>

        {/* Brand message inside Paper Box Card */}
        <div
          style={{
            backgroundColor: "var(--color-paper-bg)",
            borderColor: "var(--color-border-subtle)",
          }}
          className="relative flex flex-col gap-6 rounded-2xl border pl-12 pr-7 py-8 shadow-sm overflow-visible z-10"
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

          {/* Sticky Page Marker / Document Tab (Scale icon badge) */}
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
            <Scale className="w-3.5 h-3.5" />
            <span>OpenLaw</span>
          </div>

          {/* Text Content */}
          <div className="flex flex-col gap-4 mt-2">
            <h1
              className="text-[1.75rem] font-semibold leading-[1.25] tracking-tight"
              style={{ color: "var(--color-text-primary)" }}
            >
              Research backed by{" "}
              <span
                className="underline underline-offset-[6px] decoration-[2.5px]"
                style={{ color: "var(--color-brand-red)", textDecorationColor: "var(--color-brand-red)" }}
              >
                exact sources.
              </span>
            </h1>
            <p
              className="text-[14px] leading-relaxed font-normal"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Every answer cites the exact law or case it came from.
              No made-up law. No vague references.
            </p>
          </div>

          {/* Trust points */}
          <ul className="flex flex-col gap-3.5 mt-1">
            {[
              "Statutes and Republic Acts",
              "Supreme Court Decisions",
              "Executive and Legal Orders",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span
                  style={{
                    color: "var(--color-brand-red)",
                    backgroundColor: "rgba(164, 31, 19, 0.07)",
                  }}
                  className="shrink-0 w-6 h-6 flex items-center justify-center rounded-md text-xs font-semibold"
                >
                  ✓
                </span>
                <span
                  className="text-[13px] font-semibold leading-snug"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom note */}
        <p
          className="relative z-10 text-[11px] font-medium tracking-wide"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Built for legal research with source-backed answers.
        </p>
      </aside>

      {/* ── RIGHT: Form Area ── */}
      <main className="flex flex-1 flex-col items-center justify-center px-5 py-14 sm:px-8">
        {/* Mobile logo */}
        <div className="lg:hidden mb-10 self-start">
          <Link href="/" aria-label="OpenLaw home">
            <div className="relative w-36 h-12">
              <Image
                src="/OpenLAW Logo_full.svg"
                alt="OpenLaw"
                fill
                priority
                className="object-contain object-left"
              />
            </div>
          </Link>
        </div>

        <div className="w-full max-w-[420px]">{children}</div>
      </main>
    </div>
  );
}

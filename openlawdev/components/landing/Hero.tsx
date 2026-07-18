import Image from "next/image";
import Link from "next/link";
import { Scale } from "lucide-react";

export default function Hero({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  return (
    <section
      style={{ backgroundColor: "var(--page-bg)", color: "var(--text-primary)" }}
      className="w-full"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 py-20 sm:py-28 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* ── LEFT: Text Content ── */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left w-full">
            {/* Headline */}
            <h1
              className="text-4xl sm:text-5xl lg:text-[3.25rem] leading-[1.15] font-semibold tracking-tight max-w-xl"
              style={{ color: "#292F36" }}
            >
              Ask about Philippine law. Get answers from the{" "}
              <span
                className="underline underline-offset-[6px] decoration-[3px] font-bold text-[1.06em] inline-block"
                style={{ color: "#A41F13" }}
              >
                exact source
              </span>{" "}
              that matters.
            </h1>

            {/* Supporting paragraph */}
            <p
              className="mt-6 text-lg leading-relaxed max-w-xl font-normal"
              style={{ color: "#8F7A6E" }}
            >
              Search laws, court rulings, and legal orders. AI finds the source and shows it to you.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/auth/sign-up"
                style={{
                  backgroundColor: "#A41F13",
                  color: "#FAF5F1",
                }}
                className="
                  cursor-pointer
                  inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl
                  text-[15px] font-semibold tracking-wide
                  transition-all duration-200 ease-in-out
                  hover:bg-[#8d1a0f] hover:shadow-lg hover:shadow-[#A41F13]/15
                  active:scale-[0.97]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A41F13]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF5F1]
                "
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                Join Beta
              </Link>

              {/* Secondary CTA */}
              <Link
                href="#steps"
                style={{
                  backgroundColor: "var(--page-bg)",
                  color: "#292F36",
                  borderColor: "rgba(41, 47, 54, 0.25)",
                }}
                className="
                  cursor-pointer
                  inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl
                  border
                  text-[15px] font-semibold tracking-wide
                  transition-all duration-200 ease-in-out
                  hover:bg-[#E0DBD8]/40
                  active:scale-[0.97]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#292F36]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF5F1]
                "
              >
                See How It Works
              </Link>
            </div>
          </div>

          {/* ── RIGHT: Visual Element (Legal Notepad File Style) ── */}
          <div className="flex items-center justify-center w-full lg:justify-end">
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderColor: "rgba(41, 47, 54, 0.08)",
              }}
              className="cursor-pointer relative w-full max-w-2xl rounded-[24px] border pl-12 pr-7 py-8 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 overflow-visible"
            >
              {/* Ruled Legal Notepad red margin line indicator */}
              <div 
                className="absolute top-0 bottom-0 left-7 w-[1.5px] bg-[#A41F13]/25" 
                aria-hidden="true" 
              />

              {/* Memo/Sticky Tape adhesive graphic at top left */}
              <div 
                style={{ backgroundColor: "rgba(143, 122, 110, 0.12)" }}
                className="absolute -top-2.5 left-10 w-12 h-5 border-l border-r border-[#8F7A6E]/5 transform -rotate-1 rounded-sm"
                aria-hidden="true"
              />

              {/* Sticky Page Marker / Document Tab (Step Number Badge) */}
              <div
                style={{ backgroundColor: "#A41F13", color: "#FAF5F1" }}
                className="
                  absolute -top-3.5 right-6 
                  px-3.5 py-2 rounded-lg 
                  shadow-md shadow-[#A41F13]/10
                  transform rotate-2 
                  text-xs font-bold tracking-wider 
                  flex items-center gap-1.5
                  shrink-0 select-none
                "
              >
                <Scale className="w-3.5 h-3.5" />
                <span>#OpenLaw</span>
              </div>

              {/* Main graphic container styled like a pinned legal page */}
              <div className="relative w-full aspect-[16/10] bg-[var(--page-bg)] rounded-xl overflow-hidden border border-[var(--border-subtle)] shadow-inner">
                <Image
                  src="/visual_element_hero.svg"
                  alt="OpenLaw Platform Mockup"
                  fill
                  priority
                  sizes="(max-w-1024px) 100vw, 50vw"
                  className="object-contain p-2.5"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

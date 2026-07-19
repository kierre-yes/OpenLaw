import Image from "next/image";
import Link from "next/link";
import { Mail, Scale } from "lucide-react";

const footerLinks = [
  {
    heading: "Product",
    links: [
      { label: "Search", href: "/search" },
      { label: "Sources", href: "/sources" },
      { label: "Saved Answers", href: "/saved" },
      { label: "History", href: "/history" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "How it works", href: "/how-it-works" },
      { label: "FAQ", href: "/faq" },
      { label: "Search Tips", href: "/tips" },
      { label: "Documentation", href: "/docs" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
      { label: "Disclaimer", href: "/disclaimer" },
      { label: "Source Policy", href: "/source-policy" },
    ],
  },
];

export default function Footer({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const currentYear = new Date().getFullYear();

  // Filter out the Product column if the user is not authenticated
  const visibleFooterLinks = isAuthenticated 
    ? footerLinks 
    : footerLinks.filter((section) => section.heading !== "Product");

  return (
    <footer
      style={{ backgroundColor: "var(--color-text-primary)", color: "var(--color-text-inverse)" }}
      className="w-full"
      role="contentinfo"
    >
      {/* ── Main Footer Body ── */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 lg:gap-10">

          {/* Brand Column */}
          <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
            {/* Logo */}
            <div className="flex items-center">
              <div className="relative w-44 h-16 overflow-hidden flex items-center justify-start -ml-3">
                <Image
                  src="/OpenLAW Logo_full.svg"
                  alt="OpenLaw Logo"
                  width={180}
                  height={180}
                  className="min-w-[170px] min-h-[170px] object-contain"
                />
              </div>
            </div>

            {/* Description */}
            <p
              style={{ color: "rgba(250, 245, 241, 0.55)" }}
              className="text-[13px] font-normal leading-relaxed max-w-xs"
            >
              Search Philippine laws, court rulings, and legal orders.
              Every answer shows the exact source it came from.
            </p>

            {/* Disclaimer note */}
            <p
              style={{
                color: "rgba(250, 245, 241, 0.35)",
                borderColor: "rgba(250, 245, 241, 0.08)",
              }}
              className="text-[11px] font-normal leading-relaxed max-w-xs border-t pt-4 mt-auto"
            >
              OpenLaw is for research only. It does not give legal advice
              and is not a replacement for a licensed Philippine attorney.
            </p>
          </div>

          {/* Link Columns */}
          {visibleFooterLinks.map((section) => {
            const isLocked = section.heading === "Resources" || section.heading === "Legal";
            return (
              <div 
                key={section.heading} 
                className={`flex flex-col gap-4 relative overflow-visible ${isLocked ? "select-none min-h-[140px] z-20" : ""}`}
              >
                {/* Visual content area - faded if locked */}
                <div className={`flex flex-col gap-4 transition-opacity duration-300 ${isLocked ? "opacity-[0.18]" : ""}`}>
                  <h3
                    style={{ color: "rgba(250, 245, 241, 0.45)" }}
                    className="text-[11px] font-bold tracking-widest uppercase"
                  >
                    {section.heading}
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={isLocked ? "#" : link.href}
                          style={{ color: "rgba(250, 245, 241, 0.75)" }}
                          className={`
                            text-[13px] font-medium leading-snug
                            transition-colors duration-150
                            hover:text-text-inverse
                            focus-visible:outline-none focus-visible:text-text-inverse
                            ${isLocked ? "cursor-default pointer-events-none" : "cursor-pointer"}
                          `}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Locked Red Warning Tape Overlay */}
                {isLocked && (
                  <div className="absolute inset-0 flex items-center justify-center overflow-visible pointer-events-none z-30">
                    <div 
                      style={{ 
                        backgroundColor: "var(--color-brand-red)", 
                        color: "var(--color-text-inverse)",
                        borderColor: "rgba(250, 245, 241, 0.15)"
                      }}
                      className="
                        absolute w-[270px] py-2.5 text-center 
                        text-[10px] sm:text-[11px] font-bold tracking-wider 
                        transform -rotate-12 
                        shadow-lg border-y-[1.5px] 
                        whitespace-nowrap z-40 rounded-lg
                      "
                    >
                      Coming soon. Stay tuned.
                    </div>
                  </div>
                )}
              </div>
            );
          })}

        </div>

        {/* ── Divider ── */}
        <div
          style={{ borderColor: "rgba(250, 245, 241, 0.08)" }}
          className="border-t mt-12 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
        >
          {/* Left: Copyright and visual stamp */}
          <div className="flex items-center gap-4 flex-wrap">
            <p
              style={{ color: "rgba(250, 245, 241, 0.35)" }}
              className="text-[12px] font-medium tracking-wide"
            >
              © {currentYear} OpenLaw. All rights reserved.
            </p>
            <div className="relative w-20 h-14 shrink-0 select-none">
              <Image
                src="/footer_visual_element.svg"
                alt="OpenLaw Seal"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Right: Contact + Scale icon */}
          <div className="flex items-center gap-5">
            <a
              href="mailto:reyeskierchristian64@gmail.com"
              style={{ color: "rgba(250, 245, 241, 0.5)" }}
              className="
                cursor-pointer
                inline-flex items-center gap-1.5
                text-[12px] font-medium
                transition-colors duration-150
                hover:text-text-inverse
                focus-visible:outline-none focus-visible:text-text-inverse
              "
            >
              <Mail className="w-3.5 h-3.5" />
              reyeskierchristian64@gmail.com
            </a>

            {/* Divider pip */}
            <span
              style={{ backgroundColor: "rgba(250, 245, 241, 0.12)" }}
              className="w-px h-4 hidden sm:block"
              aria-hidden="true"
            />

            {/* Scale icon mark */}
            <span
              style={{ color: "rgba(164, 31, 19, 0.7)" }}
              aria-label="OpenLaw - Philippine Legal Research"
              title="OpenLaw - Philippine Legal Research"
            >
              <Scale className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

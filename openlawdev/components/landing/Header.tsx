"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import { LogOut, User } from "lucide-react";
import { useTranslations } from "next-intl";



export default function Header({
  onLinkClick,
  isAuthenticated = false,
  userEmail,
}: {
  onLinkClick?: (href: string) => void;
  isAuthenticated?: boolean;
  userEmail?: string;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [activeLink, setActiveLink] = useState("");

  const emailInitials = userEmail ? userEmail.charAt(0).toUpperCase() : null;
  const t = useTranslations("Header");

  const navLinks = [
    { label: t("howItWorks"), href: "#steps" },
    { label: t("faq"), href: "#faq" },
  ];

  useEffect(() => {
    const matchingLink = navLinks.find(
      (link) =>
        !link.href.startsWith("#") &&
        (pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href)))
    );
    const timer = setTimeout(() => {
      if (matchingLink) {
        setActiveLink(matchingLink.label);
      } else if (pathname === "/" && !isAuthenticated) {
        setActiveLink(t("howItWorks"));
      } else {
        setActiveLink("");
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname, isAuthenticated, navLinks, t]);

  const handleNavClick = (e: React.MouseEvent, href: string, label: string) => {
    // Only prevent default and intercept if it's an anchor link
    if (href.startsWith("#")) {
      e.preventDefault();
      setActiveLink(label);
      if (onLinkClick) {
        onLinkClick(href);
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <header
        role="banner"
        style={{
          borderBottom: scrolled
            ? "1px solid var(--border-subtle)"
            : "1px solid transparent",
          boxShadow: scrolled
            ? "0 4px 20px rgba(0, 0, 0, 0.05)"
            : "none",
          transition: "box-shadow 0.3s ease, border-color 0.3s ease, background-color 0.3s ease, color 0.3s ease",
        }}
        className="fixed top-0 left-0 right-0 z-50 w-full bg-[#FAF5F1] dark:bg-[#1A1E23] text-[#292F36] dark:text-[#FAF5F1]"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="flex h-20 items-center justify-between gap-6">
            {/* ── LEFT: Logo ── */}
            <div className="flex shrink-0 items-center">
              <Link
                href="/"
                aria-label="OpenLaw home"
                className="cursor-pointer flex items-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[#292F36]/40"
              >
                <div className="relative w-36 h-14 overflow-hidden flex items-center justify-center">
                  <Image
                    src="/OpenLAW Logo_full.svg"
                    alt="OpenLaw Logo"
                    width={170}
                    height={170}
                    priority
                    className="min-w-[150px] min-h-[150px] object-contain"
                  />
                </div>
              </Link>
            </div>

            {/* ── CENTER: Primary Nav (desktop) ── */}
            <nav
              aria-label="Primary navigation"
              className="hidden md:flex items-center gap-1"
            >
              {navLinks.map(({ label, href }) => {
                const isActive = activeLink === label;
                return (
                  <Link
                    key={label}
                    href={href}
                    onClick={(e) => handleNavClick(e, href, label)}
                    aria-current={isActive ? "page" : undefined}
                    style={{
                      color: isActive ? "#292F36" : "rgba(41, 47, 54, 0.65)",
                      backgroundColor: isActive
                        ? "rgba(41, 47, 54, 0.08)"
                        : "transparent",
                      fontFamily: "inherit",
                    }}
                    className="
                      cursor-pointer relative px-4 py-2 rounded-lg text-sm font-semibold
                      transition-all duration-200 ease-in-out
                      hover:bg-[rgba(41,47,54,0.08)] hover:text-[#292F36]
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#292F36]/40
                      tracking-wide
                    "
                  >
                    {label}
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-[#A41F13]"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* ── RIGHT: CTA (desktop) ── */}
            <div className="hidden md:flex items-center gap-3 shrink-0">
              <Link
                href="/auth/sign-up"
                style={{
                  backgroundColor: "#A41F13",
                  color: "#FAF5F1",
                  fontFamily: "inherit",
                }}
                className="
                  cursor-pointer inline-flex items-center gap-2 px-5 py-2 rounded-lg
                  text-sm font-semibold tracking-wide
                  transition-all duration-200 ease-in-out
                  hover:bg-[#8d1a0f] hover:shadow-md hover:shadow-black/10
                  active:scale-[0.97]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A41F13]/60
                "
              >
                Join Beta
              </Link>
            </div>

            {/* ── MOBILE: Hamburger ── */}
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((prev) => !prev)}
              style={{ color: "rgba(41, 47, 54, 0.85)" }}
              className="
                cursor-pointer md:hidden flex flex-col items-center justify-center w-9 h-9 rounded-lg gap-[5px]
                hover:bg-[rgba(41,47,54,0.08)] transition-all duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#292F36]/40
              "
            >
              <span
                aria-hidden="true"
                style={{
                  transform: menuOpen
                    ? "rotate(45deg) translateY(7px)"
                    : "none",
                  backgroundColor: "currentColor",
                }}
                className="block h-[1.5px] w-5 rounded-full transition-transform duration-300"
              />
              <span
                aria-hidden="true"
                style={{
                  opacity: menuOpen ? 0 : 1,
                  backgroundColor: "currentColor",
                }}
                className="block h-[1.5px] w-5 rounded-full transition-opacity duration-200"
              />
              <span
                aria-hidden="true"
                style={{
                  transform: menuOpen
                    ? "rotate(-45deg) translateY(-7px)"
                    : "none",
                  backgroundColor: "currentColor",
                }}
                className="block h-[1.5px] w-5 rounded-full transition-transform duration-300"
              />
            </button>
          </div>
        </div>

        {/* ── MOBILE MENU ── */}
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="false"
          aria-label="Mobile navigation"
          style={{
            maxHeight: menuOpen ? "400px" : "0",
            opacity: menuOpen ? 1 : 0,
            overflow: "hidden",
            transition:
              "max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease",
            borderTop: menuOpen ? "1px solid var(--border-subtle)" : "none",
          }}
          className="md:hidden bg-[#FAF5F1] dark:bg-[#1A1E23]"
        >
          <nav
            aria-label="Mobile navigation"
            className="flex flex-col px-5 py-4 gap-1"
          >
            {navLinks.map(({ label, href }) => {
              const isActive = activeLink === label;
              return (
                <Link
                  key={label}
                  href={href}
                  onClick={(e) => {
                    setMenuOpen(false);
                    handleNavClick(e, href, label);
                  }}
                  aria-current={isActive ? "page" : undefined}
                  style={{
                    color: isActive ? "#292F36" : "rgba(41, 47, 54, 0.65)",
                    backgroundColor: isActive
                      ? "rgba(41, 47, 54, 0.06)"
                      : "transparent",
                  }}
                  className="
                    cursor-pointer flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold
                    hover:bg-[rgba(41,47,54,0.06)] hover:text-[#292F36]
                    transition-all duration-150
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#292F36]/40
                  "
                >
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="h-4 w-[2px] rounded-full bg-[#A41F13]"
                    />
                  )}
                  {label}
                </Link>
              );
            })}

            {/* Mobile CTA row */}
            <div className="mt-3 pt-3 border-t border-[rgba(41, 47, 54, 0.08)] flex items-center gap-3">
              <Link
                href="/auth/sign-up"
                onClick={(e) => {
                  setMenuOpen(false);
                  if (onLinkClick) {
                    e.preventDefault();
                    onLinkClick("/auth/sign-up");
                  }
                }}
                style={{
                  backgroundColor: "#A41F13",
                  color: "#FAF5F1",
                }}
                className="
                  cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
                  text-sm font-semibold flex-1
                  hover:bg-[#8d1a0f] transition-all duration-150
                  active:scale-[0.97]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A41F13]/60
                "
              >
                Join Beta
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Spacer so content doesn't hide under fixed header */}
      <div className="h-20" aria-hidden="true" />
    </>
  );
}

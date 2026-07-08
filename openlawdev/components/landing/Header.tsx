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

  const authNavLinks = [
    { label: t("search"), href: "/search" },
    { label: t("sources"), href: "/sources" },
    { label: t("history"), href: "/history" },
    { label: t("settings"), href: "/settings" },
  ];

  const publicNavLinks = [
    { label: t("howItWorks"), href: "#steps" },
    { label: t("faq"), href: "#faq" },
  ];

  const navLinks = isAuthenticated ? authNavLinks : publicNavLinks;

  useEffect(() => {
    const matchingLink = navLinks.find(
      (link) =>
        !link.href.startsWith("#") &&
        (pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href)))
    );
    if (matchingLink) {
      setActiveLink(matchingLink.label);
    } else if (pathname === "/" && !isAuthenticated) {
      setActiveLink(t("howItWorks"));
    } else {
      setActiveLink("");
    }
  }, [pathname, isAuthenticated, navLinks]);

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

            {/* ── RIGHT: Account + CTA (desktop) ── */}
            <div className="hidden md:flex items-center gap-3 shrink-0">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/account"
                    aria-label="Account"
                    style={{ color: "rgba(41, 47, 54, 0.85)" }}
                    className="
                      cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold
                      hover:bg-[rgba(41,47,54,0.08)] hover:text-[#292F36]
                      transition-all duration-200 ease-in-out
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#292F36]/40
                    "
                  >
                    {emailInitials ? (
                      <span
                        aria-hidden="true"
                        className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold shadow-sm"
                        style={{ backgroundColor: "#A41F13", color: "#FAF5F1" }}
                      >
                        {emailInitials}
                      </span>
                    ) : (
                      <span
                        aria-hidden="true"
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(41,47,54,0.25)] bg-[rgba(41,47,54,0.05)]"
                      >
                        <User className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <span className="hidden lg:inline text-[13px]">
                      {t("account")}
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setShowSignOutModal(true)}
                    aria-label="Sign out"
                    style={{ color: "rgba(41, 47, 54, 0.85)" }}
                    className="
                      cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold
                      hover:bg-[rgba(41,47,54,0.08)] hover:text-[#292F36]
                      transition-all duration-200 ease-in-out
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#292F36]/40
                    "
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                  <span
                    aria-hidden="true"
                    className="h-5 w-px bg-[rgba(41,47,54,0.15)]"
                  />
                  <Link
                    href="/search"
                    style={{
                      backgroundColor: "#A41F13",
                      color: "#FAF5F1",
                      fontFamily: "inherit",
                    }}
                    className="
                      cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg
                      text-sm font-semibold tracking-wide
                      transition-all duration-200 ease-in-out
                      hover:bg-[#8d1a0f] hover:shadow-md hover:shadow-black/10
                      active:scale-[0.97]
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A41F13]/60
                    "
                  >
                    <svg
                      width="14"
                      height="14"
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
                    {t("newSearch")}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={(e) => {
                      if (onLinkClick) {
                        e.preventDefault();
                        onLinkClick("/auth/login");
                      }
                    }}
                    style={{ color: "rgba(41, 47, 54, 0.85)" }}
                    className="
                      cursor-pointer px-4 py-2 rounded-lg text-sm font-semibold
                      hover:bg-[rgba(41,47,54,0.08)] hover:text-[#292F36]
                      transition-all duration-200 ease-in-out
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#292F36]/40
                    "
                  >
                    {t("signIn")}
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    onClick={(e) => {
                      if (onLinkClick) {
                        e.preventDefault();
                        onLinkClick("/auth/sign-up");
                      }
                    }}
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
                    {t("createAccount")}
                  </Link>
                </>
              )}
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
              {isAuthenticated ? (
                <>
                  <Link
                    href="/account"
                    style={{ color: "rgba(41, 47, 54, 0.75)" }}
                    className="
                      cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold
                      hover:bg-[rgba(41,47,54,0.06)] hover:text-[#292F36]
                      transition-all duration-150 flex-1 justify-center
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#292F36]/40
                    "
                  >
                    {emailInitials ? (
                      <span
                        aria-hidden="true"
                        className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold shadow-sm"
                        style={{ backgroundColor: "#A41F13", color: "#FAF5F1" }}
                      >
                        {emailInitials}
                      </span>
                    ) : (
                      <span
                        aria-hidden="true"
                        className="flex h-5 w-5 items-center justify-center rounded-full border border-[rgba(41,47,54,0.25)] bg-[rgba(41,47,54,0.05)]"
                      >
                        <User className="w-3 h-3" />
                      </span>
                    )}
                    {t("account")}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      setShowSignOutModal(true);
                    }}
                    style={{
                      backgroundColor: "#A41F13",
                      color: "#FAF5F1",
                    }}
                    className="
                      w-full cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
                      text-sm font-semibold
                      hover:bg-[#8d1a0f] transition-all duration-150
                      active:scale-[0.97]
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A41F13]/60
                    "
                  >
                    <LogOut className="w-4 h-4" /> {t("signOut")}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={(e) => {
                      setMenuOpen(false);
                      if (onLinkClick) {
                        e.preventDefault();
                        onLinkClick("/auth/login");
                      }
                    }}
                    style={{ color: "rgba(41, 47, 54, 0.75)" }}
                    className="
                      cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold
                      hover:bg-[rgba(41,47,54,0.06)] hover:text-[#292F36]
                      transition-all duration-150 flex-1 justify-center
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#292F36]/40
                    "
                  >
                    {t("signIn")}
                  </Link>
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
                    {t("createAccount")}
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Spacer so content doesn't hide under fixed header */}
      <div className="h-20" aria-hidden="true" />

      {/* Sign Out Confirmation Modal */}
      {showSignOutModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#292F36]/40 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Legal Notepad Container */}
          <div 
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: "rgba(41, 47, 54, 0.08)",
            }}
            className="w-full max-w-[440px] relative flex flex-col rounded-[24px] border pl-12 pr-7 py-8 shadow-xl overflow-visible transform transition-all duration-200"
          >
            {/* Ruled Legal Notepad red margin line indicator */}
            <div 
              className="absolute top-0 bottom-0 left-7 w-[1.5px] bg-[#A41F13]/20" 
              aria-hidden="true" 
            />

            {/* Memo/Sticky Tape adhesive graphic at top left */}
            <div 
              style={{ backgroundColor: "rgba(143, 122, 110, 0.1)" }}
              className="absolute -top-2.5 left-10 w-12 h-5 border-l border-r border-[#8F7A6E]/5 transform -rotate-1 rounded-sm"
              aria-hidden="true"
            />

            {/* Sticky Page Marker / Document Tab (Scale icon badge) */}
            <div
              style={{ backgroundColor: "#A41F13", color: "#FAF5F1" }}
              className="
                absolute -top-3.5 right-6 
                px-3.5 py-2 rounded-lg 
                shadow-md shadow-[#A41F13]/10
                transform rotate-2 
                text-xs font-bold tracking-wide
                flex items-center gap-1.5
                shrink-0 select-none
              "
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t("signOut")}</span>
            </div>

            {/* Modal Content */}
            <div className="flex flex-col gap-4 mt-2">
              <h2
                id="modal-title"
                className="text-[1.5rem] font-semibold leading-[1.25] tracking-tight"
                style={{ color: "#292F36" }}
              >
                {t("confirmSignOutTitle")}
              </h2>
              <p
                className="text-[14px] leading-relaxed font-normal"
                style={{ color: "#8F7A6E" }}
              >
                {t("confirmSignOutDescription")}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowSignOutModal(false)}
                className="
                  cursor-pointer w-full sm:w-auto px-4 py-2.5 rounded-lg text-sm font-semibold
                  transition-all duration-150 ease-in-out
                  hover:bg-[rgba(41,47,54,0.08)] active:scale-[0.97]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#292F36]/40
                "
                style={{ color: "rgba(41, 47, 54, 0.85)" }}
              >
                {t("cancel")}
              </button>
              
              <form action={signOut} onSubmit={() => setShowSignOutModal(false)} className="w-full sm:w-auto">
                <button
                  type="submit"
                  className="
                    cursor-pointer w-full sm:w-auto inline-flex items-center justify-center gap-2
                    px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wide
                    transition-all duration-200 ease-in-out
                    hover:bg-[#8d1a0f] hover:shadow-md hover:shadow-black/10
                    active:scale-[0.97]
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A41F13]/60
                  "
                  style={{ backgroundColor: "#A41F13", color: "#FAF5F1" }}
                >
                  {t("confirmSignOut")}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

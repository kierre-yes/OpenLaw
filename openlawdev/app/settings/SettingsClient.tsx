"use client";

import { useTranslations, useLocale } from "next-intl";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Globe, Palette, Settings as SettingsIcon, ChevronDown } from "lucide-react";

export default function SettingsClient() {
  const t = useTranslations("Settings");
  const currentLocale = useLocale();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const changeLocale = (newLocale: string) => {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    router.refresh();
  };

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <div className="flex-1 w-full flex flex-col items-center px-5 sm:px-8 py-12 sm:py-16">
      <div className="w-full max-w-2xl flex flex-col gap-10">
        
        {/* Header Section */}
        <div className="flex flex-col gap-2">
          <h1
            className="text-[2rem] font-semibold tracking-tight dark:text-[#FAF5F1]"
            style={{ color: "var(--text-primary, #292F36)" }}
          >
            {t("title")}
          </h1>
          <p className="text-[15px] leading-relaxed dark:text-[#E0DBD8]" style={{ color: "var(--text-secondary, #8F7A6E)" }}>
            {t("description")}
          </p>
        </div>

        {/* Legal Notepad Container for Settings List */}
        <div
          style={{
            borderColor: "rgba(41, 47, 54, 0.08)",
          }}
          className="w-full relative flex flex-col rounded-[24px] border pl-10 pr-5 sm:pl-14 sm:pr-8 py-8 shadow-sm overflow-visible z-10 bg-white dark:bg-[#292F36] dark:border-white/10"
        >
          {/* Ruled Legal Notepad red margin line indicator */}
          <div
            className="absolute top-0 bottom-0 left-6 sm:left-8 w-[1.5px] bg-[#A41F13]/20 dark:bg-[#A41F13]/50"
            aria-hidden="true"
          />

          {/* Sticky Page Marker / Document Tab (Settings icon badge) */}
          <div
            style={{ backgroundColor: "#A41F13", color: "#FAF5F1" }}
            className="
              absolute -top-3.5 right-6 sm:right-8 
              px-3.5 py-2 rounded-lg 
              shadow-md shadow-[#A41F13]/10
              transform rotate-2 
              text-xs font-bold tracking-wide
              flex items-center gap-1.5
              shrink-0 select-none
            "
          >
            <SettingsIcon className="w-3.5 h-3.5" />
            <span>{t("title")}</span>
          </div>

          <div className="flex flex-col mt-4 relative z-10 gap-8">
            
            {/* Language Setting */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
              <div className="flex gap-4 min-w-0">
                <div className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center bg-[rgba(41,47,54,0.04)] dark:bg-white/5 mt-0.5">
                  <Globe className="w-5 h-5 text-[#8F7A6E] dark:text-[#E0DBD8]" />
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <h3 className="text-[15px] font-semibold text-[#292F36] dark:text-[#FAF5F1]">
                    {t("language")}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-[#8F7A6E] dark:text-[#E0DBD8]/70">
                    {t("languageDescription")}
                  </p>
                </div>
              </div>
              
              <div className="relative self-start sm:self-center">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="
                    flex items-center justify-between gap-3
                    pl-4 pr-3 py-2.5 rounded-xl border border-[rgba(41,47,54,0.15)] dark:border-white/10
                    bg-transparent text-[14px] font-semibold text-[#292F36] dark:text-[#FAF5F1]
                    focus:outline-none focus:ring-2 focus:ring-[#A41F13]/60 cursor-pointer
                    min-w-[140px] transition-all duration-200 ease-in-out
                    hover:bg-[rgba(41,47,54,0.04)] dark:hover:bg-white/5
                  "
                >
                  <span>{currentLocale === "fil" ? "Filipino" : "English"}</span>
                  <ChevronDown className={`w-4 h-4 text-[#8F7A6E] dark:text-[#E0DBD8] transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsDropdownOpen(false)} 
                      aria-hidden="true"
                    />
                    <div 
                      className="absolute top-full right-0 mt-2 w-[140px] z-50 rounded-xl border border-[rgba(41,47,54,0.1)] dark:border-white/10 bg-white dark:bg-[#1E2328] shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-2 duration-200"
                    >
                      <button
                        onClick={() => {
                          changeLocale("en");
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-[14px] font-semibold transition-colors hover:bg-[rgba(41,47,54,0.04)] dark:hover:bg-white/5 ${currentLocale === "en" ? "text-[#A41F13] dark:text-[#A41F13]" : "text-[#292F36] dark:text-[#FAF5F1]"}`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => {
                          changeLocale("fil");
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-[14px] font-semibold transition-colors hover:bg-[rgba(41,47,54,0.04)] dark:hover:bg-white/5 ${currentLocale === "fil" ? "text-[#A41F13] dark:text-[#A41F13]" : "text-[#292F36] dark:text-[#FAF5F1]"}`}
                      >
                        Filipino
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="w-full h-px bg-[rgba(41,47,54,0.06)] dark:bg-white/5" />

            {/* Theme Setting */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
              <div className="flex gap-4 min-w-0">
                <div className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center bg-[rgba(41,47,54,0.04)] dark:bg-white/5 mt-0.5">
                  <Palette className="w-5 h-5 text-[#8F7A6E] dark:text-[#E0DBD8]" />
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <h3 className="text-[15px] font-semibold text-[#292F36] dark:text-[#FAF5F1]">
                    {t("theme")}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-[#8F7A6E] dark:text-[#E0DBD8]/70">
                    {t("themeDescription")}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 self-start sm:self-center bg-[rgba(41,47,54,0.04)] dark:bg-white/5 p-1 rounded-xl">
                {["light", "dark", "system"].map((tOption) => (
                  <button
                    key={tOption}
                    onClick={() => setTheme(tOption)}
                    className={`
                      px-4 py-2 rounded-lg text-[13px] font-semibold tracking-wide capitalize
                      transition-all duration-200 ease-in-out cursor-pointer
                      ${theme === tOption 
                        ? "bg-[#A41F13] text-[#FAF5F1] shadow-md shadow-[#A41F13]/20" 
                        : "text-[#8F7A6E] dark:text-[#E0DBD8] hover:bg-black/5 dark:hover:bg-white/10"
                      }
                    `}
                  >
                    {t(tOption)}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Search, Scale, FileText, Landmark, Library, ChevronRight, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";

type Source = {
  id: string;
  title: string;
  short_title: string | null;
  source_type: string | null;
  jurisdiction: string | null;
  issuing_body: string | null;
  official_url: string | null;
  publication_date: string | null;
  effectivity_date: string | null;
  status: string | null;
  language: string | null;
};

const FILTERS = ["All", "Statute", "Jurisprudence", "Issuance"] as const;

export default function SourcesClient({ initialSources }: { initialSources: Source[] }) {
  const t = useTranslations("Sources");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<typeof FILTERS[number]>("All");

  const filteredSources = initialSources.filter((source) => {
    const matchesSearch =
      (source.title ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (source.short_title ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (source.jurisdiction ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === "All" ||
      (source.source_type ?? "").toLowerCase() === activeFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getIcon = (sourceType: string | null) => {
    const t = (sourceType ?? "").toLowerCase();
    if (t.includes("statute") || t.includes("act") || t.includes("law")) return Landmark;
    if (t.includes("jurisprudence") || t.includes("case")) return Scale;
    return FileText;
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center px-5 sm:px-8 py-12 sm:py-16">
      <div className="w-full max-w-4xl flex flex-col gap-10">
        
        {/* Header Section */}
        <div className="flex flex-col gap-2">
          <h1
            className="text-[2rem] font-semibold tracking-tight"
            style={{ color: "#292F36" }}
          >
            {t("title")}
          </h1>
          <p className="text-[15px] leading-relaxed max-w-2xl" style={{ color: "#8F7A6E" }}>
            {t("subtitle")}
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
          {/* Search Input */}
          <div 
            className="relative flex-1 w-full rounded-xl border flex items-center px-4 py-3 transition-colors duration-200"
            style={{ 
              backgroundColor: "#FFFFFF", 
              borderColor: "rgba(41, 47, 54, 0.15)",
            }}
          >
            <Search className="w-5 h-5 shrink-0" style={{ color: "#8F7A6E" }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full bg-transparent outline-none ml-3 text-[15px] placeholder:text-[#8F7A6E]/60"
              style={{ color: "#292F36" }}
            />
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`
                    cursor-pointer px-4 py-2 rounded-lg text-[13px] font-semibold tracking-wide whitespace-nowrap
                    transition-all duration-200 ease-in-out
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A41F13]/60 focus-visible:ring-offset-2
                    active:scale-[0.97]
                  `}
                  style={{
                    backgroundColor: isActive ? "#A41F13" : "rgba(41, 47, 54, 0.05)",
                    color: isActive ? "#FAF5F1" : "#292F36",
                  }}
                >
                  {t(`filter${filter}`)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legal Notepad Container for List */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: "rgba(41, 47, 54, 0.08)",
          }}
          className="w-full relative flex flex-col rounded-[24px] border pl-10 pr-5 sm:pl-14 sm:pr-8 py-8 shadow-sm overflow-visible z-10"
        >
          {/* Ruled Legal Notepad red margin line indicator */}
          <div
            className="absolute top-0 bottom-0 left-6 sm:left-8 w-[1.5px] bg-[#A41F13]/20"
            aria-hidden="true"
          />

          {/* Memo/Sticky Tape adhesive graphic at top left */}
          <div
            style={{ backgroundColor: "rgba(143, 122, 110, 0.1)" }}
            className="absolute -top-2.5 left-10 w-12 h-5 border-l border-r border-[#8F7A6E]/5 transform -rotate-1 rounded-sm"
            aria-hidden="true"
          />

          {/* Sticky Page Marker / Document Tab (Library icon badge) */}
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
            <Library className="w-3.5 h-3.5" />
            <span>{t("tabTitle")}</span>
          </div>

          {/* Source List */}
          <div className="flex flex-col mt-4 relative z-10">
            {filteredSources.length > 0 ? (
              <ul className="flex flex-col">
                {filteredSources.map((source, index) => {
                  const Icon = getIcon(source.source_type);
                  const isLast = index === filteredSources.length - 1;
                  
                  return (
                    <li 
                      key={source.id} 
                      className={`
                        group flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5
                        ${!isLast ? "border-b border-[rgba(41,47,54,0.08)]" : ""}
                        hover:bg-[rgba(41,47,54,0.02)] -mx-5 px-5 sm:-mx-8 sm:px-8
                        cursor-pointer transition-colors duration-200
                      `}
                      onClick={() => {
                        if (source.official_url) {
                          window.open(source.official_url, "_blank", "noopener,noreferrer");
                        }
                      }}
                    >
                      <div className="flex flex-col gap-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 shrink-0" style={{ color: "#A41F13" }} />
                          <h3 
                            className="text-[15px] font-semibold truncate group-hover:text-[#A41F13] transition-colors"
                            style={{ color: "#292F36" }}
                          >
                            {source.title}
                          </h3>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-0.5">
                          {source.source_type && (
                            <span className="text-[12px] font-medium" style={{ color: "#8F7A6E" }}>
                              {source.source_type}
                            </span>
                          )}
                          {source.jurisdiction && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-[rgba(41,47,54,0.2)]" />
                              <span className="text-[12px] font-medium" style={{ color: "#8F7A6E" }}>
                                {source.jurisdiction}
                              </span>
                            </>
                          )}
                          {source.publication_date && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-[rgba(41,47,54,0.2)]" />
                              <span className="text-[12px] font-medium" style={{ color: "#8F7A6E" }}>
                                {new Date(source.publication_date).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                        <span 
                          className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide"
                          style={
                            (source.status ?? "").toLowerCase() === "active"
                              ? {
                                  backgroundColor: "rgba(164, 31, 19, 0.08)",
                                  color: "#A41F13",
                                }
                              : {
                                  backgroundColor: "rgba(143, 122, 110, 0.12)",
                                  color: "#8F7A6E",
                                }
                          }
                        >
                          {source.status ?? "Unknown"}
                        </span>
                        {source.official_url ? (
                          <ExternalLink className="w-4 h-4 text-[#8F7A6E] opacity-50 group-hover:opacity-100 group-hover:text-[#A41F13] transition-all" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-[#8F7A6E] opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[rgba(41,47,54,0.05)]">
                  <Library className="w-6 h-6 text-[#8F7A6E]" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[15px] font-semibold" style={{ color: "#292F36" }}>{t("emptySearchTitle")}</span>
                  <span className="text-[13px]" style={{ color: "#8F7A6E" }}>
                    {t("emptySearchDesc")}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveFilter("All");
                  }}
                  className="mt-2 text-[13px] font-semibold hover:underline cursor-pointer"
                  style={{ color: "#A41F13" }}
                >
                  {t("clearFilters")}
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

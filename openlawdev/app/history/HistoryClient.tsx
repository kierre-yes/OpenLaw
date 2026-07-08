"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Trash2, Clock, MessageSquare, ChevronRight, ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";

type ChatSession = {
  id: string;
  title: string;
  created_at: string;
};

export default function HistoryClient({ initialSessions }: { initialSessions: ChatSession[] }) {
  const router = useRouter();
  const t = useTranslations("History");
  const [historyList, setHistoryList] = useState<ChatSession[]>(initialSessions);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent opening the search when clicking delete
    
    // Optimistic update
    setHistoryList((prev) => prev.filter((item) => item.id !== id));

    try {
      const res = await fetch(`/api/history?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Failed to delete session:", await res.text());
      }
    } catch (err) {
      console.error("Error during deletion:", err);
    }
  };

  const handleReopen = (title: string) => {
    router.push(`/search?q=${encodeURIComponent(title || "")}`);
  };

  const filteredHistory = historyList.filter(
    (item) =>
      (item.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredHistory.length / ITEMS_PER_PAGE));
  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const getGroup = (createdAtStr: string): string => {
    const date = new Date(createdAtStr);
    const now = new Date();
    
    const isToday = date.toDateString() === now.toDateString();
    
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    if (isToday) return t("today");
    if (isYesterday) return t("yesterday");
    return t("older");
  };

  const getRelativeTime = (createdAtStr: string): string => {
    const date = new Date(createdAtStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return t("justNow");
    if (diffMins < 60) return t("mAgo", { mins: diffMins });
    if (diffHours < 24) return t("hAgo", { hours: diffHours });
    if (diffDays === 1) return t("yesterday");
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getExactTime = (createdAtStr: string): string => {
    return new Date(createdAtStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  };

  const groups = [t("today"), t("yesterday"), t("older")];

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

        {historyList.length > 0 ? (
          <>
            {/* Search Input */}
            <div 
              className="relative w-full rounded-xl border flex items-center px-4 py-3 transition-colors duration-200"
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

              {/* Sticky Page Marker / Document Tab (Clock icon badge) */}
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
                <Clock className="w-3.5 h-3.5" />
                <span>{t("tabTitle")}</span>
              </div>

              {/* History List Grouped by Recency */}
              <div className="flex flex-col mt-4 relative z-10">
                {paginatedHistory.length > 0 ? (
                  <div className="flex flex-col gap-8">
                    {groups.map((group) => {
                      const groupItems = paginatedHistory.filter((item) => getGroup(item.created_at) === group);
                      if (groupItems.length === 0) return null;

                      return (
                        <div key={group} className="flex flex-col gap-3">
                          <h2 
                            className="text-[12px] font-bold uppercase tracking-wider border-b border-[rgba(41,47,54,0.06)] pb-1.5"
                            style={{ color: "#8F7A6E" }}
                          >
                            {group}
                          </h2>
                          
                          <ul className="flex flex-col">
                            {groupItems.map((item, index) => {
                              const isLast = index === groupItems.length - 1;
                              const relativeTime = getRelativeTime(item.created_at);
                              const exactTime = getExactTime(item.created_at);

                              return (
                                <li 
                                  key={item.id}
                                  onClick={() => handleReopen(item.title)}
                                  className={`
                                    group flex items-start justify-between gap-6 py-4.5
                                    ${!isLast ? "border-b border-[rgba(41,47,54,0.04)]" : ""}
                                    hover:bg-[rgba(41,47,54,0.02)] -mx-5 px-5 sm:-mx-8 sm:px-8
                                    cursor-pointer transition-colors duration-200
                                  `}
                                >
                                  {/* Left Content Area */}
                                  <div className="flex-1 flex gap-3.5 min-w-0">
                                    <div className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center bg-[rgba(41,47,54,0.04)] mt-0.5">
                                      <MessageSquare className="w-4.5 h-4.5" style={{ color: "#8F7A6E" }} />
                                    </div>
                                    <div className="flex flex-col gap-1 min-w-0">
                                      <h3 
                                        className="text-[15px] font-semibold truncate group-hover:text-[#A41F13] transition-colors"
                                        style={{ color: "#292F36" }}
                                      >
                                        {item.title || t("untitled")}
                                      </h3>
                                      <p 
                                        className="text-[13px] leading-relaxed line-clamp-1"
                                        style={{ color: "#8F7A6E" }}
                                      >
                                        {t("defaultDesc")}
                                      </p>
                                      
                                      <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2 mt-1">
                                        <div 
                                          className="text-[11px] flex items-center gap-1.5" 
                                          style={{ color: "#8F7A6E" }}
                                          title={exactTime}
                                        >
                                          <Clock className="w-3 h-3" />
                                          <span>{relativeTime}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Actions */}
                                  <div className="flex items-center gap-2 shrink-0 self-center">
                                    <button
                                      type="button"
                                      onClick={(e) => handleDelete(e, item.id)}
                                      title="Delete from history"
                                      aria-label="Delete history item"
                                      className="
                                        p-2 rounded-lg hover:bg-[rgba(164,31,19,0.08)] text-[#8F7A6E] hover:text-[#A41F13]
                                        transition-colors duration-150 active:scale-[0.95] cursor-pointer
                                      "
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                    <ChevronRight className="w-4 h-4 text-[#8F7A6E] opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[rgba(41,47,54,0.05)]">
                      <Search className="w-6 h-6 text-[#8F7A6E]" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[15px] font-semibold" style={{ color: "#292F36" }}>{t("emptySearchTitle")}</span>
                      <span className="text-[13px]" style={{ color: "#8F7A6E" }}>
                        {t("emptySearchDesc")}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="mt-2 text-[13px] font-semibold hover:underline cursor-pointer"
                      style={{ color: "#A41F13" }}
                    >
                      {t("clearFilter")}
                    </button>
                  </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-[rgba(41,47,54,0.06)]">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-semibold text-[#8F7A6E] hover:bg-[rgba(41,47,54,0.04)] hover:text-[#292F36] disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      {t("previous") || "Previous"}
                    </button>
                    
                    <span className="text-[13px] font-medium text-[#8F7A6E]">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-semibold text-[#8F7A6E] hover:bg-[rgba(41,47,54,0.04)] hover:text-[#292F36] disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      {t("next") || "Next"}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Empty state for the entire history */
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: "rgba(41, 47, 54, 0.08)",
            }}
            className="w-full relative flex flex-col items-center justify-center rounded-[24px] border pl-10 pr-5 sm:pl-14 sm:pr-8 py-20 shadow-sm overflow-visible z-10"
          >
            {/* Ruled Legal Notepad red margin line indicator */}
            <div
              className="absolute top-0 bottom-0 left-6 sm:left-8 w-[1.5px] bg-[#A41F13]/20"
              aria-hidden="true"
            />
            
            <div className="flex flex-col items-center max-w-sm text-center gap-5">
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[rgba(164,31,19,0.08)]">
                <Clock className="w-6 h-6 text-[#A41F13]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-[17px] font-semibold" style={{ color: "#292F36" }}>{t("emptyTitle")}</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "#8F7A6E" }}>
                  {t("emptyDesc")}
                </p>
              </div>
              <button
                onClick={() => router.push("/search")}
                style={{
                  backgroundColor: "#A41F13",
                  color: "#FAF5F1",
                }}
                className="
                  cursor-pointer px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wide
                  transition-all duration-200 ease-in-out
                  hover:bg-[#8d1a0f] hover:shadow-md hover:shadow-black/10
                  active:scale-[0.97]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A41F13]/60
                "
              >
                {t("startSearching")}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

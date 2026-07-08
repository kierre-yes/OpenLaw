"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { Search, Scale, FileText, Landmark } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SearchClient() {
  const t = useTranslations("Search");
  const [input, setInput] = useState("");
  
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isLoading = status === "submitted" || status === "streaming";
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  };

  const hasMessages = messages.length > 0;

  // The Legal Notepad Form Component (reusable for both states)
  const renderNotepadForm = (compact: boolean) => (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: "rgba(41, 47, 54, 0.08)",
      }}
      className={`w-full relative flex flex-col rounded-[24px] border shadow-sm overflow-visible z-10 transition-all duration-300 ${
        compact ? "pl-10 pr-5 py-4" : "pl-12 pr-7 py-8"
      }`}
    >
      {/* Ruled Legal Notepad red margin line indicator */}
      <div
        className={`absolute top-0 bottom-0 left-6 sm:left-7 w-[1.5px] bg-[#A41F13]/20`}
        aria-hidden="true"
      />

      {/* Memo/Sticky Tape adhesive graphic at top left */}
      <div
        style={{ backgroundColor: "rgba(143, 122, 110, 0.1)" }}
        className={`absolute -top-2.5 w-12 h-5 border-l border-r border-[#8F7A6E]/5 transform -rotate-1 rounded-sm ${
          compact ? "left-8" : "left-10"
        }`}
        aria-hidden="true"
      />

      {/* Sticky Page Marker / Document Tab (Scale icon badge) */}
      {!compact && (
        <div
          style={{ backgroundColor: "#A41F13", color: "#FAF5F1" }}
          className="
            absolute -top-3.5 right-8 
            px-3.5 py-2 rounded-lg 
            shadow-md shadow-[#A41F13]/10
            transform rotate-2 
            text-xs font-bold tracking-wide
            flex items-center gap-1.5
            shrink-0 select-none
          "
        >
          <Scale className="w-3.5 h-3.5" />
          <span>{t("tabTitle")}</span>
        </div>
      )}

      {/* Search Form */}
      <form
        onSubmit={handleFormSubmit}
        className={`flex flex-col relative z-10 ${compact ? "gap-2 mt-1" : "gap-6 mt-2"}`}
      >
        <div className="flex flex-col gap-2 relative">
          <label htmlFor="searchQuery" className="sr-only">
            Search Query
          </label>
          <textarea
            id="searchQuery"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleFormSubmit(e as any);
              }
            }}
            placeholder={compact ? "Ask a follow-up question..." : t("placeholder")}
            className={`
              w-full resize-none bg-transparent outline-none
              text-[16px] sm:text-[18px] leading-relaxed
              placeholder:text-[#8F7A6E]/50
              ${compact ? "min-h-[52px] py-1" : "min-h-[100px]"}
            `}
            style={{ color: "#292F36" }}
            autoFocus
          />
          
          {/* Submit button inside textarea area when compact */}
          {compact && (
            <div className="absolute right-0 bottom-0">
              <button
                type="submit"
                disabled={!(input || "").trim() || isLoading}
                className="
                  cursor-pointer p-2 rounded-full text-[#FAF5F1]
                  transition-all duration-200 ease-in-out
                  hover:bg-[#8d1a0f] hover:shadow-md
                  active:scale-[0.97]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A41F13]/60
                "
                style={{ backgroundColor: "#A41F13" }}
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {!compact && (
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t"
            style={{ borderColor: "rgba(41, 47, 54, 0.08)" }}
          >
            {/* Filter chips / Indicators */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold"
                style={{
                  backgroundColor: "rgba(41, 47, 54, 0.05)",
                  color: "#292F36",
                }}
              >
                <Landmark className="w-3.5 h-3.5" />
                {t("statutes")}
              </div>
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold"
                style={{
                  backgroundColor: "rgba(41, 47, 54, 0.05)",
                  color: "#292F36",
                }}
              >
                <Scale className="w-3.5 h-3.5" />
                {t("jurisprudence")}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!(input || "").trim() || isLoading}
              className="
                cursor-pointer inline-flex items-center justify-center gap-2
                px-6 py-3 rounded-xl text-[14px] font-semibold tracking-wide
                transition-all duration-200 ease-in-out
                hover:bg-[#8d1a0f] hover:shadow-md hover:shadow-black/10
                active:scale-[0.97]
                disabled:opacity-50 disabled:cursor-not-allowed
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A41F13]/60
                w-full sm:w-auto
              "
              style={{ backgroundColor: "#A41F13", color: "#FAF5F1" }}
            >
              <Search className="w-4 h-4" />
              {t("startSearching")}
            </button>
          </div>
        )}
      </form>
    </div>
  );

  return (
    <div className="flex flex-col w-full h-[calc(100vh-64px)]">
      {!hasMessages ? (
        // -----------------------------
        // EMPTY STATE (Centered Search)
        // -----------------------------
        <div className="flex-1 w-full flex flex-col items-center justify-center px-5 sm:px-8 pb-16">
          {/* Title Area */}
          <div className="flex flex-col items-center text-center gap-3 mb-10 w-full max-w-2xl">
            <h1
              className="text-[2rem] sm:text-[2.5rem] font-semibold tracking-tight"
              style={{ color: "#292F36" }}
            >
              {t("title")}
            </h1>
            <p
              className="text-[16px] leading-relaxed max-w-xl"
              style={{ color: "#8F7A6E" }}
            >
              {t("subtitle")}
            </p>
          </div>

          <div className="w-full max-w-3xl">
            {renderNotepadForm(false)}
          </div>

          {/* Helper / Tips */}
          <div
            className="mt-8 flex items-center gap-2 text-[13px] font-medium"
            style={{ color: "#8F7A6E" }}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <p>{t("proTip")}</p>
          </div>
        </div>
      ) : (
        // -----------------------------
        // CHAT STATE (Bottom Pinned Input)
        // -----------------------------
        <div className="flex-1 w-full flex flex-col h-full relative">
          
          {/* Scrollable Messages Area */}
          <div className="flex-1 overflow-y-auto w-full flex flex-col items-center px-5 sm:px-8 pt-10 pb-32 hide-scrollbar">
            <div className="w-full max-w-3xl flex flex-col gap-8">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex w-full ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "user" ? (
                    // User Message Bubble (Right aligned, subtle background)
                    <div className="max-w-[85%] sm:max-w-[75%] px-5 py-3.5 rounded-[20px] bg-[#E0DBD8]/50 text-[#292F36] text-[15px] sm:text-[16px] leading-relaxed whitespace-pre-wrap">
                      {message.parts.map((part, i) =>
                        part.type === "text" ? <span key={i}>{part.text}</span> : null
                      )}
                    </div>
                  ) : (
                    // Assistant Message (Left aligned with Avatar)
                    <div className="flex gap-4 sm:gap-5 w-full max-w-[95%] sm:max-w-[90%]">
                      {/* Assistant Avatar */}
                      <div className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full bg-[#A41F13] flex items-center justify-center shadow-sm mt-1">
                        <Scale className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#FAF5F1]" />
                      </div>
                      {/* Assistant Text */}
                      <div className="flex-1 flex flex-col gap-1 text-[15px] sm:text-[16px] leading-relaxed whitespace-pre-wrap text-[#292F36]">
                        <div className="font-semibold text-[13px] sm:text-[14px] text-[#292F36]">OpenLaw</div>
                        <div className="mt-1">
                          {message.parts.map((part, i) =>
                            part.type === "text" ? <span key={i}>{part.text}</span> : null
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex w-full justify-start">
                   <div className="flex gap-4 sm:gap-5 w-full max-w-[95%] sm:max-w-[90%]">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full bg-[#A41F13]/50 flex items-center justify-center shadow-sm mt-1 animate-pulse">
                      <Scale className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#FAF5F1]" />
                    </div>
                    <div className="flex-1 flex flex-col gap-1 text-[15px] sm:text-[16px] leading-relaxed text-[#8F7A6E] mt-1.5 animate-pulse">
                      {t("proTip")}...
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Bottom Pinned Input Area */}
          <div className="absolute bottom-0 left-0 right-0 w-full flex flex-col items-center px-5 sm:px-8 pb-8 pt-8 bg-gradient-to-t from-[#FAF5F1] via-[#FAF5F1] to-transparent">
            <div className="w-full max-w-3xl">
              {renderNotepadForm(true)}
            </div>
            
            {/* Disclaimer / Helper below input in chat mode */}
            <div className="mt-3 text-[12px] font-medium text-center" style={{ color: "#8F7A6E" }}>
              OpenLaw is an AI Legal Assistant and can make mistakes. Always verify information.
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

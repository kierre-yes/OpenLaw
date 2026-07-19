"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { Search, Scale, FileText, Landmark, ChevronDown, BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Shared Markdown component map - DRY, consistent typography
const markdownComponents = {
  h1: ({ node, ...props }: any) => (
    <h1 className="text-[20px] sm:text-[22px] font-semibold mt-6 mb-3" style={{ color: "var(--color-text-primary)" }} {...props} />
  ),
  h2: ({ node, ...props }: any) => (
    <h2 className="text-[17px] sm:text-[18px] font-semibold mt-5 mb-2" style={{ color: "var(--color-text-primary)" }} {...props} />
  ),
  h3: ({ node, ...props }: any) => (
    <h3 className="text-[15px] sm:text-[16px] font-semibold mt-4 mb-1.5" style={{ color: "var(--color-text-primary)" }} {...props} />
  ),
  p: ({ node, ...props }: any) => (
    <p className="text-[15px] sm:text-[16px] leading-[1.75] mb-4 last:mb-0 break-words" style={{ color: "var(--color-text-primary)" }} {...props} />
  ),
  ul: ({ node, ...props }: any) => (
    <ul className="list-disc pl-5 mb-4 space-y-1.5 text-[15px] sm:text-[16px]" style={{ color: "var(--color-text-primary)" }} {...props} />
  ),
  ol: ({ node, ...props }: any) => (
    <ol className="list-decimal pl-5 mb-4 space-y-1.5 text-[15px] sm:text-[16px]" style={{ color: "var(--color-text-primary)" }} {...props} />
  ),
  li: ({ node, ...props }: any) => <li className="pl-1 break-words" {...props} />,
  strong: ({ node, ...props }: any) => <strong className="font-semibold" style={{ color: "var(--color-text-primary)" }} {...props} />,
  em: ({ node, ...props }: any) => <em className="italic" style={{ color: "var(--color-text-secondary)" }} {...props} />,
  a: ({ node, ...props }: any) => (
    <a className="font-medium hover:underline cursor-pointer break-all" style={{ color: "var(--color-brand-red)" }} target="_blank" rel="noopener noreferrer" {...props} />
  ),
  blockquote: ({ node, ...props }: any) => (
    <blockquote className="border-l-2 pl-4 py-1 mb-4 text-[14px] leading-relaxed rounded-r-md" style={{ borderColor: "var(--color-brand-red)", color: "var(--color-text-secondary)", backgroundColor: "rgba(164,31,19,0.04)" }} {...props} />
  ),
  code: ({ node, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || "");
    const isInline = !match && !String(children).includes("\n");
    return isInline ? (
      <code className="px-1.5 py-0.5 rounded-[4px] text-[13px] font-medium break-words" style={{ backgroundColor: "rgba(41,47,54,0.06)", color: "var(--color-brand-red)" }} {...props}>{children}</code>
    ) : (
      <pre className="p-4 rounded-lg overflow-x-auto text-[13px] mb-4" style={{ backgroundColor: "var(--color-text-primary)", color: "var(--color-text-inverse)" }}>
        <code className={className} {...props}>{children}</code>
      </pre>
    );
  },
  table: ({ node, ...props }: any) => (
    <div className="w-full overflow-x-auto mb-4">
      <table className="w-full text-left border-collapse text-[14px] sm:text-[15px]" {...props} />
    </div>
  ),
  th: ({ node, ...props }: any) => (
    <th className="border-b-2 px-4 py-2.5 font-semibold text-[13px] uppercase tracking-wide" style={{ borderColor: "var(--color-border-subtle)", color: "var(--color-text-secondary)", backgroundColor: "var(--color-page-bg)" }} {...props} />
  ),
  td: ({ node, ...props }: any) => (
    <td className="border-b px-4 py-2.5" style={{ borderColor: "var(--color-border-subtle)", color: "var(--color-text-primary)" }} {...props} />
  ),
};

// Strip raw <think> tags - reasoning is handled via dedicated block
function stripThinkTags(text: string): string {
  return text.replace(/<think>[\s\S]*?(?:<\/think>|$)/g, "").trim();
}

export default function SearchClient() {
  const t = useTranslations("Search");
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "submitted" || status === "streaming";
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [messages]);

  const handleFormSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  };

  const hasMessages = messages.length > 0;

  // ---------------------------------------------------------------------------
  // Legal Notepad Input Form
  // ---------------------------------------------------------------------------
  const renderNotepadForm = (compact: boolean) => (
    <div
      style={{ backgroundColor: "var(--color-paper-bg)", borderColor: "var(--color-border-subtle)" }}
      className={`w-full relative flex flex-col rounded-[24px] border shadow-sm overflow-visible z-10 transition-all duration-300 ${compact ? "pl-10 pr-5 py-4" : "pl-12 pr-7 py-8"}`}
    >
      <div className="absolute top-0 bottom-0 left-6 sm:left-7 w-[1.5px] bg-brand-red/20" aria-hidden="true" />
      <div style={{ backgroundColor: "rgba(143, 122, 110, 0.1)" }} className={`absolute -top-2.5 w-12 h-5 border-l border-r border-text-secondary/5 transform -rotate-1 rounded-sm ${compact ? "left-8" : "left-10"}`} aria-hidden="true" />
      {!compact && (
        <div style={{ backgroundColor: "var(--color-brand-red)", color: "var(--color-text-inverse)" }} className="absolute -top-3.5 right-8 px-3.5 py-2 rounded-lg shadow-md shadow-brand-red/10 transform rotate-2 text-xs font-bold tracking-wide flex items-center gap-1.5 shrink-0 select-none">
          <Scale className="w-3.5 h-3.5" />
          <span>{t("tabTitle")}</span>
        </div>
      )}
      <form onSubmit={handleFormSubmit} className={`flex flex-col relative z-10 ${compact ? "gap-2 mt-1" : "gap-6 mt-2"}`}>
        <div className="flex flex-col gap-2 relative">
          <label htmlFor="searchQuery" className="sr-only">Search Query</label>
          <textarea
            id="searchQuery"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleFormSubmit(); } }}
            placeholder={compact ? "Ask a follow-up question..." : t("placeholder")}
            className={`w-full resize-none bg-transparent outline-none text-[16px] sm:text-[18px] leading-relaxed placeholder:text-text-secondary/50 ${compact ? "min-h-[52px] py-1" : "min-h-[100px]"}`}
            style={{ color: "var(--color-text-primary)" }}
            autoFocus
          />
          {compact && (
            <div className="absolute right-0 bottom-0">
              <button type="submit" disabled={!(input || "").trim() || isLoading} className="cursor-pointer p-2 rounded-full text-text-inverse transition-all duration-200 ease-in-out hover:bg-[#8d1a0f] hover:shadow-md active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60" style={{ backgroundColor: "var(--color-brand-red)" }}>
                <Search className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        {!compact && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t" style={{ borderColor: "var(--color-border-subtle)" }}>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold" style={{ backgroundColor: "var(--color-overlay-dark)", color: "var(--color-text-primary)" }}>
                <Landmark className="w-3.5 h-3.5" />{t("statutes")}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold" style={{ backgroundColor: "var(--color-overlay-dark)", color: "var(--color-text-primary)" }}>
                <Scale className="w-3.5 h-3.5" />{t("jurisprudence")}
              </div>
            </div>
            <button type="submit" disabled={!(input || "").trim() || isLoading} className="cursor-pointer inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[14px] font-semibold tracking-wide transition-all duration-200 ease-in-out hover:bg-[#8d1a0f] hover:shadow-md hover:shadow-black/10 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60 w-full sm:w-auto" style={{ backgroundColor: "var(--color-brand-red)", color: "var(--color-text-inverse)" }}>
              <Search className="w-4 h-4" />{t("startSearching")}
            </button>
          </div>
        )}
      </form>
    </div>
  );

  // Reasoning block - no emoji, clean label, collapsible
  const ReasoningBlock = ({ text }: { text: string }) => (
    <details className="mb-5 group">
      <summary className="cursor-pointer select-none list-none inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-widest uppercase transition-colors" style={{ backgroundColor: "var(--color-border-subtle)", color: "var(--color-text-secondary)" }}>
        <BookOpen className="w-3.5 h-3.5 shrink-0" />
        <span>Reasoning</span>
        <ChevronDown className="w-3 h-3 opacity-50 group-open:rotate-180 transition-transform duration-200 ml-0.5" />
      </summary>
      <div className="mt-3 p-4 rounded-lg text-[13px] leading-relaxed whitespace-pre-wrap border-l-2" style={{ backgroundColor: "rgba(41,47,54,0.03)", borderColor: "var(--color-border-subtle)", color: "var(--color-text-secondary)" }}>
        {text}
      </div>
    </details>
  );

  // Loading indicator - minimal, 3 staggered dots
  const LoadingPulse = () => (
    <div className="flex items-center gap-1.5 py-2 px-1">
      {[0, 1, 2].map((i) => (
        <span key={i} className="block w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: "var(--color-brand-red)", opacity: 0.5, animationDelay: `${i * 120}ms` }} />
      ))}
    </div>
  );

  // Shared assistant identity column
  const AssistantIdentity = () => (
    <div className="flex items-center gap-2.5 sm:w-[120px] shrink-0 sm:pt-0.5">
      <div className="w-7 h-7 rounded-full flex items-center justify-center shadow-sm shrink-0" style={{ backgroundColor: "var(--color-brand-red)" }}>
        <Scale className="w-3.5 h-3.5" style={{ color: "var(--color-text-inverse)" }} />
      </div>
      <span className="text-[13px] font-semibold tracking-wide" style={{ color: "var(--color-text-primary)" }}>OpenLaw</span>
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full">
      {!hasMessages ? (
        // EMPTY STATE
        <div className="flex-1 w-full flex flex-col items-center justify-center px-5 sm:px-8 pb-16">
          <div className="flex flex-col items-center text-center gap-3 mb-10 w-full max-w-2xl">
            <h1 className="text-[2rem] sm:text-[2.5rem] font-semibold tracking-tight" style={{ color: "var(--color-text-primary)" }}>{t("title")}</h1>
            <p className="text-[16px] leading-relaxed max-w-xl" style={{ color: "var(--color-text-secondary)" }}>{t("subtitle")}</p>
          </div>
          <div className="w-full max-w-3xl">{renderNotepadForm(false)}</div>
          <div className="mt-8 flex items-center gap-2 text-[13px] font-medium" style={{ color: "var(--color-text-secondary)" }}>
            <FileText className="w-4 h-4 shrink-0" />
            <p>{t("proTip")}</p>
          </div>
        </div>
      ) : (
        // CHAT STATE
        <div className="flex-1 w-full flex flex-col h-full overflow-hidden">

          {/* Scrollable messages */}
          <div className="flex-1 overflow-y-auto w-full flex flex-col items-center px-5 sm:px-8 pt-6 pb-2 hide-scrollbar">
            <div className="w-full max-w-3xl flex flex-col">

              {messages.map((message) => (
                <div key={message.id} className="w-full">
                  {message.role === "user" ? (
                    // User - editorial right-aligned, no bubble
                    <div className="ml-auto mt-8 mb-2 text-right max-w-[80%]">
                      <p className="text-[18px] sm:text-[20px] font-medium tracking-tight leading-snug whitespace-pre-wrap" style={{ color: "var(--color-text-primary)" }}>
                        {message.parts?.length
                          ? message.parts.map((part, i) => part.type === "text" ? <span key={i}>{part.text}</span> : null)
                          : (message as any).content}
                      </p>
                    </div>
                  ) : (
                    // Assistant - full-width transcript layout
                    <div className="w-full flex flex-col sm:flex-row gap-4 sm:gap-6 py-8 border-b" style={{ borderColor: "var(--color-border-subtle)" }}>
                      <AssistantIdentity />
                      <div className="flex-1 min-w-0 w-full">
                        {message.parts?.length ? (
                          message.parts.map((part: any, i: number) => {
                            if (part.type === "reasoning") {
                              const text = part.reasoning || part.text || part.content || (part.details && JSON.stringify(part.details)) || "";
                              return text ? <ReasoningBlock key={i} text={text} /> : null;
                            }
                            if (part.type === "text") {
                              const clean = stripThinkTags(part.text);
                              return clean ? (
                                <ReactMarkdown key={i} remarkPlugins={[remarkGfm]} components={markdownComponents}>{clean}</ReactMarkdown>
                              ) : null;
                            }
                            return null; // tool-invocation - intentionally silent
                          })
                        ) : (
                          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                            {stripThinkTags((message as any).content || "")}
                          </ReactMarkdown>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Loading state */}
              {isLoading && messages.length > 0 && messages[messages.length - 1].role === "user" && (
                <div className="w-full flex flex-col sm:flex-row gap-4 sm:gap-6 py-8 border-b" style={{ borderColor: "var(--color-border-subtle)" }}>
                  <AssistantIdentity />
                  <div className="flex-1 min-w-0 flex items-center"><LoadingPulse /></div>
                </div>
              )}

              <div ref={messagesEndRef} className="h-4 shrink-0" />
            </div>
          </div>

          {/* Pinned input bar */}
          <div className="shrink-0 w-full flex flex-col items-center px-5 sm:px-8 pb-6 pt-4 z-20 border-t" style={{ backgroundColor: "var(--color-page-bg)", borderColor: "var(--color-border-subtle)", boxShadow: "0 -12px 24px -8px var(--color-page-bg)" }}>
            <div className="w-full max-w-3xl">{renderNotepadForm(true)}</div>
            <p className="mt-3 text-[11px] font-medium text-center" style={{ color: "var(--color-text-secondary)" }}>
              OpenLaw is an AI Legal Assistant and can make mistakes. Always verify information.
            </p>
          </div>

        </div>
      )}
    </div>
  );
}

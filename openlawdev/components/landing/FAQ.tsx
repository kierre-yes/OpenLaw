"use client";

import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";

const faqs = [
  {
    question: "Does OpenLaw replace a lawyer?",
    answer:
      "No. OpenLaw is a legal research tool, not a substitute for professional legal advice. It helps you find and understand Philippine laws and court decisions quickly, but it does not provide legal counsel. For matters that affect your rights or require legal action, always consult a licensed Philippine attorney.",
  },
  {
    question: "What kinds of legal sources does OpenLaw cover?",
    answer:
      "OpenLaw searches across Philippine statutes and Republic Acts, Supreme Court jurisprudence and G.R. decisions, and executive and administrative issuances. All sources are drawn from official Philippine legal databases.",
  },
  {
    question: "Does every answer include a citation?",
    answer:
      "Yes. Every answer is grounded in a specific source, which is shown directly beneath the result. You will see the statute number, G.R. number, or issuance title so you can locate and verify the original document yourself.",
  },
  {
    question: "How accurate are the answers?",
    answer:
      "OpenLaw uses retrieval-augmented generation, which means answers are generated from actual legal texts rather than general knowledge. The system is designed to surface the most relevant passage and cite it. However, laws change over time, and you should always verify that the source cited is the current, in-force version.",
  },
  {
    question: "How should I verify the information OpenLaw provides?",
    answer:
      "Each answer includes a direct reference to the source document. You can open the original text from the result to confirm the exact wording. For critical legal matters, cross-check with the Official Gazette, the Supreme Court E-Library, or consult a lawyer.",
  },
  {
    question: "What happens if OpenLaw cannot find a relevant source?",
    answer:
      "If no relevant source is found, OpenLaw will tell you rather than fabricate an answer. You can try rephrasing your query, searching by statute name or G.R. number, or narrowing the subject of your question.",
  },
  {
    question: "Can I search in plain language, or do I need legal terms?",
    answer:
      "You can search in plain language. The app is designed to understand natural questions like 'What are the grounds for annulment in the Philippines?' You do not need to know specific legal citations before you start.",
  },
];

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
  index,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: isOpen
          ? "rgba(164, 31, 19, 0.2)"
          : "rgba(41, 47, 54, 0.07)",
        transition: "border-color 200ms ease",
      }}
      className="rounded-2xl border"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
        id={`faq-question-${index}`}
        className="
          cursor-pointer
          w-full flex items-center justify-between gap-4
          px-7 py-5 text-left
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A41F13]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF5F1]
          rounded-2xl
        "
      >
        <span
          style={{ color: "#292F36" }}
          className="text-[15px] lg:text-[16px] font-semibold leading-snug"
        >
          {question}
        </span>
        <span
          style={{
            color: isOpen ? "#A41F13" : "#8F7A6E",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 250ms cubic-bezier(0.4, 0, 0.2, 1), color 200ms ease",
          }}
          className="shrink-0"
          aria-hidden="true"
        >
          <ChevronDown className="w-5 h-5" strokeWidth={1.75} />
        </span>
      </button>

      {/* Answer Panel — CSS-driven smooth expansion */}
      <div
        id={`faq-answer-${index}`}
        role="region"
        aria-labelledby={`faq-question-${index}`}
        style={{
          display: "grid",
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          transition: "grid-template-rows 280ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="overflow-hidden">
          <p
            style={{ color: "#8F7A6E" }}
            className="px-7 pb-6 text-[14px] lg:text-[15px] font-normal leading-relaxed"
          >
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="faq"
      style={{ backgroundColor: "var(--page-bg)" }}
      className="w-full py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 lg:gap-20 items-start">

          {/* ── LEFT: Section Header ── */}
          <div className="flex flex-col gap-5">
            <p
              style={{ color: "#A41F13" }}
              className="text-[13px] lg:text-[14px] font-semibold tracking-widest mb-1 underline underline-offset-[5px] decoration-[2px] inline-block"
            >
              FAQs
            </p>
            <h2
              style={{ color: "#292F36" }}
              className="text-3xl sm:text-4xl font-semibold leading-tight tracking-tight"
            >
              Common questions about OpenLaw.
            </h2>
            <p
              style={{ color: "#8F7A6E" }}
              className="text-[15px] lg:text-[16px] font-normal leading-relaxed max-w-sm"
            >
              Understand how the app works, what it covers, and what it cannot do before you start searching.
            </p>

            {/* Desktop CTA — lives in sticky column */}
            <div className="hidden lg:flex flex-col items-start gap-4 mt-6">
              <button
                type="button"
                style={{ backgroundColor: "#A41F13", color: "#FAF5F1" }}
                className="
                  cursor-pointer
                  inline-flex items-center gap-2 px-6 py-3.5 rounded-xl
                  text-[14px] font-semibold tracking-wide
                  transition-all duration-200 ease-in-out
                  hover:bg-[#8d1a0f] hover:shadow-md hover:shadow-[#A41F13]/15
                  active:scale-[0.97]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A41F13]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF5F1]
                "
              >
                <Search className="w-4 h-4" />
                Ask a legal question
              </button>
             
            </div>
          </div>

          {/* ── RIGHT: Accordion List ── */}
          <div className="flex flex-col gap-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                index={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
              />
            ))}
          </div>

        </div>

        {/* Mobile CTA — below accordion list */}
        <div className="flex lg:hidden flex-col items-start gap-4 mt-10">
          <button
            type="button"
            style={{ backgroundColor: "#A41F13", color: "#FAF5F1" }}
            className="
              cursor-pointer
              inline-flex items-center gap-2 px-6 py-3.5 rounded-xl
              text-[14px] font-semibold tracking-wide
              transition-all duration-200 ease-in-out
              hover:bg-[#8d1a0f] hover:shadow-md hover:shadow-[#A41F13]/15
              active:scale-[0.97]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A41F13]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF5F1]
            "
          >
            <Search className="w-4 h-4" />
            Ask a legal question
          </button>
          <p
            style={{ color: "#8F7A6E" }}
            className="text-[12px] font-medium"
          >
            No account required.
          </p>
        </div>

      </div>
    </section>
  );
}

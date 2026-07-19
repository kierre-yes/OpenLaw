"use client";

import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    question: "Does OpenLaw replace a lawyer?",
    answer:
      "No. OpenLaw is a legal research tool, not a lawyer. It helps you find Philippine laws and court decisions fast. But it does not give legal advice. For anything that affects your rights, talk to a licensed Philippine attorney.",
  },
  {
    question: "What legal sources does OpenLaw cover?",
    answer:
      "OpenLaw searches Philippine statutes and Republic Acts, Supreme Court decisions, and executive and administrative orders. All sources come from official Philippine legal databases.",
  },
  {
    question: "Does every answer include a citation?",
    answer:
      "Yes. Every answer links to a specific source. You will see the law number, G.R. number, or order title. You can use that to find and read the original document yourself.",
  },
  {
    question: "How accurate are the answers?",
    answer:
      "OpenLaw pulls answers from real legal texts, not general knowledge. It finds the most relevant passage and cites it. But laws can change. Always check that the source cited is still the current version.",
  },
  {
    question: "How do I verify what OpenLaw gives me?",
    answer:
      "Each answer shows its source. You can open the original text to check the exact words. For important legal matters, also check the Official Gazette or the Supreme Court E-Library, or ask a lawyer.",
  },
  {
    question: "What if OpenLaw can't find a source?",
    answer:
      "If no source is found, OpenLaw will say so. It will not make one up. Try rewording your question, using a law name or G.R. number, or narrowing your topic.",
  },
  {
    question: "Do I need to know legal terms to search?",
    answer:
      "No. You can search in plain words. Try asking: 'What are the grounds for annulment in the Philippines?' You do not need to know any citations before you start.",
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
        borderColor: isOpen ? "rgba(164, 31, 19, 0.4)" : "var(--color-border-subtle)",
        transition: "border-color 200ms ease",
      }}
      className="border-b"
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
          py-6 text-left
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A41F13]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF5F1]
        "
      >
        <span
          style={{ color: "var(--color-text-primary)" }}
          className="text-[15px] lg:text-[16px] font-semibold leading-snug"
        >
          {question}
        </span>
        <span
          style={{
            color: isOpen ? "var(--color-brand-red)" : "var(--color-text-secondary)",
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
            style={{ color: "var(--color-text-secondary)" }}
            className="pb-6 pr-6 text-[14px] lg:text-[15px] font-normal leading-relaxed max-w-[65ch]"
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
      style={{ backgroundColor: "var(--color-page-bg)" }}
      className="w-full py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 lg:gap-20 items-start">

          {/* ── LEFT: Section Header ── */}
          <div className="flex flex-col gap-5">
            <h2
              style={{ color: "var(--color-text-primary)" }}
              className="text-3xl sm:text-4xl font-semibold leading-tight tracking-tight"
            >
              Common questions about OpenLaw.
            </h2>
            <p
              style={{ color: "var(--color-text-secondary)" }}
              className="text-[15px] lg:text-[16px] font-normal leading-relaxed max-w-sm"
            >
              Learn what the app can do, what it covers, and what it cannot do.
            </p>

            {/* Desktop CTA — lives in sticky column */}
            <div className="hidden lg:flex flex-col items-start gap-4 mt-6">
              <Link
                href="/auth/sign-up"
                style={{ backgroundColor: "var(--color-brand-red)", color: "var(--color-text-inverse)" }}
                className="
                  cursor-pointer
                  inline-flex items-center gap-2 px-6 py-3.5 rounded-xl
                  text-[14px] font-semibold tracking-wide
                  transition-all duration-200 ease-in-out
                  hover:bg-[#8d1a0f] hover:shadow-md hover:shadow-brand-red/15
                  active:scale-[0.97]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF5F1]
                "
              >
                <Search className="w-4 h-4" />
                Join Beta
              </Link>
             
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
          <Link
            href="/auth/sign-up"
            style={{ backgroundColor: "var(--color-brand-red)", color: "var(--color-text-inverse)" }}
            className="
              cursor-pointer
              inline-flex items-center gap-2 px-6 py-3.5 rounded-xl
              text-[14px] font-semibold tracking-wide
              transition-all duration-200 ease-in-out
              hover:bg-[#8d1a0f] hover:shadow-md hover:shadow-brand-red/15
              active:scale-[0.97]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF5F1]
            "
          >
            <Search className="w-4 h-4" />
            Join Beta
          </Link>
        </div>

      </div>
    </section>
  );
}

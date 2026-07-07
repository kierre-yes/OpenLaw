import { 
  FolderSearch,
  FileQuestion,
  FileSignature,
  FileText, 
  Gavel, 
  Scroll, 
  MessageCircle, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  Bookmark, 
  ExternalLink,
  Search
} from "lucide-react";
import Link from "next/link";

const steps = [
  {
    number: "01",
    tabIcon: <FolderSearch className="w-4 h-4" />,
    title: "Choose what you need",
    description: "Select the type of legal source you are looking for.",
    items: [
      {
        icon: <FileText className="w-4 h-4" />,
        label: "Statutes & Republic Acts",
      },
      {
        icon: <Gavel className="w-4 h-4" />,
        label: "Supreme Court Jurisprudence",
      },
      {
        icon: <Scroll className="w-4 h-4" />,
        label: "Executive & Legal Issuances",
      },
    ],
  },
  {
    number: "02",
    tabIcon: <FileQuestion className="w-4 h-4" />,
    title: "Ask a legal question",
    description: "Type your question in plain language. No legal jargon needed.",
    items: [
      {
        icon: <MessageCircle className="w-4 h-4" />,
        label: "Phrase it naturally",
      },
      {
        icon: <HelpCircle className="w-4 h-4" />,
        label: "Ask about a law, right, or case",
      },
      {
        icon: <Sparkles className="w-4 h-4" />,
        label: "AI finds the relevant sources",
      },
    ],
  },
  {
    number: "03",
    tabIcon: <FileSignature className="w-4 h-4" />,
    title: "Review grounded answers",
    description: "Every answer comes with the exact source. Verify it yourself.",
    items: [
      {
        icon: <CheckCircle2 className="w-4 h-4" />,
        label: "Clear, direct answer grounded in law",
      },
      {
        icon: <Bookmark className="w-4 h-4" />,
        label: "Exact citations & G.R. numbers",
      },
      {
        icon: <ExternalLink className="w-4 h-4" />,
        label: "Open original source to verify",
      },
    ],
  },
];

export default function Steps({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  return (
    <section
      id="steps"
      style={{ backgroundColor: "#FAF5F1" }}
      className="w-full py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        {/* Section Header */}
        <div className="mb-20 max-w-xl">
          <p
            style={{ color: "#A41F13" }}
            className="text-[13px] lg:text-[14px] font-semibold tracking-widest mb-3 underline underline-offset-[5px] decoration-[2px] inline-block"
          >
            How the app works
          </p>
          <h2
            style={{ color: "#292F36" }}
            className="text-3xl sm:text-4xl font-semibold leading-tight tracking-tight"
          >
            From question to cited answer in three steps.
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8 mt-6">
          {steps.map((step) => (
            <article
              key={step.number}
              style={{
                backgroundColor: "#FFFFFF",
                borderColor: "rgba(41, 47, 54, 0.08)",
              }}
              className="cursor-pointer relative flex flex-col gap-6 rounded-2xl border pl-12 pr-7 py-8 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 overflow-visible"
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

              {/* Sticky Page Marker / Document Tab (Step Number Badge) */}
              <div
                style={{ backgroundColor: "#A41F13", color: "#FAF5F1" }}
                className="
                  absolute -top-3.5 right-6 
                  px-3.5 py-2 rounded-lg 
                  shadow-md shadow-[#A41F13]/10
                  transform rotate-2 
                  text-sm font-bold tracking-wide
                  flex items-center gap-2
                  shrink-0 select-none
                "
              >
                {step.tabIcon}
                <span className="text-[15px] font-bold">{step.number}</span>
              </div>

              {/* Step Content */}
              <div className="flex flex-col gap-3 mt-2">
                <h3
                  style={{ color: "#292F36" }}
                  className="text-lg font-semibold leading-snug"
                >
                  {step.title}
                </h3>
                <p
                  style={{ color: "#8F7A6E" }}
                  className="text-[15px] lg:text-[16px] font-normal leading-relaxed"
                >
                  {step.description}
                </p>
              </div>

              {/* Feature List */}
              <ul className="flex flex-col gap-3 mt-1">
                {step.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span
                      style={{
                        color: "#A41F13",
                        backgroundColor: "rgba(164, 31, 19, 0.07)",
                      }}
                      className="shrink-0 mt-0.5 w-6 h-6 flex items-center justify-center rounded-md"
                    >
                      {item.icon}
                    </span>
                    <span
                      style={{ color: "#292F36" }}
                      className="text-[13px] lg:text-[14px] font-medium leading-snug pt-0.5"
                    >
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 flex items-center gap-4 flex-wrap justify-start">
          <Link
            href={isAuthenticated ? "/search" : "/auth/sign-up"}
            style={{ backgroundColor: "#A41F13", color: "#FAF5F1" }}
            className="
              cursor-pointer
              inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl
              text-[14px] font-semibold tracking-wide
              transition-all duration-200 ease-in-out
              hover:bg-[#8d1a0f] hover:shadow-md hover:shadow-[#A41F13]/15
              active:scale-[0.97]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A41F13]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF5F1]
            "
          >
            <Search className="w-4 h-4" />
            {isAuthenticated ? "Start Searching" : "Sign Up to Search"}
          </Link>
          
        </div>

      </div>
    </section>
  );
}

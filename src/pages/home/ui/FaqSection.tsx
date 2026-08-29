import { useState, useMemo, memo, useDeferredValue } from "react";

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const faqData: FAQ[] = [
  {
    id: "1",
    category: "Pricing",
    question: "How accurate is the online price calculator?",
    answer:
      "Our calculator provides a 95% accurate estimate based on current market rates for premium materials. The final quote only shifts if you choose ultra-customized luxury finishes or structural changes during the 3D design phase.",
  },
  {
    id: "2",
    category: "Process",
    question:
      "Do you design mixed-use properties (e.g., residential with ground-floor commercial shops)?",
    answer:
      "Absolutely. We specialize in complex architectural zoning, including G+1 and G+2 structures where the ground floor is optimized for high-traffic commercial retail (shutters/shops), while the upper floors are designed as private, luxury residential spaces.",
  },
  {
    id: "3",
    category: "General",
    question: "Which cities do you currently operate in?",
    answer:
      "We currently execute and deliver premium interior projects across Hyderabad, Warangal, and the surrounding regions, ensuring our on-ground execution teams can maintain strict quality control.",
  },
  {
    id: "4",
    category: "Process",
    question: "How long does a full home interior project take?",
    answer:
      "From the moment the 3D designs are locked in, our modular manufacturing and on-site installation typically take between 45 to 60 days. We provide a penalty-backed timeline guarantee.",
  },
  {
    id: "5",
    category: "Warranty",
    question: "What kind of warranty do you provide on woodwork?",
    answer:
      "All our custom modular units, including wardrobes and kitchens, come with a 10-year structural warranty and a 1-year free service maintenance guarantee. We use marine-grade, termite-proof plywood.",
  },
];

// 1. Extracted into a memoized component to prevent re-rendering the entire list when one opens
const FaqItem = memo(
  ({
    faq,
    isActive,
    onToggle,
    theme,
  }: {
    faq: FAQ;
    isActive: boolean;
    onToggle: (id: string) => void;
    theme: "default" | "about";
  }) => {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl transition-all duration-500 border ${
          theme === "about"
            ? "bg-white border-[#4a3f35]/10 hover:border-[#C5A059]/40 shadow-sm hover:shadow-md"
            : "bg-[#E0E5EC] shadow-[10px_10px_20px_#A3B1C6,-10px_-10px_20px_#FFFFFF] hover:shadow-[14px_14px_28px_#A3B1C6,-14px_-14px_28px_#FFFFFF] border-white/40"
        }`}
      >
        <button
          onClick={() => onToggle(faq.id)}
          aria-expanded={isActive}
          aria-controls={`faq-answer-${faq.id}`}
          id={`faq-question-${faq.id}`}
          className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none"
        >
          <div className="flex flex-col gap-1 pr-4">
            <span
              className={`text-[0.6rem] md:text-[0.65rem] font-bold tracking-widest uppercase ${
                theme === "about" ? "text-[#C5A059]" : "text-blue-500"
              }`}
            >
              {faq.category}
            </span>
            <span
              className={`text-xs md:text-base font-bold transition-all duration-300 ${
                isActive
                  ? theme === "about"
                    ? "text-[#C5A059] tracking-wide"
                    : "text-blue-700 tracking-wide"
                  : theme === "about"
                    ? "text-[#4a3f35]"
                    : "text-slate-700"
              }`}
              style={theme === "about" ? { fontFamily: "'Cinzel', serif" } : {}}
            >
              {faq.question}
            </span>
          </div>

          <div
            className={`shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
              isActive
                ? theme === "about"
                  ? "bg-[#C5A059] text-white rotate-180"
                  : "shadow-[inset_3px_3px_6px_#A3B1C6,inset_-3px_-3px_6px_#FFFFFF] text-blue-600 rotate-180"
                : theme === "about"
                  ? "bg-[#4a3f35]/5 text-[#4a3f35]"
                  : "shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] text-slate-500"
            }`}
          >
            <svg
              className="w-3 h-3 md:w-4 md:h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d={isActive ? "M20 12H4" : "M12 4v16m8-8H4"}
              />
            </svg>
          </div>
        </button>

        <div
          id={`faq-answer-${faq.id}`}
          role="region"
          aria-labelledby={`faq-question-${faq.id}`}
          className={`grid transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
            isActive
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="px-5 md:px-6 pb-5 md:pb-6 pt-2">
              <p
                className={`text-xs md:text-sm leading-relaxed ${
                  theme === "about"
                    ? "text-[#4a3f35]/80 font-light"
                    : "text-slate-600 font-medium"
                }`}
              >
                {faq.answer}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
FaqItem.displayName = "FaqItem"; // Good practice for memoized components

export const FaqSection = ({
  theme = "default",
}: {
  theme?: "default" | "about";
}) => {
  const [activeCategory, setActiveCategory] = useState("Warranty");
  const [activeId, setActiveId] = useState<string | null>(
    faqData.find((faq) => faq.category === "Warranty")?.id || null,
  );

  const [searchQuery, setSearchQuery] = useState("");

  // 2. useDeferredValue keeps the typing experience instant, rendering the list in the background
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(faqData.map((faq) => faq.category)))],
    [], // Array doesn't change, run once
  );

  const filteredFaqs = useMemo(() => {
    return faqData.filter((faq) => {
      const matchesSearch =
        faq.question
          .toLowerCase()
          .includes(deferredSearchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(deferredSearchQuery.toLowerCase());

      const matchesCategory =
        activeCategory === "All" || faq.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [deferredSearchQuery, activeCategory]);

  const handleToggle = (id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  // 3. Automated JSON-LD Generation for Perfect SEO Rich Snippets
  const jsonLdSchema = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqData.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    };
  }, []);

  return (
    <section
      className={`relative py-16 overflow-hidden flex flex-col items-center ${
        theme === "about"
          ? "bg-[#fdfbf7] text-[#4a3f35] font-sans"
          : "bg-gradient-to-br from-[#E0E5EC] via-[#EEF2F7] to-[#E0E5EC] text-slate-800 font-sans"
      }`}
    >
      {/* Inject SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Header */}
        <header className="text-center mb-10">
          <div
            className={`inline-flex items-center justify-center gap-2 mb-4 rounded-full px-5 py-2 ${
              theme === "about"
                ? "bg-[#4a3f35]/5 border border-[#4a3f35]/10"
                : "bg-[#E0E5EC] shadow-[inset_3px_3px_6px_#A3B1C6,inset_-3px_-3px_6px_#FFFFFF]"
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                theme === "about"
                  ? "bg-[#C5A059]"
                  : "bg-blue-500 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3)]"
              }`}
            ></span>
            <span
              className={`text-xs font-bold tracking-widest uppercase ${
                theme === "about" ? "text-[#4a3f35]/70" : "text-slate-500"
              }`}
              style={
                theme === "about" ? {} : { textShadow: "1px 1px 0px #FFF" }
              }
            >
              Knowledge Base
            </span>
          </div>

          <h2
            className={`text-3xl md:text-4xl font-bold tracking-tight mb-4 ${
              theme === "about" ? "text-[#4a3f35]" : "text-slate-700"
            }`}
            style={
              theme === "about"
                ? { fontFamily: "'Cinzel', serif" }
                : {
                    textShadow:
                      "2px 2px 4px rgba(163,177,198,0.5), -2px -2px 4px #FFFFFF",
                  }
            }
          >
            {theme === "about" ? (
              <>
                Frequently Asked{" "}
                <span className="text-[#C5A059]">Questions</span>
              </>
            ) : (
              <>
                Frequently Asked{" "}
                <span className="text-blue-600">Questions</span>
              </>
            )}
          </h2>

          <p
            className={`text-sm max-w-2xl mx-auto ${
              theme === "about"
                ? "text-[#4a3f35]/80 font-light"
                : "text-slate-500 font-medium"
            }`}
          >
            Everything you need to know about our process, pricing, and
            guarantees.
          </p>
        </header>

        {/* Search */}
        <div className="relative mb-8 group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <svg
              className={`h-5 w-5 ${
                theme === "about" ? "text-[#4a3f35]/40" : "text-slate-400"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <input
            type="search"
            className={`w-full rounded-2xl py-4 pl-14 pr-4 text-sm focus:outline-none transition-all duration-300 ${
              theme === "about"
                ? "bg-white border border-[#4a3f35]/15 text-[#4a3f35] placeholder-[#4a3f35]/40 focus:border-[#C5A059]"
                : "bg-[#E0E5EC] text-slate-700 placeholder-slate-400 border-none shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF]"
            }`}
            placeholder="Search questions or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div
          className="flex overflow-x-auto pb-4 md:pb-0 md:flex-wrap gap-3 md:gap-4 mb-10 justify-start md:justify-center no-scrollbar"
          role="tablist"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setActiveCategory(cat);
                  const firstInCategory =
                    cat === "All"
                      ? faqData[0]?.id
                      : faqData.find((faq) => faq.category === cat)?.id;
                  setActiveId(firstInCategory || null);
                }}
                className={`whitespace-nowrap px-5 md:px-6 py-2 md:py-2.5 rounded-full text-[10px] md:text-xs font-bold tracking-wide transition-all duration-300 ${
                  isActive
                    ? theme === "about"
                      ? "bg-[#C5A059] text-white border border-[#C5A059] shadow-sm"
                      : "text-blue-600 shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF]"
                    : theme === "about"
                      ? "bg-white text-[#4a3f35] border border-[#4a3f35]/15 hover:border-[#C5A059] hover:text-[#C5A059]"
                      : "text-slate-500 shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] hover:text-slate-700"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* FAQ LIST */}
        <div className="space-y-4 md:space-y-6">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <FaqItem
                key={faq.id}
                faq={faq}
                isActive={activeId === faq.id}
                onToggle={handleToggle}
                theme={theme}
              />
            ))
          ) : (
            <div
              className={`text-center py-12 rounded-2xl ${
                theme === "about"
                  ? "bg-white border border-[#4a3f35]/10 shadow-sm"
                  : "shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF]"
              }`}
            >
              <h3
                className={`text-sm font-bold mb-1 ${
                  theme === "about" ? "text-[#4a3f35]" : "text-slate-700"
                }`}
              >
                No questions found
              </h3>
              <p
                className={`text-xs ${
                  theme === "about"
                    ? "text-[#4a3f35]/60"
                    : "text-slate-500 font-medium"
                }`}
              >
                Try adjusting your search terms.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

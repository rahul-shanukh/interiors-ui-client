import { useState, useEffect } from "react";
const words = ["Full Home", "Kitchen", "Wardrobe", "Office"];

export const PriceCalculatorTeaser = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Automatically cycle through the words every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const calculators = [
    {
      title: "Full Home Interior",
      path: "/calculator/full-home",
      description:
        "Know the precise estimate for your complete home transformation.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      title: "Modular Kitchen",
      path: "/calculator/kitchen",
      description:
        "Calculate the exact cost for a modern, chef-ready kitchen setup.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      ),
    },
    {
      title: "Premium Wardrobe",
      path: "/calculator/wardrobe",
      description:
        "Get an estimate for custom-built, luxury storage solutions.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z M9 4v16 M15 4v16 M9 12h6"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative w-full bg-[#fcfbf9] overflow-hidden flex flex-col items-center">
      {/* 1. THE CLIFFHANGER BANNER (Replaces the red-circled area) */}
      <div className="w-full bg-[#2A3439] py-4 shadow-[0_10px_30px_rgba(0,0,0,0.2)] z-10 relative">
        <div className="max-w-7xl mx-auto px-4 text-center group cursor-pointer">
          <p className="text-[#C5A059] font-serif italic text-sm md:text-base tracking-[0.2em] transition-all duration-700 group-hover:tracking-[0.3em] group-hover:text-white flex items-center justify-center gap-4">
            <span className="h-[1px] w-8 bg-[#C5A059] opacity-50 transition-all duration-700 group-hover:w-16"></span>
            Curious about the investment? Let's calculate.
            <span className="h-[1px] w-8 bg-[#C5A059] opacity-50 transition-all duration-700 group-hover:w-16"></span>
          </p>
        </div>
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full text-center">
        {/* Animated Headline */}
        {/* Animated Headline - Pixel Perfect Edition */}
        <h2 className="text-3xl md:text-5xl font-serif text-[#13503B] mb-4 font-bold flex flex-wrap items-center justify-center gap-x-3 gap-y-1 md:gap-y-2">
          <span>Get the estimate for your</span>

          {/* Vertical Scrolling Text Window */}
          <span className="inline-block h-[1.2em] overflow-hidden align-bottom text-[#C5A059] min-w-[200px] md:min-w-[280px] text-center md:text-left">
            <span
              className="block transition-transform duration-1000 ease-[cubic-bezier(0.65,0,0.35,1)]"
              // FIX: Translating by exactly 1.2em (the height of one word) instead of percentages
              style={{ transform: `translateY(-${activeIndex * 1.2}em)` }}
            >
              {words.map((word) => (
                <span
                  key={word}
                  className="block h-[1.2em] leading-[1.2em] whitespace-nowrap drop-shadow-sm"
                >
                  {word}
                </span>
              ))}
            </span>
          </span>
        </h2>

        <p className="text-gray-500 max-w-2xl mx-auto mb-16 text-sm md:text-base tracking-wide">
          Calculate the approximate cost of doing up your home interiors in
          Warangal. No hidden fees, just absolute transparency.
        </p>

        {/* 3. LUXURY INTERACTIVE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {calculators.map((calc, idx) => (
            <div
              key={idx}
              className="group relative bg-white rounded-xl p-8 border border-gray-100 shadow-sm transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-4 hover:shadow-[0_20px_40px_rgba(19,80,59,0.12)] hover:border-[#C5A059]/30 flex flex-col h-full text-left"
            >
              {/* Icon Container with spin/glow effect */}
              <div className="w-16 h-16 rounded-full bg-[#f4f0ea] text-[#13503B] flex items-center justify-center mb-6 transition-all duration-700 group-hover:bg-[#13503B] group-hover:text-[#C5A059] group-hover:rotate-[360deg] shadow-inner group-hover:shadow-[0_0_20px_rgba(197,160,89,0.4)]">
                {calc.icon}
              </div>

              {/* Text Content */}
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-3 transition-colors duration-500 group-hover:text-[#13503B]">
                {calc.title}
              </h3>
              <p className="text-gray-500 text-sm mb-8 flex-grow leading-relaxed">
                {calc.description}
              </p>

              {/* Animated Button */}
              <button
                onMouseEnter={() => {
                  const link = document.createElement("link");
                  link.rel = "prefetch";
                  link.href = calc.path;
                  document.head.appendChild(link);
                }}
                onClick={() => {
                  const tab = window.open("", "calculatorTab");
                  if (tab) {
                    tab.location.href = calc.path;
                  } else {
                    window.location.href = calc.path;
                  }
                }}
                className="w-full relative overflow-hidden bg-gray-50 text-[#13503B] border border-gray-200 py-3.5 rounded font-semibold text-xs tracking-[0.2em] uppercase transition-all duration-500 group-hover:bg-[#13503B] group-hover:text-white group-hover:border-[#13503B]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Calculate
                  <svg
                    className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
                {/* Gold sweep effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C5A059]/20 to-transparent -translate-x-full transition-transform duration-1000 ease-in-out group-hover:translate-x-full z-0"></div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

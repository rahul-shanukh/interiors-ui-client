import React from "react";

const tickerItems = [
  {
    text: "Watch all courses for just $12/month",
    highlight: "The Creative Pass",
    icon: "☺",
  },
  {
    text: "Book 3D Consultation for free",
    highlight: "Limited Festival Offer",
    icon: "✦",
  },
  {
    text: "Explore Modern Modular Kitchens",
    highlight: "New Collection 2026",
    icon: "☺",
  },
];

export const PromoRollingBoard: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-slate-100 via-slate-200 to-slate-300 border-y border-slate-300 py-2.5 text-xs font-medium text-slate-800 shadow-[inset_0_1px_3px_rgba(255,255,255,0.8),inset_0_-1px_2px_rgba(0,0,0,0.1)] select-none">
      {/* Subtle top specular glass highlight line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-white pointer-events-none" />

      {/* Infinite Scrolling Track */}
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {/* First Set of Items */}
        <div className="flex items-center gap-10 px-5">
          {tickerItems.map((item, idx) => (
            <div
              key={`set1-${idx}`}
              className="flex items-center gap-3.5 whitespace-nowrap"
            >
              <span className="text-slate-600 drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
                {item.text}
              </span>

              {/* Skeuomorphic Raised Badge Pill */}
              <span className="px-2.5 py-1 rounded-md bg-gradient-to-b from-white via-slate-100 to-slate-200 text-slate-900 font-bold shadow-[0_1px_3px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,1)] border border-slate-300/80">
                {item.highlight}
              </span>

              <span className="text-sm text-amber-600 drop-shadow-[0_1px_1px_rgba(255,255,255,1)]">
                {item.icon}
              </span>
            </div>
          ))}
        </div>

        {/* Duplicate Set of Items for Seamless Infinite Loop */}
        <div className="flex items-center gap-10 px-5">
          {tickerItems.map((item, idx) => (
            <div
              key={`set2-${idx}`}
              className="flex items-center gap-3.5 whitespace-nowrap"
            >
              <span className="text-slate-600 drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
                {item.text}
              </span>

              {/* Skeuomorphic Raised Badge Pill */}
              <span className="px-2.5 py-1 rounded-md bg-gradient-to-b from-white via-slate-100 to-slate-200 text-slate-900 font-bold shadow-[0_1px_3px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,1)] border border-slate-300/80">
                {item.highlight}
              </span>

              <span className="text-sm text-amber-600 drop-shadow-[0_1px_1px_rgba(255,255,255,1)]">
                {item.icon}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Subtle bottom shadow line for physical recessed groove depth */}
      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-slate-300 pointer-events-none" />
    </div>
  );
};

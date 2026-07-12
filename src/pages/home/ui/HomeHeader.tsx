import React, { useState, useEffect } from "react";
import { Button } from "../../../shared/ui/Button";
import { ConsultOnlineModal } from "../../../features/consult-online/ui/ConsultOnlineModal";
import { useQueryClient } from "@tanstack/react-query";

export const HomeHeader: React.FC = () => {
  const queryClient = useQueryClient();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Detect scroll to add the subtle shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Primary Nav Items
  const primaryLinks = ["Design Ideas", "Projects", "Store Locator", "More"];

  // Secondary Ribbon Items
  const secondaryLinks = [
    "How it works",
    "Price Calculators",
    "The Modular Journey",
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 bg-gray-300 ${
        isScrolled ? "shadow-md" : "border-b border-gray-100"
      }`}
    >
      {/* Tier 1: Main Navigation */}
      <div className="w-full px-6 lg:px-6">
        <div className="flex justify-between items-center h-20">
          {/* One-of-a-Kind Emerald Renaissance Logo */}
          <a
            href="/"
            className="flex items-center gap-4 cursor-pointer group relative py-2"
          >
            {/* Logo Image & Aura */}
            <div className="relative">
              <img
                src="/jc-logo.png"
                alt="JC Interiors Logo"
                // Adjusted to valid Tailwind heights: h-16 (4rem), md:h-20 (5rem)
                className="h-16 md:h-20 w-auto object-contain transition-all duration-700 ease-out transform drop-shadow-[0_4px_6px_rgba(19,80,59,0.15)] group-hover:-translate-y-1 group-hover:scale-105 group-hover:drop-shadow-[0_10px_20px_rgba(19,80,59,0.3)] z-10 relative"
              />
              {/* Expanding 'Divine Backlight' effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#13503B] to-[#C5A059] opacity-0 group-hover:opacity-20 blur-2xl rounded-full transition-all duration-1000 ease-out pointer-events-none scale-50 group-hover:scale-150 -z-10"></div>
            </div>

            {/* Brand Typography with Architectural Divider */}
            <div className="flex flex-col justify-center border-l-[1px] border-[#13503B]/20 pl-4 py-1 transition-colors duration-700 group-hover:border-[#C5A059]">
              {/* Main Title: Deep Emerald */}
              <span
                className="text-3xl md:text-4xl font-bold tracking-[0.1em] text-[#13503B] transition-all duration-1000 ease-out group-hover:tracking-[0.25em]"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                JC
              </span>

              {/* Subtext: Antique Gold turning to Emerald */}
              <span
                className="text-xs md:text-sm font-semibold tracking-[0.4em] text-[#C5A059] transition-all duration-1000 ease-out group-hover:tracking-[0.6em] group-hover:text-[#13503B] mt-0.5"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                INTERIORS
              </span>
            </div>
          </a>

          {/* Desktop Primary Nav - Emerald Renaissance Edition */}
          <nav className="hidden lg:flex items-center space-x-10 xl:space-x-12">
            {primaryLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(" ", "-")}`}
                className="group relative py-2 text-[#13503B] uppercase text-xs xl:text-sm font-semibold tracking-[0.15em] transition-all duration-1000 ease-out hover:text-[#C5A059] hover:tracking-[0.25em]"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {link}

                {/* Subtle central expanding gold line */}
                <span className="absolute left-1/2 bottom-0 h-[1px] w-0 -translate-x-1/2 bg-[#C5A059] opacity-0 transition-all duration-1000 ease-out group-hover:w-full group-hover:opacity-100"></span>
              </a>
            ))}
          </nav>

          {/* Desktop CTA - Emerald Renaissance Edition */}
          <div className="hidden lg:flex items-center">
            <button
              onClick={() => queryClient.setQueryData(["consultModalOpen"], true)}
              className="
              relative group overflow-hidden
              px-8 py-3.5 
              border border-[#13503B] 
              bg-transparent
              text-[#13503B] font-serif uppercase tracking-[0.2em] text-xs font-semibold
              transition-all duration-700 ease-in-out
              hover:bg-[#13503B] hover:text-[#F4F0EA] hover:border-[#13503B]
              hover:shadow-[0_0_20px_rgba(19,80,59,0.5)]
            "
            >
              <span className="relative z-10 flex items-center gap-2">
                {/* Subtle classic star/sparkle icon */}
                <svg
                  className="w-3.5 h-3.5 opacity-80"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2L14.39 9.61L22 12L14.39 14.39L12 22L9.61 14.39L2 12L9.61 9.61L12 2Z" />
                </svg>
                Consult Online Now
              </span>

              {/* Elegant sweeping glass/shine effect on hover */}
              <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[45deg] transition-all duration-1000 group-hover:left-[200%] z-0"></div>
            </button>
          </div>

          {/* Floating Emerald Interactive Mobile Menu Button */}
          <div className="flex lg:hidden items-center z-50">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              className="
                group relative flex items-center justify-center w-12 h-12 
                rounded-full bg-[#13503B] border border-[#C5A059]/20
                shadow-[0_4px_15px_rgba(19,80,59,0.4)]
                transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                hover:shadow-[0_8px_25px_rgba(197,160,89,0.25)] hover:border-[#C5A059]/60 hover:-translate-y-0.5
                active:scale-90 active:shadow-[0_2px_10px_rgba(19,80,59,0.5)] active:translate-y-1
              "
            >
              {/* Floating Antique Gold Aura on Hover */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#13503B] to-[#C5A059] opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-700 pointer-events-none"></div>

              {/* Animated Hamburger Lines */}
              <div className="relative w-5 h-3.5 z-10 flex flex-col justify-between">
                {/* Top Line */}
                <span
                  className={`absolute left-0 h-[1.5px] bg-[#C5A059] transition-all duration-500 ease-in-out
                    ${
                      isMobileMenuOpen
                        ? "top-1/2 -translate-y-1/2 rotate-45 w-full"
                        : "top-0 w-full"
                    }`}
                />

                {/* Middle Line - Shoots out to the right when opened */}
                <span
                  className={`absolute left-0 top-1/2 -translate-y-1/2 h-[1.5px] bg-[#C5A059] transition-all duration-400 ease-in-out
                    ${
                      isMobileMenuOpen
                        ? "opacity-0 translate-x-4 w-0"
                        : "opacity-100 w-full group-hover:translate-x-0.5"
                    }`}
                />

                {/* Bottom Line - Asymmetrical in resting state, full width on hover/open */}
                <span
                  className={`absolute left-0 h-[1.5px] bg-[#C5A059] transition-all duration-500 ease-in-out
                    ${
                      isMobileMenuOpen
                        ? "top-1/2 -translate-y-1/2 -rotate-45 w-full"
                        : "bottom-0 w-3/4 group-hover:w-full"
                    }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Tier 2: Secondary Ribbon (Desktop Only) - Editorial Luxury Edition */}
      <div className="hidden lg:block bg-[#aabaac] border-t border-[#C5A059]/20 shadow-[inset_0_4px_6px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Centering the links makes it feel like a premium magazine layout */}
          <div className="flex justify-center items-center space-x-12 py-3">
            {secondaryLinks.map((link) => {
              // Target the highest-value link to make it stand out
              const isHighlight = link === "Price Calculators";

              return (
                <a
                  key={link}
                  href={`#${link.toLowerCase().replace(" ", "-")}`}
                  className={`
                    group relative flex items-center text-[0.65rem] xl:text-xs font-semibold uppercase tracking-[0.25em] transition-all duration-700 ease-out hover:-translate-y-[1px]
                    ${isHighlight ? "text-[#f0a10d]" : "text-gray-300 hover:text-white"}
                  `}
                >
                  {/* The 'Golden Beacon' eye-catcher for the highlighted conversion link */}
                  {isHighlight && (
                    <span className="absolute -left-4 flex h-1.5 w-1.5 items-center justify-center">
                      {/* Layer 1: The expanding and fading radar ring (Ping effect) */}
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ef1410] opacity-75"></span>

                      {/* Layer 2: The solid inner core with a static glow */}
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#efa110] shadow-[0_0_8px_rgba(239,161,16,0.8)]"></span>
                    </span>
                  )}

                  {link}

                  {/* Expanding underline on hover - Gold for the highlight, white for others */}
                  <span
                    className={`
                    absolute -bottom-1.5 left-1/2 h-[1px] w-0 -translate-x-1/2 transition-all duration-700 ease-out group-hover:w-full
                    ${isHighlight ? "bg-[#C5A059]" : "bg-white"}
                  `}
                  ></span>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer (Combines both tiers) */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full bg-white shadow-xl transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? "max-h-[80vh] border-t border-gray-100" : "max-h-0"
        }`}
      >
        <div className="px-4 py-6 space-y-6 overflow-y-auto max-h-[80vh]">
          {/* Mobile Primary Links */}
          <div className="space-y-4">
            {primaryLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(" ", "-")}`}
                className="block text-lg font-medium text-gray-900"
              >
                {link}
              </a>
            ))}
          </div>

          <hr className="border-gray-100" />

          {/* Mobile Secondary Links */}
          <div className="space-y-4">
            {secondaryLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(" ", "-")}`}
                className="block text-sm font-medium text-gray-500"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Mobile CTA */}
          <div className="pt-4">
            <Button
              variant="primary"
              size="lg"
              className="w-full rounded-sm"
              onClick={() => {
                queryClient.setQueryData(["consultModalOpen"], true);
                setIsMobileMenuOpen(false);
              }}
            >
              Consult Online Now
            </Button>
          </div>
        </div>
      </div>
      <ConsultOnlineModal />
    </header>
  );
};

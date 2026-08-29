import React, { useState, useCallback, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../../shared/ui/Button";
import { ConsultOnlineModal } from "../../../features/consult-online/ui/ConsultOnlineModal";
import { useScrollState } from "../../../shared/hooks/useScrollState";
import logo from "../../../assets/logo/plain logo only.avif";

// 1. Hoist static data outside component to eliminate redundant memory allocations on render
const PRIMARY_LINKS = [
  { label: "Design Ideas", href: "/design-ideas", isRoute: true },
  { label: "Projects", href: "#projects", isRoute: false },
  { label: "Store Locator", href: "/store-locator", isRoute: true },
  { label: "More", href: "#more", isRoute: false },
];

const SECONDARY_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Price Calculators", href: "#price-calculators", isHighlight: true },
  { label: "The Modular Journey", href: "#the-modular-journey" },
];

export const HomeHeader: React.FC = memo(() => {
  const navigate = useNavigate();
  const isScrolled = useScrollState(10);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 2. Stable callbacks for handlers
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleConsultClick = useCallback(() => {
    closeMobileMenu();
    navigate("/about-us");
  }, [navigate, closeMobileMenu]);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 bg-gray-300 ${
        isScrolled ? "shadow-md" : "border-b border-gray-100"
      }`}
    >
      {/* Tier 1: Main Navigation */}
      <div className="w-full px-6 lg:px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo with LCP and zero-CLS image optimization */}
          <Link
            to="/"
            className="flex items-center gap-4 cursor-pointer group relative py-2"
            aria-label="JC Interiors Home"
          >
            <div className="relative">
              <img
                src={logo}
                alt="JC Interiors Logo"
                width={80}
                height={80}
                loading="eager"
                // @ts-ignore - fetchPriority is supported in modern browsers
                fetchPriority="high"
                className="h-16 md:h-20 w-auto object-contain transition-all duration-700 ease-out transform drop-shadow-[0_4px_6px_rgba(19,80,59,0.15)] group-hover:-translate-y-1 group-hover:scale-105 group-hover:drop-shadow-[0_10px_20px_rgba(19,80,59,0.3)] z-10 relative"
              />
              <div className="absolute inset-0 bg-linear-to-tr from-[#13503B] to-[#C5A059] opacity-0 group-hover:opacity-20 blur-2xl rounded-full transition-all duration-1000 ease-out pointer-events-none scale-50 group-hover:scale-150 -z-10" />
            </div>

            <div className="flex flex-col justify-center border-l border-[#13503B]/20 pl-4 py-1 transition-colors duration-700 group-hover:border-[#C5A059]">
              <span
                className="text-3xl md:text-4xl font-bold tracking-widest text-[#13503B] transition-all duration-1000 ease-out group-hover:tracking-[0.25em]"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                JC
              </span>
              <span
                className="text-xs md:text-sm font-semibold tracking-[0.4em] text-[#C5A059] transition-all duration-1000 ease-out group-hover:tracking-[0.6em] group-hover:text-[#13503B] mt-0.5"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                INTERIORS
              </span>
            </div>
          </Link>

          {/* Desktop Primary Nav */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center space-x-10 xl:space-x-12"
          >
            {PRIMARY_LINKS.map(({ label, href, isRoute }) =>
              isRoute ? (
                <Link
                  key={label}
                  to={href}
                  className="group relative py-2 text-[#13503B] uppercase text-xs xl:text-sm font-semibold tracking-[0.15em] transition-all duration-1000 ease-out hover:text-[#C5A059] hover:tracking-[0.25em]"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {label}
                  <span className="absolute left-1/2 bottom-0 h-[1px] w-0 -translate-x-1/2 bg-[#C5A059] opacity-0 transition-all duration-1000 ease-out group-hover:w-full group-hover:opacity-100" />
                </Link>
              ) : (
                <a
                  key={label}
                  href={href}
                  className="group relative py-2 text-[#13503B] uppercase text-xs xl:text-sm font-semibold tracking-[0.15em] transition-all duration-1000 ease-out hover:text-[#C5A059] hover:tracking-[0.25em]"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {label}
                  <span className="absolute left-1/2 bottom-0 h-[1px] w-0 -translate-x-1/2 bg-[#C5A059] opacity-0 transition-all duration-1000 ease-out group-hover:w-full group-hover:opacity-100" />
                </a>
              ),
            )}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center">
            <button
              onClick={() => navigate("/about-us")}
              type="button"
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
                <svg
                  className="w-3.5 h-3.5 opacity-80"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2L14.39 9.61L22 12L14.39 14.39L12 22L9.61 14.39L2 12L9.61 9.61L12 2Z" />
                </svg>
                More About Us
              </span>
              <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[45deg] transition-all duration-1000 group-hover:left-[200%] z-0" />
            </button>
          </div>

          {/* Mobile Menu Button with Accessible States */}
          <div className="flex lg:hidden items-center z-50">
            <button
              onClick={toggleMobileMenu}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu-drawer"
              type="button"
              className="
                group relative flex items-center justify-center w-12 h-12 
                rounded-full bg-[#13503B] border border-[#C5A059]/20
                shadow-[0_4px_15px_rgba(19,80,59,0.4)]
                transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                hover:shadow-[0_8px_25px_rgba(197,160,89,0.25)] hover:border-[#C5A059]/60 hover:-translate-y-0.5
                active:scale-90 active:shadow-[0_2px_10px_rgba(19,80,59,0.5)] active:translate-y-1
              "
            >
              <div className="absolute inset-0 rounded-full bg-linear-to-tr from-[#13503B] to-[#C5A059] opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-700 pointer-events-none" />

              <div className="relative w-5 h-3.5 z-10 flex flex-col justify-between">
                <span
                  className={`absolute left-0 h-[1.5px] bg-[#C5A059] transition-all duration-500 ease-in-out ${
                    isMobileMenuOpen
                      ? "top-1/2 -translate-y-1/2 rotate-45 w-full"
                      : "top-0 w-full"
                  }`}
                />
                <span
                  className={`absolute left-0 top-1/2 -translate-y-1/2 h-[1.5px] bg-[#C5A059] transition-all duration-400 ease-in-out ${
                    isMobileMenuOpen
                      ? "opacity-0 translate-x-4 w-0"
                      : "opacity-100 w-full group-hover:translate-x-0.5"
                  }`}
                />
                <span
                  className={`absolute left-0 h-[1.5px] bg-[#C5A059] transition-all duration-500 ease-in-out ${
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

      {/* Tier 2: Secondary Ribbon (Desktop Only) */}
      <nav
        aria-label="Secondary Navigation"
        className="hidden lg:block bg-[#aabaac] border-t border-[#C5A059]/20 shadow-[inset_0_4px_6px_rgba(0,0,0,0.1)]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center space-x-12 py-3">
            {SECONDARY_LINKS.map(({ label, href, isHighlight }) => (
              <a
                key={label}
                href={href}
                className={`
                  group relative flex items-center text-[0.65rem] xl:text-xs font-semibold uppercase tracking-[0.25em] transition-all duration-700 ease-out hover:-translate-y-px
                  ${isHighlight ? "text-[#f0a10d]" : "text-gray-300 hover:text-white"}
                `}
              >
                {isHighlight && (
                  <span className="absolute -left-4 flex h-1.5 w-1.5 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ef1410] opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#efa110] shadow-[0_0_8px_rgba(239,161,16,0.8)]" />
                  </span>
                )}

                {label}

                <span
                  className={`
                    absolute -bottom-1.5 left-1/2 h-px w-0 -translate-x-1/2 transition-all duration-700 ease-out group-hover:w-full
                    ${isHighlight ? "bg-[#C5A059]" : "bg-white"}
                  `}
                />
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div
        id="mobile-menu-drawer"
        role="region"
        aria-label="Mobile Navigation Drawer"
        className={`lg:hidden absolute top-full left-0 w-full bg-white shadow-xl transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? "max-h-[80vh] border-t border-gray-100" : "max-h-0"
        }`}
      >
        <div className="px-4 py-6 space-y-6 overflow-y-auto max-h-[80vh]">
          {/* Mobile Primary Links */}
          <nav aria-label="Mobile Main Navigation" className="space-y-4">
            {PRIMARY_LINKS.map(({ label, href, isRoute }) =>
              isRoute ? (
                <Link
                  key={label}
                  to={href}
                  onClick={closeMobileMenu}
                  className="block text-lg font-medium text-gray-900"
                >
                  {label}
                </Link>
              ) : (
                <a
                  key={label}
                  href={href}
                  onClick={closeMobileMenu}
                  className="block text-lg font-medium text-gray-900"
                >
                  {label}
                </a>
              ),
            )}
          </nav>

          <hr className="border-gray-100" />

          {/* Mobile Secondary Links */}
          <nav aria-label="Mobile Secondary Navigation" className="space-y-4">
            {SECONDARY_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={closeMobileMenu}
                className="block text-sm font-medium text-gray-500"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Mobile CTA */}
          <div className="pt-4">
            <Button
              variant="primary"
              size="lg"
              className="w-full rounded-sm"
              onClick={handleConsultClick}
            >
              Consult Online Now
            </Button>
          </div>
        </div>
      </div>

      <ConsultOnlineModal />
    </header>
  );
});

HomeHeader.displayName = "HomeHeader";

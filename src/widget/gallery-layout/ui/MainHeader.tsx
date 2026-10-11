import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const navigationItems = [
  { label: "Design Ideas", path: "/design-ideas" },
  { label: "Projects", path: "/projects" },
  { label: "Price Calculator", path: "/price-calculator" },
  { label: "About Us", path: "/about-us" },
];

export const MainHeader: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(
        `/design-ideas?search=${encodeURIComponent(searchQuery.trim())}`,
      );
    }
  };

  return (
    <header className="w-full border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 transition-all">
      <div className="flex w-full items-center justify-between gap-4 px-4 py-3 md:px-8">
        {/* Left Group: Logo and Navigation */}
        <div className="flex items-center gap-6 lg:gap-10 shrink-0">
          {/* Logo */}
          <Link
            to="/design-ideas"
            className="text-2xl font-bold text-gray-900 transition-transform duration-300 hover:scale-[1.02]"
          >
            Interior
            <span className="text-[var(--primary)]">Design</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden items-center gap-6 lg:flex">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative py-1 text-sm font-medium tracking-wide transition-all duration-300 hover:-translate-y-0.5 ${
                    isActive
                      ? "text-[var(--primary)] font-semibold"
                      : "text-gray-600 hover:text-gray-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 w-full bg-[var(--primary)] transition-transform duration-300 ease-out origin-left ${
                        isActive ? "scale-x-100" : "scale-x-0 hover:scale-x-100"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Center: Search Bar (Matching Reference Image) */}
        <div className="flex-1 max-w-md mx-2 hidden sm:block">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <div className="relative flex items-center">
              {/* Search Icon */}
              <svg
                className="absolute left-3.5 h-4 w-4 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>

              {/* Input Field */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Collections"
                className="w-full rounded-xl bg-gray-100/80 py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-500 border border-transparent transition-all duration-300 focus:bg-white focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 hover:bg-gray-100"
              />
            </div>
          </form>
        </div>

        {/* Right Group: Action CTA Button */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/about-us"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
          >
            <span className="relative z-10">Consult Online</span>
            <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

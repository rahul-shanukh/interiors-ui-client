import React, { useState, useRef, useEffect } from "react";

interface GalleryFiltersProps {
  onFilterChange?: (filters: Record<string, string[]>) => void;
  onReset?: () => void;
}

export const GalleryFilters: React.FC<GalleryFiltersProps> = ({
  onFilterChange,
  onReset,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({
    style: [],
    color: [],
    budget: [],
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (key: string) => {
    setActiveDropdown(activeDropdown === key ? null : key);
  };

  const handleSelectOption = (category: string, value: string) => {
    const current = selectedFilters[category] || [];
    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];

    const newFilters = { ...selectedFilters, [category]: updated };
    setSelectedFilters(newFilters);
    onFilterChange?.(newFilters); 
  };

  const handleResetFilters = () => {
    const cleared = { style: [], color: [], budget: [] };
    setSelectedFilters(cleared);
    setActiveDropdown(null);
    onReset?.();
    onFilterChange?.(cleared);
  };

  const totalActiveCount = Object.values(selectedFilters).reduce(
    (acc, val) => acc + val.length,
    0,
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl bg-gradient-to-b from-slate-100 via-slate-200 to-slate-300 p-3 shadow-[inset_0_1px_3px_rgba(255,255,255,0.8),0_4px_12px_rgba(0,0,0,0.06)] border border-slate-300 flex items-center justify-between gap-4 select-none"
    >
      {" "}
      {/* Left Group: Filter Category Buttons */}
      <div className="flex items-center gap-3">
        {/* Style Filter */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown("style")}
            className={`group flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              selectedFilters.style.length > 0
                ? "bg-(--primary) text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_2px_5px_rgba(0,0,0,0.2)]"
                : "bg-gradient-to-b from-white via-slate-50 to-slate-200 text-slate-800 border border-slate-300/90 shadow-[0_2px_4px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,1)] hover:scale-[1.02] active:scale-95"
            }`}
          >
            <span>Style</span>
            {selectedFilters.style.length > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[var(--primary)] text-[10px] font-bold">
                {selectedFilters.style.length}
              </span>
            )}
            <span className="text-[10px] opacity-70">▼</span>
          </button>

          {activeDropdown === "style" && (
            <div className="absolute left-0 mt-2 w-48 rounded-xl bg-white p-2 shadow-2xl border border-slate-200 z-30">
              {["Modern", "Traditional", "Minimal", "Industrial"].map(
                (item) => {
                  const val = item.toLowerCase();
                  const isSelected = selectedFilters.style.includes(val);
                  return (
                    <button
                      key={val}
                      onClick={() => handleSelectOption("style", val)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                        isSelected
                          ? "bg-[var(--header-background)] text-[var(--text-heading)] font-bold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span>{item}</span>
                      {isSelected && <span>✓</span>}
                    </button>
                  );
                },
              )}
            </div>
          )}
        </div>

        {/* Color Filter with Visual Swatches */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown("color")}
            className={`group flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              selectedFilters.color.length > 0
                ? "bg-[var(--primary)] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_2px_5px_rgba(0,0,0,0.2)]"
                : "bg-gradient-to-b from-white via-slate-50 to-slate-200 text-slate-800 border border-slate-300/90 shadow-[0_2px_4px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,1)] hover:scale-[1.02] active:scale-95"
            }`}
          >
            <span>Color</span>
            {/* Visual Color Swatches preview */}
            <div className="flex items-center gap-1 opacity-90">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400 border border-white/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-700 border border-white/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 border border-white/60" />
            </div>
            <span className="text-[10px] opacity-70">▼</span>
          </button>

          {activeDropdown === "color" && (
            <div className="absolute left-0 mt-2 w-48 rounded-xl bg-white p-2 shadow-2xl border border-slate-200 z-30">
              {[
                { label: "White", hex: "#ffffff" },
                { label: "Brown", hex: "#a52a2a" },
                { label: "Grey", hex: "#808080" },
                { label: "Navy", hex: "#000080" },
              ].map((c) => {
                const val = c.label.toLowerCase();
                const isSelected = selectedFilters.color.includes(val);
                return (
                  <button
                    key={val}
                    onClick={() => handleSelectOption("color", val)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                      isSelected
                        ? "bg-[var(--header-background)] text-[var(--text-heading)] font-bold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full border border-slate-300 shadow-xs"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.label}</span>
                    </div>
                    {isSelected && <span>✓</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Budget Filter */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown("budget")}
            className={`group flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              selectedFilters.budget.length > 0
                ? "bg-[var(--primary)] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_2px_5px_rgba(0,0,0,0.2)]"
                : "bg-gradient-to-b from-white via-slate-50 to-slate-200 text-slate-800 border border-slate-300/90 shadow-[0_2px_4px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,1)] hover:scale-[1.02] active:scale-95"
            }`}
          >
            <span>Budget</span>
            {selectedFilters.budget.length > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[var(--primary)] text-[10px] font-bold">
                {selectedFilters.budget.length}
              </span>
            )}
            <span className="text-[10px] opacity-70">▼</span>
          </button>

          {activeDropdown === "budget" && (
            <div className="absolute left-0 mt-2 w-48 rounded-xl bg-white p-2 shadow-2xl border border-slate-200 z-30">
              {[
                { label: "Below ₹5L", val: "low" },
                { label: "₹5L - ₹10L", val: "medium" },
                { label: "Above ₹10L", val: "high" },
              ].map((item) => {
                const isSelected = selectedFilters.budget.includes(item.val);
                return (
                  <button
                    key={item.val}
                    onClick={() => handleSelectOption("budget", item.val)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                      isSelected
                        ? "bg-[var(--header-background)] text-[var(--text-heading)] font-bold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isSelected && <span>✓</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {/* Right Group: Active Counter Badge and Reset Action */}
      <div className="flex items-center gap-3">
        {totalActiveCount > 0 && (
          <div className="flex items-center px-3 py-1.5 rounded-xl bg-gradient-to-b from-white via-slate-50 to-slate-200 border border-slate-300 shadow-[0_2px_4px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,1)]">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary)] text-white text-[11px] font-bold shadow-xs">
              {totalActiveCount}
            </span>
          </div>
        )}

        <button
          onClick={handleResetFilters}
          className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-b from-white via-slate-50 to-slate-200 text-slate-800 text-xs font-semibold border border-slate-300/90 shadow-[0_2px_4px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,1)] hover:scale-[1.02] active:scale-95 transition-all duration-200"
        >
          <span>Reset filters</span>
          <span className="text-slate-500 transition-transform duration-300 group-hover:-rotate-90">
            ↺
          </span>
        </button>
      </div>
    </div>
  );
};

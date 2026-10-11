import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

export interface RoomCategory {
  id: string;
  label: string;
  slug: string;
}

export const ROOM_CATEGORIES: RoomCategory[] = [
  { id: "1", label: "Kitchen", slug: "kitchen" },
  { id: "2", label: "Master Bedroom", slug: "master-bedroom" },
  { id: "3", label: "Living Room", slug: "living-room" },
  { id: "4", label: "Bathroom", slug: "bathroom" },
  { id: "5", label: "Homes by JC Interiors", slug: "homes-by-jc" },
  { id: "6", label: "Wardrobe", slug: "wardrobe" },
  { id: "7", label: "Study Room Designs", slug: "study-room" },
  { id: "8", label: "Kid's Bedroom", slug: "kids-bedroom" },
  { id: "9", label: "TV Unit Designs", slug: "tv-unit" },
  { id: "10", label: "Pooja Room", slug: "pooja-room" },
  { id: "11", label: "False Ceiling", slug: "false-ceiling" },
  { id: "12", label: "Foyer Design", slug: "foyer" },
];

interface RoomNavigationTabsProps {
  activeRoom: string;
  categories?: RoomCategory[];
}

export const RoomNavigationTabs: React.FC<RoomNavigationTabsProps> = ({
  activeRoom,
  categories = ROOM_CATEGORIES,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Handle smooth scroll right when arrow button is clicked
  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };
  return (
    <div className="relative w-full border-b border-gray-200/80 bg-white/95 backdrop-blur-sm select-none shadow-[inset_0_-1px_2px_rgba(0,0,0,0.03)]">
      <div className="mx-auto flex max-w-7xl items-center px-4 md:px-8">
        {/* Scrollable Room Tabs Track */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-8 overflow-x-auto py-3.5 no-scrollbar scroll-smooth whitespace-nowrap pr-12"
        >
          {categories.map((item) => {
            const isActive = activeRoom === item.slug;

            return (
              <button
                key={item.id}
                onClick={() => navigate(`/design-ideas/${item.slug}`)}
                className={`relative pb-1.5 text-sm font-medium transition-all duration-300 shrink-0 ${
                  isActive
                    ? "text-(--primary) font-semibold scale-105 drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]"
                    : "text-gray-600 hover:text-gray-900 hover:-translate-y-0.5"
                }`}
              >
                <span>{item.label}</span>

                {/* Skeuomorphic Glossy Active Line */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 h-[3px] w-full rounded-full bg-(--primary) shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.6)]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Skeuomorphic Floating Scroll Control Arrow Button (Matches Image) */}
        <div className="absolute right-4 z-10 flex items-center bg-gradient-to-l from-white via-white/90 to-transparent pl-6">
          <button
            onClick={handleScrollRight}
            aria-label="Scroll categories right"
            className="group flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-white via-gray-50 to-gray-200 border border-gray-300/80 text-gray-700 shadow-[0_2px_5px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,1)] hover:scale-110 active:scale-95 transition-all duration-200"
          >
            <span className="text-xs transition-transform duration-200 group-hover:translate-x-0.5">
              ❯
            </span>
          </button>
        </div>

        {/* Skeuomorphic Floating Scroll Control Arrow Button (Matches Image) */}
        <div className="absolute left-4 z-10 flex items-center bg-gradient-to-r from-white via-white/90 to-transparent pr-6">
          <button
            onClick={handleScrollLeft}
            aria-label="Scroll categories left"
            className="group flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-white via-gray-50 to-gray-200 border border-gray-300/80 text-gray-700 shadow-[0_2px_5px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,1)] hover:scale-110 active:scale-95 transition-all duration-200"
          >
            <span className="text-xs transition-transform duration-200 group-hover:-translate-x-0.5">
              ❮
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

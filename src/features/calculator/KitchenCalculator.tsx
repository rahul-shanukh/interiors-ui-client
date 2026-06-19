import React, { useState } from "react";
// If you are using icons for checkmarks or arrows, import them here.
// For this example, I will use text and styled divs for clarity.

// Mock layout data with illustrative details and descriptive graphics.
const kitchenLayouts = [
  {
    id: "l-shaped",
    name: "L-shaped",
    description: "Corner-optimized for a logical, efficient work triangle.",
    graphic: "/graphics/l-shaped-floorplan.png",
  },
  {
    id: "straight",
    name: "Straight",
    description: "Compact and simple, perfect for single-wall spaces.",
    graphic: "/graphics/straight-floorplan.png",
  },
  {
    id: "u-shaped",
    name: "U-shaped",
    description: "Maximized counter space and a versatile cooking zone.",
    graphic: "/graphics/u-shaped-floorplan.png",
  },
  {
    id: "island",
    name: "Island / Simple",
    description:
      "Features a central focus point or acts as a supplementary area.",
    graphic: "/graphics/simple-offset-floorplan.png",
  },
];

export const KitchenCalculator: React.FC = () => {
  const [selectedLayoutId, setSelectedLayoutId] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelectedLayoutId(id);
  };

  const steps = ["Kitchen Layout", "Measurements", "Package", "Get Quote"];

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#faf8f5] text-gray-800 font-sans p-6 md:p-12">
      {/* 1. Progress Header (Enhanced from reference) */}
      <header className="w-full max-w-7xl flex flex-col items-center mb-10 border-b border-gray-200 pb-8">
        <div className="flex items-center space-x-2 md:space-x-10 text-xs md:text-sm">
          {steps.map((step, index) => {
            const isActive = index === 0;
            const isCompleted = index < 0; // future logic for completed steps
            return (
              <div key={step} className="flex items-center space-x-2">
                <div
                  className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300
                  ${isActive ? "border-red-500 bg-red-50 text-red-600 font-bold" : isCompleted ? "border-red-500 bg-red-500 text-white" : "border-gray-300 bg-white text-gray-500"}`}
                >
                  {isCompleted ? <span className="text-lg">✓</span> : index + 1}
                </div>
                <span
                  className={`transition-all ${isActive ? "text-red-600 font-semibold" : "text-gray-500"}`}
                >
                  {step}
                </span>
                {index < steps.length - 1 && (
                  <div className="h-0.5 w-10 md:w-24 bg-gray-200 rounded-full" />
                )}
              </div>
            );
          })}
        </div>
      </header>

      {/* 2. Main Calculator Card */}
      <div className="w-full max-w-7xl bg-white p-8 md:p-14 rounded-[40px] shadow-2xl border border-gray-100">
        {/* 3. Title Section */}
        <section className="text-center mb-14">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
            Select the layout of your kitchen
          </h1>
          <p className="text-gray-600">
            Want to know more.{" "}
            <a
              href="#"
              className="text-red-500 hover:text-red-600 font-semibold transition-colors"
            >
              Check here
            </a>
          </p>
        </section>

        {/* 4. Layout Selection Grid */}
        {/* Advanced Grid with Offset: First row shows 3, Second row shows 1 offset */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-x-12 md:gap-y-16">
          {kitchenLayouts.slice(0, 3).map((layout) => (
            <div
              key={layout.id}
              onClick={() => handleSelect(layout.id)}
              className={`group relative flex flex-col items-center text-center p-8 border-2 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden
              ${selectedLayoutId === layout.id ? "border-red-500 bg-red-50 shadow-inner" : "border-gray-100 hover:border-red-200 hover:shadow-xl"}`}
            >
              {/* Selective indicator (Top-right for clean advanced look) */}
              <div
                className={`absolute top-6 right-6 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300
              ${selectedLayoutId === layout.id ? "border-red-500 bg-red-500" : "border-gray-300 group-hover:border-red-300"}`}
              >
                {selectedLayoutId === layout.id && (
                  <span className="text-white text-lg">✓</span>
                )}
              </div>

              {/* Illustrative Floorplan Graphic */}
              <img
                src={layout.graphic}
                alt={`${layout.name} kitchen floorplan`}
                className="w-full h-auto max-w-[220px] mb-8 object-contain group-hover:scale-105 transition-transform duration-500"
              />

              <h3 className="text-xl font-semibold mb-2">{layout.name}</h3>
              <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors px-4">
                {layout.description}
              </p>
            </div>
          ))}

          {/* 5. Special Offset Row for the Single Item (Matching reference offset) */}
          <div className="md:col-start-2 md:col-end-3 flex justify-center mt-10 md:mt-0">
            {kitchenLayouts.slice(3).map((layout) => (
              <div
                key={layout.id}
                onClick={() => handleSelect(layout.id)}
                className={`group relative flex flex-col items-center text-center p-8 border-2 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden max-w-sm
                  ${selectedLayoutId === layout.id ? "border-red-500 bg-red-50 shadow-inner" : "border-gray-100 hover:border-red-200 hover:shadow-xl"}`}
              >
                <div
                  className={`absolute top-6 right-6 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300
                  ${selectedLayoutId === layout.id ? "border-red-500 bg-red-500" : "border-gray-300 group-hover:border-red-300"}`}
                >
                  {selectedLayoutId === layout.id && (
                    <span className="text-white text-lg">✓</span>
                  )}
                </div>

                <img
                  src={layout.graphic}
                  alt={`${layout.name} kitchen floorplan`}
                  className="w-full h-auto max-w-[220px] mb-8 object-contain group-hover:scale-105 transition-transform duration-500"
                />

                <h3 className="text-xl font-semibold mb-2">{layout.name}</h3>
                <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors px-4">
                  {layout.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Footer Navigation Buttons (Enhanced from reference) */}
        <footer className="w-full flex items-center justify-between mt-24 pt-10 border-t border-gray-100">
          <button className="px-8 py-3 text-sm md:text-base text-gray-600 hover:text-red-500 font-semibold border border-gray-200 hover:border-red-200 hover:bg-red-50 rounded-xl transition-all active:scale-[0.98]">
            ← BACK
          </button>
          <button className="px-12 py-3.5 text-sm md:text-base bg-red-500 text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 hover:bg-red-600 transition-all hover:scale-[1.02] active:scale-[0.98]">
            NEXT →
          </button>
        </footer>
      </div>
    </div>
  );
};

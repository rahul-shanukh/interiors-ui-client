// CalculatorLayout.tsx
import { Outlet } from "react-router-dom";

export const CalculatorLayout = () => {
  return (
    <div className="min-h-screen bg-[#fcfbf9]">
      {/* Premium Responsive Header */}
      <header className="border-b border-[#13503B]/5 bg-white transition-all duration-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="text-center sm:text-left">
              <h1 className="font-serif text-xl sm:text-2xl font-black tracking-tight text-[#13503B] flex flex-wrap items-center justify-center sm:justify-start gap-2">
                JC Interiors
                <span className="text-[#C5A059] font-sans text-xs sm:text-sm font-bold bg-[#C5A059]/10 px-2.5 py-0.5 rounded-full inline-block">
                  Calculator
                </span>
              </h1>
              <p className="text-[10px] sm:text-xs text-gray-400 font-bold tracking-wide uppercase mt-0.5">
                Precision estimation for your dream home
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Dynamic content */}
      <main className="py-2 sm:py-10">
        <Outlet />
      </main>
    </div>
  );
};

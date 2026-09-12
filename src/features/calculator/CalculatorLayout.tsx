// Frontend/interiors-ui-client/src/features/calculator/CalculatorLayout.tsx
import { Outlet, useNavigate } from "react-router-dom";

export const CalculatorLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fcfbf9]">
      <header className="border-b border-[#13503B]/5 bg-white transition-all duration-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Click handler using useNavigate */}
            <div
              role="button"
              tabIndex={0}
              style={{ cursor: "pointer" }}
              className="text-center sm:text-left block hover:opacity-90 transition-opacity"
              onClick={() => navigate("/#price-calculators")}
              onKeyDown={(e) =>
                e.key === "Enter" && navigate("/#price-calculators")
              }
            >
              <span className="font-serif text-xl sm:text-2xl font-black tracking-tight text-[#13503B] flex flex-wrap items-center justify-center sm:justify-start gap-2 ">
                JC Interiors
                <span className="text-[#C5A059] font-sans text-xs sm:text-sm font-bold bg-[#C5A059]/10 px-2.5 py-0.5 rounded-full inline-block">
                  Calculator
                </span>
              </span>
              <span className="text-[10px] sm:text-xs text-gray-400 font-bold tracking-wide uppercase mt-0.5 block">
                Precision estimation for your dream home
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="py-2 sm:py-10">
        <Outlet />
      </main>
    </div>
  );
};

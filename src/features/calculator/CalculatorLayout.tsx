// CalculatorLayout.tsx
import { Outlet } from "react-router-dom";

export const CalculatorLayout = () => {
  return (
    <div className="min-h-screen bg-[#fcfbf9]">
      {/* Common Header / Branding */}
      <div className="p-4 text-center font-bold">JC Interiors Calculator</div>

      {/* Dynamic content */}
      <Outlet />
    </div>
  );
};

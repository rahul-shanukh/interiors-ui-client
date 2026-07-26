// frontend\src\app\router\AppRouter.tsx

import { lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "../guards/ProtectedRoute";
import { CalculatorLayout } from "../../features/calculator/CalculatorLayout";
import { DesignIdeas } from "../../pages/SubHeaderList/DesignIdeas";
import StoreLocator from "../../pages/SubHeaderList/StoreLocator";

const HomePage = lazy(() =>
  import("../../pages/home/HomePage").then((m) => ({ default: m.HomePage })),
);

const LoginPage = lazy(() =>
  import("../../pages/auth/LoginPage").then((m) => ({ default: m.LoginPage })),
);

// ✅ ADD THIS — Boards page lazy import

const AboutUs = lazy(() =>
  import("../../pages/home/ui/About/AboutUs").then((m) => ({
    default: m.AboutUs,
  })),
);

const UploadsPage = lazy(() => import("../../pages/admin/board/UploadsPage"));

const FullHomeCalculator = lazy(() =>
  import("../../features/calculator/components/FullHomeCalculator").then(
    (m) => ({
      default: m.FullHomeCalculator,
    }),
  ),
);

const KitchenCalculator = lazy(() =>
  import("../../features/calculator/components/KitchenCalculator").then(
    (m) => ({
      default: m.KitchenCalculator,
    }),
  ),
);

const WardrobeCalculator = lazy(() =>
  import("../../features/calculator/components/WardrobeCalculator").then(
    (m) => ({
      default: m.WardrobeCalculator,
    }),
  ),
);

export const AppRouter = () => {
  return (
    <BrowserRouter>
      {/* <Suspense fallback={<PageLoader />}> */}
      <Routes>
        {/* ================= PUBLIC ZONE ================= */}
        <Route path="/" element={<HomePage />} />
        <Route path="/design-ideas" element={<DesignIdeas />} />
        <Route path="/store-locator" element={<StoreLocator />} />
        <Route path="/about-us" element={<AboutUs />} />

        <Route path="/calculator" element={<CalculatorLayout />}>
          <Route path="full-home" element={<FullHomeCalculator />} />
          <Route path="kitchen" element={<KitchenCalculator />} />
          <Route path="wardrobe" element={<WardrobeCalculator />} />
        </Route>
        <Route path="/admin/uploads" element={<UploadsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<div>Access Denied</div>} />

        {/* ================= PRIVATE ZONE ================= */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<div>My Profile</div>} />

          {/* ADMIN ONLY */}
          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/admin/register-employee" />
          </Route>

          {/* EMPLOYEE + ADMIN */}
          <Route
            element={<ProtectedRoute allowedRoles={["EMPLOYEE", "ADMIN"]} />}
          >
            <Route path="/workspace" element={<div>My Workspace</div>} />
          </Route>
        </Route>

        {/* ✅ Boards route (uses DashboardLayout, so it sits outside MainLayout) */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}></Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

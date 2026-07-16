// frontend\src\app\router\AppRouter.tsx

import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PageLoader } from "../../shared/ui/PageLoader";
import { ProtectedRoute } from "../guards/ProtectedRoute";
import { CalculatorLayout } from "../../features/calculator/CalculatorLayout";
import DashboardLayout from "../../shared/layouts/DashboardLayout";

const MainLayout = lazy(() =>
  import("../../shared/layouts/MainLayout").then((m) => ({
    default: m.MainLayout,
  })),
);

const HomePage = lazy(() =>
  import("../../pages/home/HomePage").then((m) => ({ default: m.HomePage })),
);

const LoginPage = lazy(() =>
  import("../../pages/auth/LoginPage").then((m) => ({ default: m.LoginPage })),
);

const AdminDashboard = lazy(() =>
  import("../../pages/admin/AdminDashboard").then((m) => ({
    default: m.AdminDashboard,
  })),
);

const DesignIdeas = lazy(() =>
  import("../../pages/SubHeaderList/DesignIdeas").then((m) => ({
    default: m.DesignIdeas,
  })),
);

// ✅ ADD THIS — Boards page lazy import
const BoardPage = lazy(() => import("../../pages/admin/BoardPage"));

const UploadsPage = lazy(() => import("../../pages/admin/board/UploadsPage"));

const CreateEmployeePage = lazy(
  () => import("../../pages/employee/CreateEmployeePage"),
);

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
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ================= PUBLIC ZONE ================= */}
          <Route path="/" element={<HomePage />} />
          <Route path="/design-ideas" element={<DesignIdeas />} />

          <Route path="/calculator" element={<CalculatorLayout />}>
            <Route path="full-home" element={<FullHomeCalculator />} />
            <Route path="kitchen" element={<KitchenCalculator />} />
            <Route path="wardrobe" element={<WardrobeCalculator />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<div>Access Denied</div>} />

          {/* ================= PRIVATE ZONE ================= */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/profile" element={<div>My Profile</div>} />

              {/* ADMIN ONLY */}
              <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route
                  path="/admin/register-employee"
                  element={<CreateEmployeePage />}
                />
              </Route>

              {/* EMPLOYEE + ADMIN */}
              <Route
                element={
                  <ProtectedRoute allowedRoles={["EMPLOYEE", "ADMIN"]} />
                }
              >
                <Route path="/workspace" element={<div>My Workspace</div>} />
              </Route>
            </Route>

            {/* ✅ Boards route (uses DashboardLayout, so it sits outside MainLayout) */}
            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/admin/boards" element={<BoardPage />} />
                <Route path="/admin/uploads" element={<UploadsPage />} />
              </Route>
            </Route>
          </Route>

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

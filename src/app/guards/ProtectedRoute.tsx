import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useCurrentUser } from "../../features/auth/session/useCurrentUser";
import { PageLoader } from "../../shared/ui/PageLoader";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useCurrentUser();
  const location = useLocation();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const normalizedRole = user?.role.toUpperCase() ?? "";
  const normalizedAllowedRoles = allowedRoles?.map((role) => role.toUpperCase());

  if (
    normalizedAllowedRoles &&
    !normalizedAllowedRoles.includes(normalizedRole)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

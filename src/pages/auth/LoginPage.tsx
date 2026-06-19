import { Navigate, useLocation } from "react-router-dom";
import { LoginForm } from "../../features/auth/login/LoginForm";
import { useCurrentUser } from "../../features/auth/session/useCurrentUser";
import { PageLoader } from "../../shared/ui/PageLoader";

export const LoginPage = () => {
  const { isAuthenticated, isLoading, user } = useCurrentUser();
  const location = useLocation();
  const state = location.state as { from?: { pathname?: string } } | null;

  if (isLoading) {
    return <PageLoader />;
  }

  if (isAuthenticated) {
    const destination =
      state?.from?.pathname && state.from.pathname !== "/admin"
        ? state.from.pathname
        : user?.role?.toUpperCase() === "ADMIN"
          ? "/admin/boards"
          : "/workspace";

    return <Navigate to={destination} replace />;
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-16">
      <LoginForm />
    </div>
  );
};

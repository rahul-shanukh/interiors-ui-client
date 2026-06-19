import { NavLink, Outlet } from "react-router-dom";
import { Button } from "../ui/Button";
import { PageLoader } from "../ui/PageLoader";
import { useCurrentUser } from "../../features/auth/session/useCurrentUser";
import { useLogout } from "../../features/auth/session/useLogout";

const linkClassName = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? "bg-slate-900 text-white"
      : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
  }`;

export const MainLayout = () => {
  const { user, isLoading } = useCurrentUser();
  const { mutate: logout, isPending } = useLogout();

  if (isLoading) {
    return <PageLoader />;
  }

  const isAdmin = user?.role.toUpperCase() === "ADMIN";

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold text-slate-900">JC Interiors</p>
            <p className="text-sm text-slate-500">
              Signed in as {user?.employeeId} ({user?.role})
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <nav className="flex flex-wrap gap-2">
              <NavLink to="/profile" className={linkClassName}>
                Profile
              </NavLink>
              <NavLink to="/workspace" className={linkClassName}>
                Workspace
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin" className={linkClassName}>
                  Admin
                </NavLink>
              )}
              {isAdmin && (
                <NavLink to="/admin/register-employee" className={linkClassName}>
                  Register Employee
                </NavLink>
              )}
            </nav>

            <Button
              type="button"
              size="sm"
              onClick={() => logout()}
              disabled={isPending}
            >
              {isPending ? "Signing out..." : "Logout"}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

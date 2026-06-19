import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ Added router hooks
import {
  LayoutDashboard,
  Trello,
  BarChart2,
  Mail,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react";
import { useLogout } from "../../features/auth/session/useLogout";

export default function Sidebar() {
  const { mutate: logout, isPending } = useLogout();
  const navigate = useNavigate();
  const location = useLocation();

  const NAV_ITEMS = [
    { icon: LayoutDashboard, label: "Dashboard", to: "/admin/boards" },
    { icon: Trello, label: "Uploads", to: "/admin/uploads" },
    { icon: BarChart2, label: "Boards" },
    { icon: Mail, label: "Messages" },
    { icon: Calendar, label: "Calendar" },
    { icon: Settings, label: "Settings" },
  ];

  const activeIndex = NAV_ITEMS.findIndex(
    (item) => item.to === location.pathname,
  );
  const [active, setActive] = useState(activeIndex !== -1 ? activeIndex : 0);

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className="shrink-0 w-16 h-screen bg-white border-r border-gray-100 flex flex-col items-center justify-between py-5">
      <div className="flex flex-col items-center gap-6 w-full">
        <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md">
          <Trello size={18} className="text-white" />
        </div>
        <nav className="flex flex-col items-center gap-1 w-full">
          {NAV_ITEMS.map((item, i) => {
            const Icon = item.icon;
            const isActive = active === i;
            return (
              <button
                key={i}
                onClick={() => {
                  setActive(i);
                  if (item.to) {
                    navigate(item.to);
                  }
                }}
                title={item.label}
                className={`relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-500 rounded-r-full" />
                )}
                <Icon size={18} />
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col items-center gap-3">
        <button
          title="Logout"
          onClick={handleLogout}
          disabled={isPending}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
        >
          <LogOut size={18} />
        </button>
        <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold shadow">
          A
        </div>
      </div>
    </aside>
  );
}

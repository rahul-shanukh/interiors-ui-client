import { Outlet } from "react-router-dom";
import Sidebar from "../../widgets/uploads-shell/Sidebar";
import Header from "../ui/Header";
// 1. Import your provider
import { BoardProvider } from "../../app/providers/BoardProvider";

export default function DashboardLayout() {
  return (
    // 2. Wrap the entire layout in the Provider
    <BoardProvider>
      <div className="flex flex-row h-screen w-screen overflow-hidden bg-slate-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </BoardProvider>
  );
}

import React, { useCallback } from "react";
import { Search, ChevronDown } from "lucide-react";
import { useBoardContext } from "../hooks/useBoardContext";
import { MOCK_ASSIGNEES } from "../constants/boardConstants";

const TEAM = MOCK_ASSIGNEES.slice(0, 3);

export default function Header() {
  const { dispatch, state } = useBoardContext();

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({ type: "SET_SEARCH", payload: e.target.value });
    },
    [dispatch],
  );

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-gray-800">Boards</h1>
        <button className="flex items-center gap-1.5 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors">
          Barone LLC.
          <ChevronDown size={14} className="text-gray-400" />
        </button>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search..."
            value={state.searchQuery}
            onChange={handleSearch}
            className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full w-52 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
          />
        </div>
        <div className="flex items-center">
          {TEAM.map((user, i) => (
            <div
              key={user.id}
              title={user.name}
              style={{
                backgroundColor: user.color,
                marginLeft: i > 0 ? "-8px" : "0",
                zIndex: TEAM.length - i,
              }}
              className="relative w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-sm cursor-pointer"
            >
              {user.name[0]}
            </div>
          ))}
          <div
            style={{ marginLeft: "-8px", zIndex: 0 }}
            className="relative w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold shadow-sm cursor-pointer hover:bg-gray-300 transition-colors"
          >
            +1
          </div>
        </div>
      </div>
    </header>
  );
}

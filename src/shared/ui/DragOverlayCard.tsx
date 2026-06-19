import { Calendar } from "lucide-react";
import type { KanbanCard } from "../types";

export default function DragOverlayCard({ card }: { card: KanbanCard }) {
  const formattedDate = new Date(card.dueDate).toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "2-digit",
  });

  return (
    <div className="bg-white rounded-xl shadow-2xl p-4 flex flex-col gap-3 w-72 rotate-2 opacity-95 pointer-events-none">
      {card.image && (
        <div className="w-full h-28 rounded-lg overflow-hidden">
          <img
            src={card.image}
            alt={card.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <h3 className="text-sm font-semibold text-gray-800">{card.title}</h3>
      <p className="text-xs text-gray-500 line-clamp-2">{card.description}</p>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs text-gray-400">
          <Calendar size={12} /> {formattedDate}
        </span>
        <div className="flex items-center">
          {card.assignees.slice(0, 3).map((user, i) => (
            <div
              key={user.id}
              style={{
                backgroundColor: user.color,
                marginLeft: i > 0 ? "-6px" : "0",
              }}
              className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white text-[9px] font-bold"
            >
              {user.name[0]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

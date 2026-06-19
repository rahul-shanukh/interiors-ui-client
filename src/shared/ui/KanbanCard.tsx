import { useState, useCallback, memo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, MoreVertical, Trash2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { KanbanCard as KanbanCardType, ColumnStatus } from "../types";
import { useBoardContext } from "../hooks/useBoardContext";
import { COLUMNS } from "../constants/boardConstants";

interface KanbanCardProps {
  card: KanbanCardType;
}

function KanbanCard({ card }: KanbanCardProps) {
  const { dispatch } = useBoardContext();
  const [menuOpen, setMenuOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const handleDelete = useCallback(() => {
    dispatch({ type: "DELETE_CARD", payload: card.id });
    setMenuOpen(false);
  }, [dispatch, card.id]);

  const handleMove = useCallback(
    (toColumnId: ColumnStatus) => {
      dispatch({ type: "MOVE_CARD", payload: { cardId: card.id, toColumnId } });
      setMenuOpen(false);
    },
    [dispatch, card.id],
  );

  const formattedDate = new Date(card.dueDate).toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "2-digit",
  });

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      {...attributes}
      {...listeners}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-4 flex flex-col gap-3 cursor-grab active:cursor-grabbing relative group select-none"
    >
      {card.image && (
        <div className="w-full h-28 rounded-lg overflow-hidden">
          <img
            src={card.image}
            alt={card.title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-gray-800 leading-snug">
          {card.title}
        </h3>
        <div className="relative shrink-0">
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
            }}
            className="w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all"
          >
            <MoreVertical size={14} />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -4 }}
                transition={{ duration: 0.15 }}
                onPointerDown={(e) => e.stopPropagation()}
                className="absolute right-0 top-7 z-50 bg-white border border-gray-100 rounded-xl shadow-lg py-1 w-44"
              >
                {COLUMNS.filter((col) => col.id !== card.columnId).map(
                  (col) => (
                    <button
                      key={col.id}
                      onClick={() => handleMove(col.id)}
                      className="w-full text-left px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                      <ArrowRight size={12} /> Move to {col.title}
                    </button>
                  ),
                )}
                <div className="border-t border-gray-100 my-1" />
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
        {card.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs text-gray-400">
          <Calendar size={12} /> {formattedDate}
        </span>
        <div className="flex items-center">
          {card.assignees.slice(0, 3).map((user, i) => (
            <div
              key={user.id}
              title={user.name}
              style={{
                backgroundColor: user.color,
                marginLeft: i > 0 ? "-6px" : "0",
                zIndex: card.assignees.length - i,
              }}
              className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white text-[9px] font-bold"
            >
              {user.name[0]}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default memo(KanbanCard);

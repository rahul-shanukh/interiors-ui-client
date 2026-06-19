import { useState, useCallback, memo } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import type { KanbanColumn as KanbanColumnType, KanbanCard } from "../types";
import KanbanCardComponent from "./KanbanCard";
import AddCardForm from "../../features/board/create/AddCardForm";

interface KanbanColumnProps {
  column: KanbanColumnType;
  cards: KanbanCard[];
}

function KanbanColumn({ column, cards }: KanbanColumnProps) {
  const [addingCard, setAddingCard] = useState(false);
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const handleCloseForm = useCallback(() => setAddingCard(false), []);
  const handleOpenForm = useCallback(() => setAddingCard(true), []);

  return (
    <div className="w-72 shrink-0 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: column.dotColor }}
          />
          <span className="text-sm font-semibold text-gray-700">
            {column.title}
          </span>
          <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5 font-medium">
            {cards.length}
          </span>
        </div>
        <button
          onClick={handleOpenForm}
          className="w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
        >
          <Plus size={16} />
        </button>
      </div>
      <div
        ref={setNodeRef}
        className={`flex flex-col gap-3 min-h-24 rounded-xl transition-colors duration-200 ${
          isOver ? "bg-blue-50/60 ring-2 ring-blue-200 ring-dashed p-1" : ""
        }`}
      >
        <SortableContext
          items={cards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <AnimatePresence>
            {cards.map((card) => (
              <KanbanCardComponent key={card.id} card={card} />
            ))}
          </AnimatePresence>
        </SortableContext>
        {cards.length === 0 && !isOver && (
          <div className="flex items-center justify-center h-20 border-2 border-dashed border-gray-200 rounded-xl">
            <span className="text-xs text-gray-400">Drop cards here</span>
          </div>
        )}
      </div>
      {addingCard && (
        <AddCardForm columnId={column.id} onClose={handleCloseForm} />
      )}
    </div>
  );
}

export default memo(KanbanColumn);

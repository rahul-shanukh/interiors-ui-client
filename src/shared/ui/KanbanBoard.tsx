import {
  DndContext,
  closestCorners,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useBoardContext } from "../hooks/useBoardContext";
import { useCardSearch } from "../../features/board/search/useCardSearch";
import { useDragAndDrop } from "../../features/board/dnd/useDragAndDrop";
import KanbanColumn from "./KanbanColumn";
import DragOverlayCard from "./DragOverlayCard";

export default function KanbanBoard() {
  const { state } = useBoardContext();
  const { handleDragStart, handleDragOver, handleDragEnd, activeCard } =
    useDragAndDrop();
  const getCardsByColumn = useCardSearch(state.cards, state.searchQuery);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-row gap-6 p-6 overflow-x-auto flex-1 items-start">
        {state.columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            cards={getCardsByColumn(column.id)}
          />
        ))}
      </div>
      <DragOverlay>
        {activeCard ? <DragOverlayCard card={activeCard} /> : null}
      </DragOverlay>
    </DndContext>
  );
}

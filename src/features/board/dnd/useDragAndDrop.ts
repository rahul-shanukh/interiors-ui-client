import { useCallback } from "react";
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useBoardContext } from "../../../shared/hooks/useBoardContext";
import type { ColumnStatus } from "../../../shared/types";

export function useDragAndDrop() {
  const { state, dispatch } = useBoardContext();

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      dispatch({ type: "SET_ACTIVE_CARD", payload: event.active.id as string });
    },
    [dispatch],
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;
      const activeCard = state.cards.find((c) => c.id === active.id);
      if (!activeCard) return;
      const isOverColumn = state.columns.some((col) => col.id === over.id);
      if (isOverColumn && activeCard.columnId !== over.id) {
        dispatch({
          type: "MOVE_CARD",
          payload: {
            cardId: activeCard.id,
            toColumnId: over.id as ColumnStatus,
          },
        });
        return;
      }
      const overCard = state.cards.find((c) => c.id === over.id);
      if (overCard && activeCard.columnId !== overCard.columnId) {
        dispatch({
          type: "MOVE_CARD",
          payload: { cardId: activeCard.id, toColumnId: overCard.columnId },
        });
      }
    },
    [state.cards, state.columns, dispatch],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      dispatch({ type: "SET_ACTIVE_CARD", payload: null });
      if (!over || active.id === over.id) return;
      const activeIdx = state.cards.findIndex((c) => c.id === active.id);
      const overIdx = state.cards.findIndex((c) => c.id === over.id);
      if (activeIdx !== -1 && overIdx !== -1) {
        const reordered = arrayMove(state.cards, activeIdx, overIdx);
        dispatch({ type: "REORDER_CARDS", payload: { cards: reordered } });
      }
    },
    [state.cards, dispatch],
  );

  const activeCard =
    state.cards.find((c) => c.id === state.activeCardId) ?? null;

  return { handleDragStart, handleDragOver, handleDragEnd, activeCard };
}

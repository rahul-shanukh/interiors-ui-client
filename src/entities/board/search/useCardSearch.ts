import { useMemo } from "react";
import type { KanbanCard, ColumnStatus } from "../../../shared/types";

export function useCardSearch(cards: KanbanCard[], query: string) {
  return useMemo(() => {
    const q = query.toLowerCase().trim();
    const filtered = q
      ? cards.filter(
          (c) =>
            c.title.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q),
        )
      : cards;
    return (columnId: ColumnStatus) =>
      filtered.filter((c) => c.columnId === columnId);
  }, [cards, query]);
}

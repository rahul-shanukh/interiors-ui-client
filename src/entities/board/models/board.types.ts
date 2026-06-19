// ColumnStatus defines the possible statuses for a column in the board
export type ColumnStatus =
  | "todo"
  | "in-progress"
  | "done"
  | "blocked"
  | "review"
  | "archived";

// CardAssignee represents a user assigned to a card,
// including their ID, name, avatar URL,
// and a color for UI representation.
export interface CardAssignee {
  id: string;
  name: string;
  avatarUrl: string;
  color: string;
}

// KanbanCard represents a task or item on the board
export interface KanbanCard {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  columnId: ColumnStatus;
  image?: string;
  assignees: CardAssignee[];
  createdAt: string;
}

// KanbanColumn represents a column on the board, such as "To Do", "In Progress", etc.
export interface KanbanColumn {
  id: ColumnStatus;
  title: string;
  color: string;
  dotColor: string;
}

// BoardState represents the overall state of the board, including its columns, cards, search query, and active card.
export interface BoardState {
  columns: KanbanColumn[];
  cards: KanbanCard[];
  searchQuery: string;
  activeCardId: string | null;
}

// BoardAction defines the possible actions that can be dispatched to update the board state,
// such as adding, deleting, updating, or moving cards,
// as well as setting the search query and active card.
export type BoardAction =
  | { type: "ADD_CARD"; payload: KanbanCard }
  | { type: "DELETE_CARD"; payload: string }
  | { type: "UPDATE_CARD"; payload: KanbanCard }
  | { type: "MOVE_CARD"; payload: { cardId: string; toColumnId: ColumnStatus } }
  | { type: "REORDER_CARDS"; payload: { cards: KanbanCard[] } }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_ACTIVE_CARD"; payload: string | null };

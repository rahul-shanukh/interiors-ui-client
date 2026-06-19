import type { ColumnStatus } from "../models/board.types";

// CreateCardDTO defines the structure for creating a new card on the board,
// including required fields like title, description, due date, and column ID,
// as well as optional fields for an image and assignee IDs.
export interface CreateCardDTO {
  title: string;
  description: string;
  dueDate: string;
  columnId: ColumnStatus;
  image?: string;
  assigneeIds?: string[];
}

// UpdateCardDTO defines the structure for updating an existing card on the board,
// allowing for optional updates to the title, description, due date, column ID, image, and assignee IDs.
export interface UpdateCardDTO {
  id: string;
  title?: string;
  description?: string;
  dueDate?: string;
  columnId?: ColumnStatus;
  image?: string;
  assigneeIds?: string[];
}

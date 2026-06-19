import { createContext } from "react";
import type { BoardAction, BoardState } from "../../shared/types";

export interface BoardContextValue {
  state: BoardState;
  dispatch: React.Dispatch<BoardAction>;
}

export const BoardContext = createContext<BoardContextValue | null>(null);

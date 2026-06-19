import { useReducer, type ReactNode } from "react";
import { COLUMNS, MOCK_CARDS } from "../../shared/constants/boardConstants";
import type { BoardAction, BoardState } from "../../shared/types";
import { BoardContext } from "./BoardContext";

// Initial state of the board, containing columns, cards, search query, and active card ID
const initialState: BoardState = {
  columns: COLUMNS,
  cards: MOCK_CARDS,
  searchQuery: "",
  activeCardId: null,
};

// Reducer function to manage board state based on dispatched actions
function boardReducer(state: BoardState, action: BoardAction): BoardState {
  // Handle different action types to update the state accordingly
  switch (action.type) {
    case "ADD_CARD":
      return { ...state, cards: [...state.cards, action.payload] };
    case "DELETE_CARD":
      return {
        ...state,
        cards: state.cards.filter((c) => c.id !== action.payload),
      };
    case "UPDATE_CARD":
      return {
        ...state,
        cards: state.cards.map((c) =>
          c.id === action.payload.id ? action.payload : c,
        ),
      };
    case "MOVE_CARD":
      return {
        ...state,
        cards: state.cards.map((c) =>
          c.id === action.payload.cardId
            ? { ...c, columnId: action.payload.toColumnId }
            : c,
        ),
      };
    case "REORDER_CARDS":
      return { ...state, cards: action.payload.cards };
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    case "SET_ACTIVE_CARD":
      return { ...state, activeCardId: action.payload };
    default:
      return state;
  }
}

// funtion component that provides the board context to its children
// It uses the useReducer hook to manage the board state and dispatch actions to update it
export function BoardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(boardReducer, initialState);
  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
}

import { useContext } from "react";
import { BoardContext } from "../../app/providers/BoardContext";

// Custom hook to access the board context
// This hook ensures that components using it are wrapped within a BoardProvider
// It abstracts away the context access logic and provides a cleaner API for components
export function useBoardContext() {
  const ctx = useContext(BoardContext);
  if (!ctx) {
    throw new Error("useBoardContext must be used within a BoardProvider");
  }
  return ctx;
}

import React, { useState, useCallback } from "react";
import { X, Check } from "lucide-react";
import type { ColumnStatus } from "../../../shared/types";
import { useBoardContext } from "../../../shared/hooks/useBoardContext";
import { MOCK_ASSIGNEES } from "../../../shared/constants/boardConstants";

interface AddCardFormProps {
  columnId: ColumnStatus;
  onClose: () => void;
}

export default function AddCardForm({ columnId, onClose }: AddCardFormProps) {
  const { dispatch } = useBoardContext();
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = useCallback(() => {
    if (!title.trim()) return;
    dispatch({
      type: "ADD_CARD",
      payload: {
        id: `card-${Date.now()}`,
        title: title.trim(),
        description: "Click to add a description.",
        dueDate: dueDate || new Date().toISOString().split("T")[0],
        columnId,
        assignees: [MOCK_ASSIGNEES[0]],
        createdAt: new Date().toISOString(),
      },
    });
    onClose();
  }, [title, dueDate, columnId, dispatch, onClose]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleSubmit();
      if (e.key === "Escape") onClose();
    },
    [handleSubmit, onClose],
  );

  return (
    <div className="bg-white rounded-xl shadow-md p-3 flex flex-col gap-2 border border-blue-100">
      <input
        autoFocus
        type="text"
        placeholder="Card title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        className="text-sm font-medium text-gray-800 placeholder-gray-400 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <div className="flex gap-2 justify-end">
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <X size={16} />
        </button>
        <button
          onClick={handleSubmit}
          disabled={!title.trim()}
          className="p-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors disabled:opacity-40"
        >
          <Check size={16} />
        </button>
      </div>
    </div>
  );
}

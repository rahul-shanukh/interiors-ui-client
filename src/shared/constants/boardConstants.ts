import type { CardAssignee, KanbanCard, KanbanColumn } from "../types";

// COLUMNS defines the default columns for the Kanban board, including their IDs, titles, background colors, and dot colors for UI representation.
export const COLUMNS: KanbanColumn[] = [
  { id: "todo", title: "To Do", color: "#FEE2E2", dotColor: "#EF4444" },
  {
    id: "in-progress",
    title: "In Progress",
    color: "#FEF3C7",
    dotColor: "#F97316",
  },
  {
    id: "review",
    title: "Under Review",
    color: "#DBEAFE",
    dotColor: "#3B82F6",
  },
  { id: "done", title: "Done", color: "#DCFCE7", dotColor: "#22C55E" },
];

// MOCK_ASSIGNEES provides a set of sample assignees for cards on the board, each with a unique ID, name, avatar URL (currently empty), and a color for UI representation.
export const MOCK_ASSIGNEES: CardAssignee[] = [
  { id: "u1", name: "Alice", avatarUrl: "", color: "#6366F1" },
  { id: "u2", name: "Bob", avatarUrl: "", color: "#EC4899" },
  { id: "u3", name: "Carol", avatarUrl: "", color: "#F59E0B" },
  { id: "u4", name: "Dan", avatarUrl: "", color: "#10B981" },
];

export const MOCK_CARDS: KanbanCard[] = [
  {
    id: "c1",
    title: "Make a new Post",
    description:
      "It is a new post you need to tell about our new action when buying one product, the second gift provided.",
    dueDate: "2024-10-31",
    columnId: "todo",
    image:
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80",
    assignees: [MOCK_ASSIGNEES[0], MOCK_ASSIGNEES[1]],
    createdAt: "2024-10-01",
  },
  {
    id: "c2",
    title: "Check design materials",
    description:
      "Please have a look at Barone LLC. marketing materials and use them in Dribbble.",
    dueDate: "2024-09-11",
    columnId: "in-progress",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    assignees: [MOCK_ASSIGNEES[2]],
    createdAt: "2024-09-01",
  },
  {
    id: "c3",
    title: "Make a website prototype",
    description:
      "Design of a landing page for the sale of cars; main section: a section with advantages, contact section.",
    dueDate: "2024-10-01",
    columnId: "in-progress",
    assignees: [MOCK_ASSIGNEES[0], MOCK_ASSIGNEES[3]],
    createdAt: "2024-09-15",
  },
  {
    id: "c4",
    title: "Discuss Year budget",
    description:
      "Determination of the general goals and objectives of the company. Determination of target values.",
    dueDate: "2024-08-19",
    columnId: "review",
    assignees: [MOCK_ASSIGNEES[1], MOCK_ASSIGNEES[2]],
    createdAt: "2024-08-01",
  },
  {
    id: "c5",
    title: "Content plan",
    description:
      "Create a content plan for the period August 2021 - October 2021. Instagram, Dribbble, Behance.",
    dueDate: "2024-10-20",
    columnId: "review",
    image:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&q=80",
    assignees: [MOCK_ASSIGNEES[0]],
    createdAt: "2024-08-05",
  },
  {
    id: "c6",
    title: "Weekly planning meeting",
    description:
      "Discussing the content plan, tasks for the next week and problems encountered.",
    dueDate: "2024-09-30",
    columnId: "done",
    assignees: [MOCK_ASSIGNEES[2], MOCK_ASSIGNEES[3]],
    createdAt: "2024-09-20",
  },
  {
    id: "c7",
    title: "Discuss a new concept",
    description:
      "Creation of a unified visual image of a trademark at the form of an original identity that expresses the essence.",
    dueDate: "2024-09-09",
    columnId: "done",
    assignees: [MOCK_ASSIGNEES[0], MOCK_ASSIGNEES[1], MOCK_ASSIGNEES[2]],
    createdAt: "2024-09-01",
  },
  {
    id: "c8",
    title: "Discuss Month budget",
    description:
      "Determination of the general goals and objectives of the company. Determination of target values.",
    dueDate: "2024-09-04",
    columnId: "done",
    assignees: [MOCK_ASSIGNEES[3]],
    createdAt: "2024-08-25",
  },
];

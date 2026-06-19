import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface CatalogState {
  // 1. Search & Filter State
  searchQuery: string;
  selectedCategory: string | null;
  priceRange: [number, number];

  // 2. Pagination State
  limit: number;
  offset: number;

  // 3. Actions (Mutations)
  setSearchQuery: (query: string) => void;
  setCategory: (categoryId: string | null) => void;
  setPriceRange: (range: [number, number]) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

export const useCatalogStore = create<CatalogState>()(
  devtools((set) => ({
    searchQuery: "",
    selectedCategory: null,
    priceRange: [0, 10000], // Adjust based on JC Interiors pricing
    limit: 12,
    offset: 0,

    setSearchQuery: (query) => set({ searchQuery: query, offset: 0 }),

    setCategory: (categoryId) =>
      set({ selectedCategory: categoryId, offset: 0 }),

    setPriceRange: (range) => set({ priceRange: range, offset: 0 }),

    setPage: (page) => set((state) => ({ offset: page * state.limit })),

    resetFilters: () =>
      set({
        searchQuery: "",
        selectedCategory: null,
        priceRange: [0, 10000],
        offset: 0,
      }),
  })),
);

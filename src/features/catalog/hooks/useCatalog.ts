import { useQuery } from "@tanstack/react-query";
import { useCatalogStore } from "../store/useCatalogStore";
import { useMemo, useCallback } from "react";
import { API_BASE_URL } from "../../../infrastructure/config/env";
import type { Product } from "../components/ProductCard";

interface CatalogQueryResponse {
  items: Product[];
}

const REST_URL = `${API_BASE_URL}/catalog`;

export const useCatalog = () => {
  const { limit, offset, searchQuery, selectedCategory } = useCatalogStore();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["catalog", limit, offset],
    queryFn: async () => {
      const response = await fetch(
        `${REST_URL}?limit=${limit}&offset=${offset}`,
      );

      if (!response.ok) {
        throw new Error("Failed to load catalog");
      }

      const payload = (await response.json()) as CatalogQueryResponse;
      return payload;
    },
  });

  const filteredProducts = useMemo(() => {
    if (!data?.items) return [];

    return data.items.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory
        ? product.category?.id === selectedCategory
        : true;
      return matchesSearch && matchesCategory;
    });
  }, [data, searchQuery, selectedCategory]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    products: filteredProducts,
    isLoading,
    error,
    handleRefresh,
  };
};

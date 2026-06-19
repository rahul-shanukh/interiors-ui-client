import { useQuery } from "@tanstack/react-query";
import { request, gql } from "graphql-request";
import { useCatalogStore } from "../store/useCatalogStore";
import { useMemo, useCallback } from "react";
import { API_BASE_URL } from "../../../infrastructure/config/env";
import type { Product } from "../components/ProductCard";

interface CatalogQueryResponse {
  getCatalog: Product[];
}

// 1. Define the GraphQL Query
const GET_CATALOG = gql`
  query GetCatalog($limit: Int, $offset: Int) {
    getCatalog(limit: $limit, offset: $offset) {
      id
      name
      slug
      price
      images {
        url
        alt
      }
      category {
        id
        name
      }
    }
  }
`;

const GRAPHQL_URL = API_BASE_URL.replace(/\/api\/v1\/?$/, "/graphql");

export const useCatalog = () => {
  // Grab state from Zustand
  const { limit, offset, searchQuery, selectedCategory } = useCatalogStore();

  // 2. Fetch Data with React Query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["catalog", limit, offset],
    queryFn: async () =>
      request<CatalogQueryResponse>(GRAPHQL_URL, GET_CATALOG, {
        limit,
        offset,
      }),
  });

  // 3. Performance Optimization: Client-side Filtering
  // We use useMemo so this only runs when 'data' or 'searchQuery' changes
  const filteredProducts = useMemo(() => {
    if (!data?.getCatalog) return [];

    return data.getCatalog.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory
        ? product.category?.id === selectedCategory
        : true;
      return matchesSearch && matchesCategory;
    });
  }, [data, searchQuery, selectedCategory]);

  // 4. Optimized Refresh Callback
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

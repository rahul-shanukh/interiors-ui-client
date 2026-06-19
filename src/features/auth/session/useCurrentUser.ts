import { useQuery } from "@tanstack/react-query";
import type { ApiError } from "../../../infrastructure/http/api-client";
import type { AuthUser } from "../login/types";
import { getCurrentUser } from "./api";

export const AUTH_QUERY_KEY = ["auth", "me"] as const;

export const useCurrentUser = () => {
  const query = useQuery<AuthUser | null>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      try {
        const response = await getCurrentUser();
        return response.user;
      } catch (error) {
        const status = (error as ApiError).status;

        if (status === 401 || status === 403) {
          return null;
        }

        throw error;
      }
    },
    retry: false,
  });

  return {
    ...query,
    user: query.data ?? null,
    isAuthenticated: !!query.data,
  };
};

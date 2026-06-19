import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "./api";
import type { LoginDTO } from "./types";
import { AUTH_QUERY_KEY } from "../session/useCurrentUser";

// Helper function to determine the default route based on user role
const getDefaultRoute = (role: string) =>
  role.toUpperCase() === "ADMIN" ? "/admin" : "/workspace";

// Custom hook to handle user login, utilizing React Query for mutation and React Router for navigation
export const useLogin = () => {
  const queryClient = useQueryClient(); // Access the query client to manage cached data
  const navigate = useNavigate(); // Hook to programmatically navigate after successful login
  const location = useLocation(); // Access the current location to determine where to redirect after login
  const state = location.state as { from?: { pathname?: string } } | null;

  return useMutation({
    mutationFn: (data: LoginDTO) => loginUser(data),
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, data.user);

      const destination =
        state?.from?.pathname || getDefaultRoute(data.user.role);
      navigate(destination, { replace: true });
    },
    onError: (error) => {
      console.error("Login Failed", error);
    },
  });
};

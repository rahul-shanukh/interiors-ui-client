// frontend/src/features/auth/session/useLogout.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "./api";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutUser,
    onSettled: () => {
      // nuke the entire cache (auth state , boards, etc) to ensure we don't have any stale data after logout
      queryClient.clear();

      // Redirect to login and replace history to prevent going back to protected pages after logout
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      console.error("Logout Failed", error);
    },
  });
};

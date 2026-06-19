import apiClient from "../../../infrastructure/http/api-client";
import type { AuthResponse } from "./types";
import type { LoginDTO } from "./types";

export const loginUser = async (data: LoginDTO): Promise<AuthResponse> => {
  return apiClient.post<AuthResponse>("/auth/login", data);
};

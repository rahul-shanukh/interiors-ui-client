import apiClient from "../../../infrastructure/http/api-client";
import type { AuthUser } from "../login/types";

export interface CurrentUserResponse {
  user: AuthUser;
}

export interface LogoutResponse {
  message: string;
}

export const getCurrentUser = async (): Promise<CurrentUserResponse> => {
  return apiClient.get<CurrentUserResponse>("/auth/me");
};

export const logoutUser = async (): Promise<LogoutResponse> => {
  return apiClient.post<LogoutResponse>("/auth/logout");
};

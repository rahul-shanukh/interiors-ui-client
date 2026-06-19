import { openApiClient } from "./client";
import type { components } from "./schema";

type ApiResult<T> = {
  data?: T;
  error?: unknown;
  response: Response;
};

const unwrap = <T>({ data, error, response }: ApiResult<T>): T => {
  if (error || !response.ok) {
    const message =
      error &&
      typeof error === "object" &&
      "message" in error &&
      typeof error.message === "string"
        ? error.message
        : `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data as T;
};

export type LoginRequest = components["schemas"]["LoginDto"];
export type AuthResponse = components["schemas"]["AuthResponseDto"];
export type CurrentUserResponse = components["schemas"]["CurrentUserResponseDto"];
export type ActivateUserRequest = components["schemas"]["ActivateUserDto"];
export type ActivateUserResponse =
  components["schemas"]["ActivateUserResponseDto"];
export type CreateEmployeeRequest = components["schemas"]["CreateEmployeeDto"];
export type MessageResponse = components["schemas"]["MessageResponseDto"];
export type CreateQuoteRequest = components["schemas"]["CreateQuoteDto"];
export type CreateQuoteResponse = components["schemas"]["CreateQuoteResponseDto"];
export type GenerateUrlRequest = components["schemas"]["GenerateUrlDto"];
export type PresignedUrlResponse =
  components["schemas"]["PresignedUrlResponseDto"];
export type ConfirmUploadRequest = components["schemas"]["ConfirmUploadDto"];
export type ConfirmUploadResponse =
  components["schemas"]["ConfirmUploadResponseDto"];

export const api = {
  login: async (body: LoginRequest) => {
    return unwrap(
      await openApiClient.POST("/api/v1/auth/login", {
        body,
      }),
    );
  },

  getCurrentUser: async () => {
    return unwrap(await openApiClient.GET("/api/v1/auth/me"));
  },

  logout: async () => {
    return unwrap(await openApiClient.POST("/api/v1/auth/logout", {}));
  },

  activateUser: async (body: ActivateUserRequest) => {
    return unwrap(
      await openApiClient.POST("/api/v1/user/activate", {
        body,
      }),
    );
  },

  deleteUser: async (employeeId: string) => {
    return unwrap(
      await openApiClient.DELETE("/api/v1/user/{employeeId}", {
        params: {
          path: {
            employeeId,
          },
        },
      }),
    );
  },

  createEmployee: async (body: CreateEmployeeRequest) => {
    return unwrap(
      await openApiClient.POST("/api/v1/employees", {
        body,
      }),
    );
  },

  requestQuote: async (body: CreateQuoteRequest) => {
    return unwrap(
      await openApiClient.POST("/api/v1/quotes/request", {
        body,
      }),
    );
  },

  createPresignedUrls: async (body: GenerateUrlRequest) => {
    return unwrap(
      await openApiClient.POST("/api/v1/uploads/presigned-url", {
        body,
      }),
    );
  },

  confirmUpload: async (body: ConfirmUploadRequest) => {
    return unwrap(
      await openApiClient.POST("/api/v1/uploads/confirm", {
        body,
      }),
    );
  },
};

// Frontend/interiors-ui-client/src/infrastructure/openapi/api.ts
import type { components } from "./schema";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

type ApiResult<T> = {
  data?: T;
  error?: unknown;
  response: Response;
};

export const unwrap = <T>({ data, error, response }: ApiResult<T>): T => {
  if (error || !response.ok) {
    const message =
      error &&
      typeof error === "object" &&
      "message" in error &&
      typeof (error as Record<string, unknown>).message === "string"
        ? String((error as Record<string, unknown>).message)
        : `Request failed with status ${response.status}`;

    // FIX: Throw ApiError instead of Error so hooks can read the status
    throw new ApiError(response.status, message);
  }

  return data as T;
};

// export type LoginRequest = components["schemas"]["LoginDto"];
// export type AuthResponse = components["schemas"]["AuthResponseDto"];
// export type CurrentUserResponse =
// components["schemas"]["CurrentUserResponseDto"];
// export type ActivateUserRequest = components["schemas"]["ActivateUserDto"];
// export type ActivateUserResponse =
// components["schemas"]["ActivateUserResponseDto"];
// export type CreateEmployeeRequest = components["schemas"]["CreateEmployeeDto"];
// export type MessageResponse = components["schemas"]["MessageResponseDto"];
export type CreateQuoteRequest =
  | components["schemas"]["CreateFullHomeQuoteDto"]
  | components["schemas"]["CreateKitchenQuoteDto"]
  | components["schemas"]["CreateWardrobeQuoteDto"];
export type CreateQuoteResponse =
  components["schemas"]["CreateQuoteResponseDto"];
export type GenerateUrlRequest = components["schemas"]["GenerateUrlDto"];
export type PresignedUrlResponse =
  components["schemas"]["PresignedUrlResponseDto"];
export type ConfirmUploadRequest = components["schemas"]["ConfirmUploadDto"];
export type ConfirmUploadResponse =
  components["schemas"]["ConfirmUploadResponseDto"];

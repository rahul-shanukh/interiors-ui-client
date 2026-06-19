import { API_BASE_URL } from "../config/env";

export type ApiError = Error & {
  status?: number;
  details?: unknown;
};

type QueryValue = string | number | boolean | null | undefined;

export type ApiRequestOptions = Omit<RequestInit, "body" | "method"> & {
  query?: Record<string, QueryValue>;
  timeoutMs?: number;
};

const DEFAULT_TIMEOUT_MS = 10000;

const getErrorMessage = (message: unknown) => {
  if (typeof message === "string") {
    return message;
  }

  if (Array.isArray(message)) {
    return message.join(", ");
  }

  return "Something went wrong";
};

const buildUrl = (path: string, query?: Record<string, QueryValue>) => {
  const url = new URL(
    path.startsWith("http") ? path : `${API_BASE_URL}${path}`,
  );

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
};

const parseResponse = async (response: Response) => {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
};

const createApiError = (
  message: string,
  status?: number,
  details?: unknown,
): ApiError => {
  const error = new Error(message) as ApiError;
  error.status = status;
  error.details = details;
  return error;
};

async function request<TResponse>(
  method: string,
  path: string,
  body?: unknown,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  const { query, timeoutMs = DEFAULT_TIMEOUT_MS, headers, signal, ...init } =
    options;

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  if (signal) {
    signal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  try {
    const response = await fetch(buildUrl(path, query), {
      ...init,
      method,
      credentials: "include",
      headers: {
        Accept: "application/json",
        ...(body instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
        ...headers,
      },
      body:
        body === undefined
          ? undefined
          : body instanceof FormData
            ? body
            : JSON.stringify(body),
      signal: controller.signal,
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      throw createApiError(
        getErrorMessage((data as { message?: unknown } | null)?.message),
        response.status,
        data,
      );
    }

    return data as TResponse;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw createApiError("Request timed out", 408);
    }

    if ((error as ApiError).status) {
      throw error;
    }

    throw createApiError(
      error instanceof Error ? error.message : "Network request failed",
    );
  } finally {
    window.clearTimeout(timeoutId);
  }
}

const apiClient = {
  get: <TResponse>(path: string, options?: ApiRequestOptions) =>
    request<TResponse>("GET", path, undefined, options),
  post: <TResponse>(
    path: string,
    body?: unknown,
    options?: ApiRequestOptions,
  ) => request<TResponse>("POST", path, body, options),
  put: <TResponse>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    request<TResponse>("PUT", path, body, options),
  patch: <TResponse>(
    path: string,
    body?: unknown,
    options?: ApiRequestOptions,
  ) => request<TResponse>("PATCH", path, body, options),
  delete: <TResponse>(path: string, options?: ApiRequestOptions) =>
    request<TResponse>("DELETE", path, undefined, options),
};

export default apiClient;

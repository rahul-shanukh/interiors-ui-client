// src/entities/quote/hooks/useQuoteMutation.ts
import { useMutation } from "@tanstack/react-query";
import {
  unwrap,
  type CreateQuoteRequest,
  type CreateQuoteResponse,
} from "../../../infrastructure/openapi/api";
import { openApiClient } from "../../../infrastructure/openapi/client";

type QuoteSubmission = {
  data: CreateQuoteRequest;
  idempotencyKey: string;
};

const sendQuoteRequest = async ({
  data,
  idempotencyKey,
}: QuoteSubmission): Promise<CreateQuoteResponse> => {
  const result = await openApiClient.POST("/quotes/request", {
    body: data,
    headers: {
      "Idempotency-Key": idempotencyKey,
    },
  });

  return unwrap(result);
};

const getStatusCode = (error: unknown): number | undefined => {
  if (typeof error !== "object" || error === null) return undefined;

  const candidate = error as {
    status?: unknown;
    response?: { status?: unknown } | null;
  };

  if (typeof candidate.status === "number") {
    return candidate.status;
  }

  if (candidate.response && typeof candidate.response === "object") {
    if (typeof candidate.response.status === "number") {
      return candidate.response.status;
    }
  }

  return undefined;
};

export const useQuote = () => {
  const mutation = useMutation({
    // TanStack reuses these variables, including the key, on automatic retries.
    mutationFn: sendQuoteRequest,
    retry: (failureCount, error) => {
      const statusCode = getStatusCode(error);

      // Validation, rate-limit, and conflict responses need caller action.
      if (statusCode && statusCode >= 400 && statusCode < 500) {
        return false;
      }

      // The quote may already be saved: backend key enforcement is still required.
      if (statusCode === 502 || statusCode === 503) {
        return failureCount < 2; // At most two automatic retries.
      }

      // Keep other failures, including network errors and cancellation, non-retryable.
      return false;
    },
    // Back off between retries.
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    onSuccess: (response) => {
      console.log("Backend calculated cost:", response.estimatedPrice);
    },
    onError: (error) => {
      console.error("Failed to generate quote", error);
    },
  });

  // Each caller submission gets one key; a new manual call gets a new key.
  return {
    ...mutation,
    mutate: (data: CreateQuoteRequest) =>
      mutation.mutate({ data, idempotencyKey: crypto.randomUUID() }),
    mutateAsync: (data: CreateQuoteRequest) =>
      mutation.mutateAsync({ data, idempotencyKey: crypto.randomUUID() }),
  };
};

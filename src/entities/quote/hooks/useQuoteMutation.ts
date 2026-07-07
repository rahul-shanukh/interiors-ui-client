// src/entities/quote/hooks/useQuoteMutation.ts
import { useMutation } from "@tanstack/react-query";
import httpClient from "../../../infrastructure/http/api-client";
import type { QuoteRequest, QuoteResponse } from "../model/quote.types";

const sendQuoteRequest = async (data: QuoteRequest): Promise<QuoteResponse> => {
  return httpClient.post<QuoteResponse>("/quotes/request", data);
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
  return useMutation({
    mutationFn: sendQuoteRequest,
    retry: (failureCount, error) => {
      const statusCode = getStatusCode(error);

      if (statusCode && [400, 401, 403, 422].includes(statusCode)) {
        return false;
      }

      if (statusCode && statusCode >= 500) {
        return failureCount < 3;
      }

      if (statusCode === 429) {
        return failureCount < 3;
      }

      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onSuccess: (response) => {
      console.log("Backend calculated cost:", response.estimatedPrice);
    },
    onError: (error) => {
      console.error("Failed to generate quote", error);
    },
  });
};

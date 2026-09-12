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

      // 1. NEVER retry 4xx errors (including 429 Rate Limit and 409 Conflict)
      if (statusCode && statusCode >= 400 && statusCode < 500) {
        return false;
      }

      // 2. ONLY retry safe infrastructure errors: 502 (Bad Gateway) or 503 (Service Unavailable)
      // These mean the request was blocked by Cloudflare/Load Balancer and never reached your DB.
      if (statusCode === 502 || statusCode === 503) {
        return failureCount < 2; // Max 2 retries for infrastructure hiccups
      }

      // 3. DO NOT retry network timeouts (undefined status) or 500s.
      // The server might have successfully created the quote before the connection dropped.
      return false;
    },
    // Shorter max backoff so the user isn't staring at a spinner for 30+ seconds
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    onSuccess: (response) => {
      console.log("Backend calculated cost:", response.estimatedPrice);
    },
    onError: (error) => {
      console.error("Failed to generate quote", error);
    },
  });
};

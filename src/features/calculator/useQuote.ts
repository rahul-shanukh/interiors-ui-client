// frontend/src/features/calculator/useQuote.ts
import { useMutation } from "@tanstack/react-query";
import httpClient from "../../infrastructure/http/api-client";
import type { QuoteRequest, QuoteResponse } from "./types";

const sendQuoteRequest = async (data: QuoteRequest): Promise<QuoteResponse> => {
  return httpClient.post<QuoteResponse>("/quotes/request", data);
};

export const useQuote = () => {
  return useMutation({
    mutationFn: sendQuoteRequest,
    onSuccess: (response) => {
      console.log("Backend calculated cost:", response.estimatedPrice);
    },
    onError: (error) => {
      console.error("Failed to generate quote", error);
    },
  });
};

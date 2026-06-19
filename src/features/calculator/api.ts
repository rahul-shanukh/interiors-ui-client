// features/calculator/api.ts
import httpClient from "../../infrastructure/http/api-client";
import type { QuoteRequest, QuoteResponse } from "./types";

export const sendQuoteRequest = async (
  data: QuoteRequest,
): Promise<QuoteResponse> => {
  return httpClient.post<QuoteResponse>("/quotes/request", data);
};

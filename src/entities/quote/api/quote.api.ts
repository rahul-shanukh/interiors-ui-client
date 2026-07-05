// src/entities/quote/api/quote.api.ts
import httpClient from "../../../infrastructure/http/api-client";
import type { QuoteRequest, QuoteResponse } from "../model/quote.types";

export const sendQuoteRequest = async (
  data: QuoteRequest,
): Promise<QuoteResponse> => {
  return httpClient.post<QuoteResponse>("/quotes/request", data);
};

// Frontend/interiors-ui-client/src/infrastructure/openapi/client.ts
import createClient from "openapi-fetch";
import { API_BASE_URL } from "../config/env";
import type { paths } from "./schema";
import { getTraceSamplingRate } from "../firebase/remote-config";

export const openApiClient = createClient<paths>({
  baseUrl: API_BASE_URL,
  credentials: "include",
  headers: {
    Accept: "application/json",
  },
});

// Middleware to replace legacy features AND add distributed tracing
openApiClient.use({
  onRequest({ request }) {
    // 1. DISTRIBUTED TRACING: Generate W3C traceparent header
    const traceId = crypto.randomUUID().replace(/-/g, "");
    const spanId = crypto.randomUUID().replace(/-/g, "").substring(0, 16);

    // 10% Sampling Rate at the Edge
    // "01" = Sampled (keep trace), "00" = Unsampled (drop trace)
    const currentSamplingRate = getTraceSamplingRate();
    const traceFlags = Math.random() < currentSamplingRate ? "01" : "00";

    request.headers.set("traceparent", `00-${traceId}-${spanId}-${traceFlags}`);

    // 2. LEGACY COMPATIBILITY: Recreate the 10-second timeout
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 10000);

    return new Request(request, { signal: controller.signal });
  },
});

export type OpenApiClient = typeof openApiClient;

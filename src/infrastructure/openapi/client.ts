import createClient from "openapi-fetch";
import { API_BASE_URL } from "../config/env";
import type { paths } from "./schema";

export const openApiClient = createClient<paths>({
  baseUrl: API_BASE_URL,
  credentials: "include",
  headers: {
    Accept: "application/json",
  },
});

export type OpenApiClient = typeof openApiClient;

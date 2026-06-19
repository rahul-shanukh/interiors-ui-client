// src/entities/upload/api/index.ts

import apiClient from "../../../infrastructure/http/api-client";
import type { UploadCategory } from "../model/upload.types";

export interface PresignedUrlPayload {
  fileName: string;
  mimeType: string;
  fileSize: number;
  category: UploadCategory;
  provider: "r2" | "gcs"; // 👈 Matches your backend DTO exactly!
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  publicUrl: string;
  fileKey: string;
}

// 1. Get the ticket from NestJS
export const fetchPresignedUrl = async (
  payload: PresignedUrlPayload,
): Promise<PresignedUrlResponse> => {
  return apiClient.post<PresignedUrlResponse>(
    "/uploads/presigned-url",
    payload,
  );
};

// 2. PUT the file directly to Cloudflare/GCP
export const uploadToCloudStorage = async (
  uploadUrl: string,
  file: File,
  mimeType: string,
): Promise<void> => {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": mimeType,
    },
  });

  if (!response.ok) {
    throw new Error("Cloud storage upload failed");
  }
};

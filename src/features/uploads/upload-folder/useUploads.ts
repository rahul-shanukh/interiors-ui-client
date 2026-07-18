// src/features/uploads/upload-folder/useUploads.ts
import { useMutation } from "@tanstack/react-query";
import { API_BASE_URL } from "../../../infrastructure/config/env";
import type { UploadCategory } from "../../../entities/upload/model/upload.types";

interface UploadPayload {
  file: File;
  category: UploadCategory;
  provider: "r2" | "gcs";
}

interface PresignedUpload {
  uploadUrl: string;
  publicUrl: string;
  fileKey: string;
}

interface ConfirmUploadResponse {
  fileKey: string;
  publicUrl: string;
  status: "confirmed";
}

async function uploadToCloud({ file, category, provider }: UploadPayload) {
  const presignedRes = await fetch(`${API_BASE_URL}/uploads/presigned-url`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      provider,
      files: [
        {
          fileName: file.name,
          mimeType: file.type,
          fileSize: file.size,
          category,
        },
      ],
    }),
  });

  if (!presignedRes.ok) {
    const err = await presignedRes.json().catch(() => null);
    throw new Error(
      `Failed to get presigned URL: ${presignedRes.status} ${presignedRes.statusText} ${err?.message || ""}`,
    );
  }

  const uploads = (await presignedRes.json()) as PresignedUpload[];
  const upload = uploads[0];

  if (!upload) {
    throw new Error("Backend did not return a presigned upload URL");
  }

  const uploadRes = await fetch(upload.uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!uploadRes.ok) {
    throw new Error(`Failed to directly upload file: ${uploadRes.status}`);
  }

  const confirmRes = await fetch(`${API_BASE_URL}/uploads/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ fileKey: upload.fileKey }),
  });

  if (!confirmRes.ok) {
    throw new Error(`Failed to confirm upload: ${confirmRes.status}`);
  }

  return (await confirmRes.json()) as ConfirmUploadResponse;
}

export function useUploads() {
  return useMutation({ mutationFn: uploadToCloud });
}

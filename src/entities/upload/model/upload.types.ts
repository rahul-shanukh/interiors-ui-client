// src/entities/upload/model/upload.types.ts

// UPLOAD PROJECT TYPES PERSONAL AND PUBLIC

// 1. The Constants (Source of Truth for your UI loops)
export const UPLOAD_CATEGORIES = [
  { key: "kitchen", label: "Kitchen" },
  { key: "bedroom", label: "Bedroom" },
  { key: "living-room", label: "Living Room" },
  { key: "bathroom", label: "Bathroom" },
  { key: "office", label: "Office" },
  { key: "projects", label: "Projects" },
  { key: "documents", label: "Documents" },
  { key: "other", label: "Other" },
] as const;

// 2. The Derived Types (TypeScript magic!)
export type UploadCategory = (typeof UPLOAD_CATEGORIES)[number]["key"];
export type UploadStatus = "uploading" | "ready" | "failed";
export type UploadKind = "image" | "file" | "video" | "pdf";

export type UploadFlowStep =
  "SELECT" | "UPLOADING" | "CONFIGURING" | "COMPLETE";
export type Visibility = "public" | "private";

// 3. The Nested Objects
export type Dimensions = {
  width: number;
  height: number;
  depth?: number;
  unit: "mm" | "cm" | "inch" | "ft";
  area?: number; // for panels, flooring
  volume?: number; // for cabinets, storage
  weight?: number; // material weight
  thickness?: number; // plywood, glass, etc.
};

// 4. The Master Interface
export interface UploadedAsset {
  id: string;
  name: string;
  url: string;
  thumbnailUrl?: string;
  mimeType: string;
  size: number;
  category: UploadCategory;
  kind: UploadKind;
  folderId?: string;
  parentFolderId?: string;
  tags?: string[];
  dimension?: Dimensions;
  isFavorite?: boolean;
  status?: UploadStatus;
  createdAt: string;
  uploadedBy: string;
}

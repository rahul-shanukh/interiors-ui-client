import { useCallback, useState } from "react";
import { useUploads } from "../upload-folder/useUploads";
import { useDropzone } from "react-dropzone";
import { UploadCloud, File, X, Cloud, Server } from "lucide-react"; // Added Cloud and Server icons
import type { UploadCategory } from "../../../entities/upload/model/upload.types";

interface UploadDropzoneProps {
  selectedCategory: UploadCategory;
  onFilesSelected: (files: File[]) => void;
}

export default function UploadDropzone({
  selectedCategory,
  onFilesSelected,
}: UploadDropzoneProps) {
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);
  const { mutateAsync: uploadFile, isPending } = useUploads();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setPreviewFiles(acceptedFiles);
      onFilesSelected(acceptedFiles);
    },
    [onFilesSelected],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      // 👉 FIX 1: The Dropzone Reject Bug.
      // Newer react-dropzone versions require strict MIME type to array mappings.
      accept: {
        "image/jpeg": [".jpeg", ".jpg"],
        "image/png": [".png"],
        "image/webp": [".webp"],
        "application/pdf": [".pdf"],
      },
      maxSize: 10 * 1024 * 1024, // 10MB limit
    });

  const clearFiles = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewFiles([]);
    onFilesSelected([]);
  };

  // 👉 FIX 2: Dynamic Provider Selection
  // The function now takes the specific provider chosen by the button
  const handleUploadClick = async (provider: "r2" | "gcs") => {
    if (previewFiles.length === 0) return;

    try {
      const uploadPromises = previewFiles.map((file) =>
        uploadFile({
          file,
          category: selectedCategory,
          provider, // 'r2' or 'gcs' is passed directly to your NestJS Factory!
        }),
      );

      await Promise.all(uploadPromises);
      console.log(
        `✅ All files successfully uploaded to ${provider.toUpperCase()}!`,
      );

      setPreviewFiles([]);
      onFilesSelected([]);
    } catch (error) {
      console.error(`❌ Upload to ${provider.toUpperCase()} failed:`, error);
      alert("Failed to upload files. Please try again.");
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* The Drag & Drop Area */}
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-slate-50 hover:bg-slate-100"}
          ${isDragReject ? "border-red-500 bg-red-50" : ""}
        `}
      >
        <input {...getInputProps()} />
        <UploadCloud
          size={48}
          className={`mb-4 ${
            isDragReject
              ? "text-red-500"
              : isDragActive
                ? "text-blue-500"
                : "text-slate-400"
          }`}
        />

        {isDragReject ? (
          <p className="text-lg font-medium text-red-600">
            File type not supported!
          </p>
        ) : isDragActive ? (
          <p className="text-lg font-medium text-blue-600">
            Drop the files here...
          </p>
        ) : (
          <div>
            <p className="text-lg font-medium text-slate-700 mb-1">
              Drag & drop files here, or click to browse
            </p>
            <p className="text-sm text-slate-500">
              Uploading to:{" "}
              <span className="font-bold capitalize text-blue-600">
                {selectedCategory}
              </span>
            </p>
            <p className="text-xs text-slate-400 mt-4">
              Supports JPG, PNG, WEBP, and PDF up to 10MB
            </p>
          </div>
        )}
      </div>

      {/* Preview Section */}
      {previewFiles.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-semibold text-slate-700">
              Ready to upload ({previewFiles.length} files)
            </h4>
            <button
              onClick={clearFiles}
              disabled={isPending}
              className={`transition-colors ${isPending ? "text-slate-300 cursor-not-allowed" : "text-slate-400 hover:text-red-500"}`}
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col gap-2 mb-4">
            {previewFiles.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100"
              >
                <File size={24} className="text-blue-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 👉 FIX 3: The Dual Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => handleUploadClick("r2")}
              disabled={isPending}
              className={`flex-1 flex items-center justify-center gap-2 font-medium py-2.5 rounded-lg transition-colors text-white ${
                isPending
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              <Server size={18} />
              {isPending ? "Uploading..." : "Upload to Cloudflare R2"}
            </button>

            <button
              onClick={() => handleUploadClick("gcs")}
              disabled={isPending}
              className={`flex-1 flex items-center justify-center gap-2 font-medium py-2.5 rounded-lg transition-colors text-white ${
                isPending
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <Cloud size={18} />
              {isPending ? "Uploading..." : "Upload to Google GCS"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

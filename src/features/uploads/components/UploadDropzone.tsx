//src/features/uploads/components/UploadDropzone.tsx
import { useDropzone } from "react-dropzone";
import type { UploadCategory } from "../../../entities/upload/model/upload.types";
import { useUploads } from "../upload-folder/useUploads";
import "../components/upload.css";
import {
  FaCloudflare,
  FaCloudUploadAlt,
  FaFile,
  FaGoogle,
  FaWindowClose,
} from "react-icons/fa";
import { useCallback, useState } from "react";

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
      setPreviewFiles((prev) => {
        const updatedFiles = [...prev, ...acceptedFiles];
        onFilesSelected(updatedFiles);
        return updatedFiles;
      });
    },
    [onFilesSelected],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,

      accept: {
        "image/jpeg": [".jpeg", ".jpg"],
        "image/png": [".png"],
        "image/webp": [".webp"],
        "application/pdf": [".pdf"],
      },

      maxFiles: 8,
      maxSize: 10 * 1024 * 1024,
    });

  const clearFiles = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewFiles([]);
    onFilesSelected([]);
  };

  const handleUploadClick = async (provider: "r2" | "gcs") => {
    if (previewFiles.length === 0) return;

    try {
      const uploadPromises = previewFiles.map((file) =>
        uploadFile({
          file,
          category: selectedCategory,
          provider,
        }),
      );
      await Promise.all(uploadPromises);
      console.log(
        `✅ All files successfully uploaded to ${provider.toUpperCase()}!`,
      );
    } catch (error) {
      console.error(`❌ Upload to ${provider.toUpperCase()} failed:`, error);
      alert("Failed to upload files. Please try again.");
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div
        {...getRootProps()}
        className={`relative
                        border-3 border-dashed rounded-2xl p-12 
                        text-center cursor-pointer transition-all 
                        duration-150 flex flex-col items-center justify-center
        ${
          isDragActive
            ? "border-blue-50 bg-blue-50"
            : "border-slate-300 bg-slate-50 hover:bg-slate-100"
        } ${isDragReject ? "border-red-500 bg-red-50" : ""}`}
      >
        <input {...getInputProps()} />
        <FaCloudUploadAlt
          size={48}
          className={`mb-2 ${
            isDragReject
              ? "text-red-500 "
              : isDragActive
                ? "text-blue-500"
                : "text-shadow-slate-600"
          }`}
        />
        {isDragReject ? (
          <p className="text-lg font-medium text-red-500">
            File type not supported....
          </p>
        ) : isDragActive ? (
          <p
            className="text-lg font-medium text-blue-500 
          animate-float"
          >
            Drop the Files here
          </p>
        ) : (
          <div className="">
            <p className="text-lg font-medium text-slate-700 mb-1">
              Drag & drop files here, or click to browse
            </p>
            <p>
              Uploading to :{" "}
              <span className="font-bold capitalize text-blue-500">
                {selectedCategory}
              </span>
            </p>
            <p className="text-xs text-slate-400 mt-4">
              Supports JPG, PNG, WEBP, and PDF up to 10MB
            </p>
          </div>
        )}
      </div>

      {/* {Preview Section} */}
      <div
        className="bg-white border border-slate-300 rounded-xl
                p-4 shadow-sm"
      >
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-1xl font-semibold text-slate-700">
            Ready to Upload ({previewFiles.length}) files
          </h4>
          <button
            onClick={clearFiles}
            disabled={isPending}
            className={`transition-colors ${
              isPending
                ? "text-slate-300 cursor-not-allowed"
                : "text-slate-400 hover:text-red-600"
            }`}
          >
            <FaWindowClose size={20} />
          </button>
        </div>

        <div className="">
          {previewFiles.map((file) => (
            <div key={file.name} className="flex gap-2">
              <FaFile size={20} className="text-slate-400 shrink-0" />
              <div>
                <p>{file.name}</p>
                <p className="text-xs text-slate-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* {Buttons Section} */}
        <div className="flex gap-3 p-4">
          <button
            onClick={() => handleUploadClick("r2")}
            className={`flex-1 flex items-center justify-center
            border gap-2 font-medium py-2.5 rounded-lg
            transition-all duration-150 text-white
            active:translate-y-1 ${
              isPending
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700"
            }`}
          >
            <FaCloudflare size={18} />
            {isPending ? "Uploading..." : "Upload to Cloudflare R2"}
          </button>

          <button
            onClick={() => handleUploadClick("gcs")}
            className={`flex-1 flex items-center justify-center 
               border gap-2 font-medium py-2.5 rounded-lg 
               transition-all duration-150 text-white 
               active:translate-y-1 ${
                 isPending
                   ? "bg-slate-50 cursor-not-allowed"
                   : "bg-blue-600 hover:bg-blue-700"
               }
               }`}
          >
            <FaGoogle size={18} />
            {isPending ? "Uploading..." : "Upload to Google Drive"}
          </button>
        </div>
      </div>
    </div>
  );
}

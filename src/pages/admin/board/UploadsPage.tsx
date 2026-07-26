// src/pages/admin/board/UploadsPage.tsx
import { useState } from "react";
import UploadDropzone from "../../../features/uploads/components/UploadDropzone";
import {
  UPLOAD_CATEGORIES,
  type UploadCategory,
} from "../../../entities/upload/model/upload.types";

export default function UploadsPage() {
  // Default to the first category (Kitchen)

  const [activeCategory, setActiveCategory] = useState<UploadCategory>(
    UPLOAD_CATEGORIES[0].key,
  );

  // const [flowStep, setFlowStep] = useState<UploadFlowStep>("SELECT");
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);

  const handleFilesSelected = (files: File[]) => {
    setStagedFiles(files);
  };

  // const hasFiles = stagedFiles.length > 0;

  return (
    <div className="p-8 h-full flex flex-col max-w-5xl mx-auto w-full">
      {/* Header Area */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Cloud Uploads</h1>
          <p className="text-slate-500 mt-1">
            Manage and upload assets to Cloud Storage for your board. Select a
            category and drag your files to upload.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wider">
          Select Category
        </h3>
        <div className="flex flex-wrap gap-2">
          {UPLOAD_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 
                ${
                  activeCategory === cat.key
                    ? "bg-slate-800 text-white shadow-md"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wider">
          Asset Details
        </h3>
      </div>

      {/* Upload Zone */}

      <div className="max-w-2xl">
        <h3 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wider">
          Upload Files
        </h3>
        <UploadDropzone
          selectedCategory={activeCategory}
          onFilesSelected={handleFilesSelected}
        />
        {stagedFiles.length > 0 && (
          <p className="mt-3 text-sm text-slate-500">
            {stagedFiles.length} file{stagedFiles.length === 1 ? "" : "s"}{" "}
            selected
          </p>
        )}
      </div>
    </div>
  );
}

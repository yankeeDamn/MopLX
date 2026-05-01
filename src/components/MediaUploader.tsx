"use client";

import { useState, useRef } from "react";

interface MediaUploaderProps {
  onUploadSuccess?: (media: { id: string; url: string; type: string }) => void;
  resourceId?: string;
  accept?: string;
  maxSizeMB?: number;
  buttonText?: string;
  className?: string;
}

export default function MediaUploader({
  onUploadSuccess,
  resourceId,
  accept = "image/*,video/*",
  maxSizeMB = 10,
  buttonText = "Upload Media",
  className = "",
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setProgress(0);

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Show preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    // Upload file
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    if (resourceId) {
      formData.append("resource_id", resourceId);
    }

    try {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setProgress(percentComplete);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 201) {
          const response = JSON.parse(xhr.responseText);
          if (onUploadSuccess) {
            onUploadSuccess(response.media);
          }
          setPreview(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } else {
          const error = JSON.parse(xhr.responseText);
          setError(error.message || "Upload failed");
        }
        setUploading(false);
      });

      xhr.addEventListener("error", () => {
        setError("Upload failed. Please try again.");
        setUploading(false);
      });

      xhr.open("POST", "/api/media");
      xhr.send(formData);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Upload failed. Please try again.");
      setUploading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      <button
        type="button"
        onClick={triggerFileSelect}
        disabled={uploading}
        className="px-4 py-2 bg-stone-950 hover:bg-stone-800 disabled:bg-stone-400 text-white font-medium rounded-lg transition-colors text-sm"
      >
        {uploading ? `Uploading ${Math.round(progress)}%` : buttonText}
      </button>

      {preview && (
        <div className="mt-3">
          <img src={preview} alt="Preview" className="max-w-xs rounded-lg border border-gray-300 dark:border-gray-600" />
        </div>
      )}

      {uploading && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-stone-950 dark:bg-stone-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}

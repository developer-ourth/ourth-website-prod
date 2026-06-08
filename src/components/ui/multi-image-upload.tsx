"use client";

import { uploadImage } from "@/lib/api";
import { useRef, useState } from "react";

interface MultiImageUploadProps {
  values: string[];
  onChange: (urls: string[]) => void;
  aspectHint?: string;
  maxImages?: number;
}

export function MultiImageUpload({
  values,
  onChange,
  aspectHint,
  maxImages = 8,
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) {
      return;
    }

    const remainingSlots = Math.max(0, maxImages - values.length);
    const selectedFiles = files.slice(0, remainingSlots);

    if (selectedFiles.length === 0) {
      setUploadError(`Maximum ${maxImages} images allowed.`);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      const uploadedUrls: string[] = [];
      for (const file of selectedFiles) {
        const url = await uploadImage(file);
        uploadedUrls.push(url);
      }

      const merged = Array.from(new Set([...values, ...uploadedUrls]));
      onChange(merged);
    } catch (err: unknown) {
      setUploadError(
        (err as { message?: string })?.message ?? "Upload failed. Try again.",
      );
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  function removeImage(index: number) {
    const next = values.filter((_, i) => i !== index);
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        onClick={() => !uploading && inputRef.current?.click()}
        className={`relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed transition-colors ${
          uploading
            ? "cursor-not-allowed border-stroke opacity-60 dark:border-dark-3"
            : "border-stroke hover:border-primary dark:border-dark-3 dark:hover:border-primary"
        }`}
      >
        <div className="flex flex-col items-center gap-1.5 py-6 text-center">
          <svg
            className="h-9 w-9 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Click to upload multiple images
          </span>
          <span className="text-xs text-gray-400">
            {aspectHint ?? "PNG, JPG, WEBP — max 2 MB each"}
          </span>
          <span className="text-[11px] text-gray-400">
            {values.length}/{maxImages} uploaded
          </span>
        </div>

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/80 dark:bg-gray-dark/80">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>

      {values.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {values.map((url, index) => (
            <div key={`${url}-${index}`} className="group relative overflow-hidden rounded-lg border border-stroke dark:border-dark-3">
              <img src={url} alt={`Product image ${index + 1}`} className="h-24 w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute right-1 top-1 rounded bg-black/65 px-2 py-0.5 text-xs text-white opacity-0 transition group-hover:opacity-100"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
    </div>
  );
}

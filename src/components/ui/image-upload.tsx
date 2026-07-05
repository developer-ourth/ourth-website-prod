"use client";

import { uploadImage } from "@/lib/api";
import { useRef, useState } from "react";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  aspectHint?: string;
}

export function ImageUpload({ value, onChange, aspectHint }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (err: unknown) {
      setUploadError(
        (err as { message?: string })?.message ?? "Upload failed. Try again.",
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/quicktime,video/x-msvideo,video/webm,video/x-matroska"
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
        {value ? (
          <div className="group relative w-full">
            {/\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(value) ? (
              <video
                src={value}
                className="max-h-40 w-full object-contain p-2"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <img
                src={value}
                alt="Preview"
                className="max-h-40 w-full object-contain p-2"
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
              <span className="rounded-md bg-white/90 px-3 py-1 text-xs font-semibold text-gray-800">
                Click to replace
              </span>
            </div>
          </div>
        ) : (
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
              Click to upload
            </span>
            <span className="text-xs text-gray-400">
              {aspectHint ?? "PNG, JPG, WEBP — max 2 MB"}
            </span>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/80 dark:bg-gray-dark/80">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>

      {uploadError && (
        <p className="mt-1 text-xs text-red-500">{uploadError}</p>
      )}
    </div>
  );
}

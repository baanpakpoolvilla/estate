"use client";

import { useState, useRef } from "react";

type ImageUploadFieldProps = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
};

export default function ImageUploadField({ value, onChange, label = "รูปภาพ", className = "" }: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "อัปโหลดไม่สำเร็จ");
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "อัปโหลดไม่สำเร็จ");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={className}>
      {label && <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>}
      {value ? (
        <div className="flex flex-wrap items-start gap-3">
          <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 shrink-0">
            <img src={value} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="text-sm text-blue font-medium hover:underline disabled:opacity-50"
            >
              {uploading ? "กำลังอัปโหลด..." : "เปลี่ยนรูป"}
            </button>
            <button type="button" onClick={() => onChange("")} className="text-sm text-gray-500 hover:underline">
              ลบรูป
            </button>
          </div>
        </div>
      ) : (
        <div className="min-w-0">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-navy bg-white hover:bg-gray-50 disabled:opacity-50 whitespace-nowrap"
          >
            {uploading ? "กำลังอัปโหลด..." : "อัปโหลดรูป"}
          </button>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        className="sr-only"
        onChange={handleFile}
        tabIndex={-1}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

"use client";

import { useState, useRef } from "react";

type QueueItem = {
  id: string;
  fileName: string;
  previewUrl: string;
  status: "waiting" | "uploading" | "done" | "error";
  errorMsg?: string;
};

type MultiImageUploadProps = {
  onUploaded: (url: string) => void;
};

export default function MultiImageUpload({ onUploaded }: MultiImageUploadProps) {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function updateItem(id: string, patch: Partial<QueueItem>) {
    setQueue((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  }

  function removeItem(id: string) {
    setQueue((prev) => {
      const item = prev.find((q) => q.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((q) => q.id !== id);
    });
  }

  async function uploadOne(file: File, id: string) {
    try {
      updateItem(id, { status: "uploading" });

      const formData = new FormData();
      formData.set("file", file);

      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);

      updateItem(id, { status: "done" });
      onUploaded(data.url);

      setTimeout(() => removeItem(id), 800);
    } catch (err) {
      updateItem(id, {
        status: "error",
        errorMsg: err instanceof Error ? err.message : "อัปโหลดล้มเหลว",
      });
    }
  }

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);
    e.target.value = "";

    const newItems: { file: File; item: QueueItem }[] = files.map((file) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      return {
        file,
        item: {
          id,
          fileName: file.name,
          previewUrl: URL.createObjectURL(file),
          status: "waiting" as const,
        },
      };
    });

    setQueue((prev) => [...prev, ...newItems.map((n) => n.item)]);
    setBusy(true);

    for (const { file, item } of newItems) {
      await uploadOne(file, item.id);
    }

    setBusy(false);
  }

  const statusText: Record<QueueItem["status"], string> = {
    waiting: "รอคิว",
    uploading: "กำลังอัปโหลด...",
    done: "สำเร็จ",
    error: "ล้มเหลว",
  };

  return (
    <div className="space-y-3">
      {queue.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {queue.map((q) => (
            <div key={q.id} className="relative">
              <div className="aspect-square rounded-lg overflow-hidden border-2 border-dashed border-gray-300 relative bg-gray-50">
                <img
                  src={q.previewUrl}
                  alt=""
                  className={`w-full h-full object-cover ${q.status === "done" ? "" : "opacity-50"}`}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
                  {q.status === "uploading" && (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {q.status === "error" && <span className="text-red-400 text-lg font-bold">✕</span>}
                  {q.status === "waiting" && <span className="text-white/70 text-sm">⏳</span>}
                  {q.status === "done" && <span className="text-green-400 text-lg">✓</span>}
                  <span className="text-white text-[10px] mt-1 font-medium drop-shadow px-1 text-center leading-tight">
                    {q.status === "error" ? q.errorMsg : statusText[q.status]}
                  </span>
                </div>
              </div>
              {q.status === "error" && (
                <button
                  type="button"
                  onClick={() => removeItem(q.id)}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center shadow"
                >×</button>
              )}
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        multiple
        className="sr-only"
        onChange={handleFiles}
        tabIndex={-1}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-gray-300 text-sm text-navy hover:border-blue hover:text-blue transition w-full justify-center disabled:opacity-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
        </svg>
        {busy ? "กำลังอัปโหลด..." : "เลือกหลายรูปภาพ"}
      </button>
    </div>
  );
}

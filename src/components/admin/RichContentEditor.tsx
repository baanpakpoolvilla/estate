"use client";

import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type RichContentEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  className?: string;
};

export default function RichContentEditor({
  value,
  onChange,
  placeholder = "เขียนเนื้อหาได้ทั้งข้อความและแทรกรูปภาพ (รองรับ Markdown)",
  minHeight = 280,
  className = "",
}: RichContentEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [showUrlBox, setShowUrlBox] = useState(false);

  function insertAtCursor(text: string) {
    const ta = textareaRef.current;
    if (!ta) {
      onChange(value + text);
      return;
    }
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const before = value.slice(0, start);
    const after = value.slice(end);
    const inserted = (start === end ? text : text.trim()) + (after && !after.startsWith("\n") ? "\n\n" : "");
    onChange(before + inserted + after);
    setTimeout(() => {
      ta.focus();
      const newPos = start + inserted.length;
      ta.setSelectionRange(newPos, newPos);
    }, 0);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "อัปโหลดไม่สำเร็จ");
      insertAtCursor(`\n\n![${file.name.replace(/\.[^.]+$/, "")}](${data.url})\n\n`);
    } catch {
      alert("อัปโหลดรูปไม่สำเร็จ");
    } finally {
      setUploading(false);
    }
  }

  function handleInsertUrl() {
    const url = imageUrlInput.trim();
    if (!url) return;
    insertAtCursor(`\n\n![รูปภาพ](${url})\n\n`);
    setImageUrlInput("");
    setShowUrlBox(false);
  }

  return (
    <div className={className}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-2 p-2 rounded-t-xl border border-gray-200 border-b-0 bg-gray-50">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFileUpload}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm text-navy hover:bg-gray-50 disabled:opacity-50"
        >
          {uploading ? "กำลังอัปโหลด..." : "📷 แทรกรูป (อัปโหลด)"}
        </button>
        <button
          type="button"
          onClick={() => setShowUrlBox((v) => !v)}
          className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm text-navy hover:bg-gray-50"
        >
          แทรกรูปจาก URL
        </button>
        <button
          type="button"
          onClick={() => setShowPreview((v) => !v)}
          className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm text-navy hover:bg-gray-50"
        >
          {showPreview ? "แก้ไข" : "ดูตัวอย่าง"}
        </button>
        {showUrlBox && (
          <span className="flex items-center gap-2 flex-wrap">
            <input
              type="url"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleInsertUrl())}
              placeholder="https://..."
              className="px-2 py-1 rounded border border-gray-200 text-sm w-48"
            />
            <button
              type="button"
              onClick={handleInsertUrl}
              className="px-2 py-1 rounded bg-blue text-white text-sm"
            >
              แทรก
            </button>
          </span>
        )}
      </div>

      {!showPreview ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-b-xl border border-gray-200 text-navy resize-y font-mono text-sm"
          style={{ minHeight }}
          required
        />
      ) : (
        <div
          className="w-full px-4 py-3 rounded-b-xl border border-gray-200 bg-gray-50 text-gray-700 prose prose-sm max-w-none prose-p:my-2 prose-headings:my-3 prose-img:rounded-lg prose-img:max-w-full"
          style={{ minHeight }}
        >
          <PreviewContent content={value} />
        </div>
      )}
      <p className="text-xs text-gray-500 mt-1">
        รองรับ Markdown: **ตัวหนา**, *ตัวเอียง*, รายการ, ลิงก์, และรูปภาพ (แทรกได้จากปุ่มด้านบน)
      </p>
    </div>
  );
}

function PreviewContent({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {content || "(ยังไม่มีเนื้อหา)"}
    </ReactMarkdown>
  );
}

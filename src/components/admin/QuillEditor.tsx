"use client";

import dynamic from "next/dynamic";
import { useRef, useMemo } from "react";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill").then((mod) => mod.default), {
  ssr: false,
  loading: () => (
    <div className="min-h-[200px] rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-500 text-sm">
      กำลังโหลดตัวแก้ไข...
    </div>
  ),
});

const QUILL_WRAPPER_ID = "quill-editor-wrapper";

function getQuillInstance(): { getSelection: (focus?: boolean) => { index: number } | null; insertEmbed: (index: number, type: string, value: string) => void; setSelection: (index: number) => void } | null {
  if (typeof document === "undefined") return null;
  const wrapper = document.getElementById(QUILL_WRAPPER_ID);
  const editorEl = wrapper?.querySelector(".ql-editor");
  if (!editorEl) return null;
  const QuillModule = require("quill");
  const Q = QuillModule.default;
  return Q.find(editorEl as HTMLElement);
}

type QuillEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
  className?: string;
};

export default function QuillEditor({
  value,
  onChange,
  placeholder = "เขียนเนื้อหา...",
  height = 380,
  className = "",
}: QuillEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const imageHandler = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "อัปโหลดไม่สำเร็จ");
      const url = data.url;
      const quill = getQuillInstance();
      if (quill) {
        const range = quill.getSelection(true) ?? { index: 0 };
        quill.insertEmbed(range.index, "image", url);
        quill.setSelection(range.index + 1);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "อัปโหลดรูปไม่สำเร็จ");
    }
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    []
  );

  const formats = [
    "header",
    "bold", "italic", "underline", "strike",
    "list", "bullet",
    "link", "image",
  ];

  return (
    <div id={QUILL_WRAPPER_ID} className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        style={{ minHeight: height }}
        className="quill-editor-custom"
      />
      <p className="text-xs text-gray-500 mt-1">
        จัดรูปแบบข้อความได้ แทรกรูปจากปุ่มรูปภาพ (อัปโหลดอัตโนมัติ)
      </p>
      <style jsx global>{`
        .quill-editor-custom .ql-container {
          min-height: ${height - 42}px;
          font-size: 14px;
          font-family: inherit;
        }
        .quill-editor-custom .ql-editor {
          min-height: ${height - 42}px;
        }
      `}</style>
    </div>
  );
}

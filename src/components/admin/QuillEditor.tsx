"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[200px] rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-500 text-sm">
      กำลังโหลดตัวแก้ไข...
    </div>
  ),
});

const MODULES = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
  clipboard: { matchVisual: false },
};

const FORMATS = [
  "header",
  "bold", "italic", "underline", "strike",
  "list", "bullet",
  "link",
];

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
  return (
    <div className={className}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={MODULES}
        formats={FORMATS}
        style={{ minHeight: height }}
        className="quill-editor-custom"
      />
      <p className="text-xs text-gray-500 mt-1">
        จัดรูปแบบข้อความ หัวข้อ ตัวหนา ลิสต์ และลิงก์ได้
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

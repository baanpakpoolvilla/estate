"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="w-full min-w-0 flex flex-col items-center justify-center py-20 text-center">
      <p className="text-5xl mb-4">⚠️</p>
      <h1 className="text-xl md:text-2xl font-bold text-navy mb-2">เกิดข้อผิดพลาด</h1>
      <p className="text-gray-500 text-sm md:text-base mb-8">
        ขออภัย ระบบเกิดข้อผิดพลาดชั่วคราว กรุณาลองใหม่อีกครั้ง
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={reset}
          className="px-6 py-3 rounded-xl bg-blue text-white font-semibold text-sm hover:bg-blue-light transition"
        >
          ลองใหม่อีกครั้ง
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl border border-gray-200 text-navy font-semibold text-sm hover:bg-gray-50 transition"
        >
          กลับหน้าแรก
        </Link>
      </div>
    </div>
  );
}

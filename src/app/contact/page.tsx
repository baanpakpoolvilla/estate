"use client";

import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <main className="min-h-screen pb-6">
      <header className="sticky top-0 z-40 bg-navy text-white px-4 py-3">
        <h1 className="font-semibold text-lg">ติดต่อเรา</h1>
        <p className="text-white/80 text-sm">สอบถามหรือนัดดูโครงการ</p>
      </header>

      <div className="px-4 py-6 space-y-6">
        <div className="flex gap-3">
          <a
            href="tel:0812345678"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue text-white font-medium"
          >
            โทร
          </a>
          <a
            href="https://line.me/ti/p/xxxx"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#06C755] text-white font-medium"
          >
            Line
          </a>
        </div>

        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-navy mb-3">ส่งข้อความ</h2>
          {sent ? (
            <p className="text-gray-600 text-sm py-4 text-center">
              ส่งข้อมูลเรียบร้อย เราจะติดต่อกลับโดยเร็ว
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="ชื่อ"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy placeholder-gray-400"
                required
              />
              <input
                type="tel"
                placeholder="เบอร์โทร"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy placeholder-gray-400"
                required
              />
              <input
                type="email"
                placeholder="อีเมล"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy placeholder-gray-400"
              />
              <select
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy"
              >
                <option value="">ความสนใจ</option>
                <option value="buy">สนใจซื้อ/ลงทุน</option>
                <option value="info">ขอข้อมูลเพิ่ม</option>
                <option value="visit">นัดดูโครงการ</option>
              </select>
              <textarea
                placeholder="ข้อความ"
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy placeholder-gray-400 resize-none"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-navy text-white font-semibold"
              >
                ส่งข้อความ
              </button>
            </form>
          )}
        </section>

        <section className="bg-offwhite rounded-2xl p-5">
          <h2 className="font-semibold text-navy mb-2">ที่อยู่โครงการ</h2>
          <p className="text-gray-600 text-sm">
            (ใส่ที่อยู่หรือลิงก์ Google Map)
          </p>
        </section>
      </div>
    </main>
  );
}

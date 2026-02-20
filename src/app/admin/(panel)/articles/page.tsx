"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  sortOrder: number;
};

export default function AdminArticlesPage() {
  const [list, setList] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/articles")
      .then((r) => r.json())
      .then((data) => {
        setList(Array.isArray(data) ? data : []);
      })
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("ต้องการลบบทความนี้?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
      if (res.ok) setList((prev) => prev.filter((a) => a.id !== id));
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="w-full min-w-0">
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-bold text-xl md:text-2xl text-navy">จัดการบทความ</h1>
          <p className="text-gray-600 mt-1 md:text-base">
            เพิ่ม แก้ไข หรือเผยแพร่บทความบนเว็บไซต์
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="shrink-0 px-4 py-2.5 rounded-xl bg-blue text-white text-sm font-semibold hover:bg-blue/90"
        >
          เพิ่มบทความ
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">กำลังโหลด...</div>
        ) : list.length === 0 ? (
          <div className="p-8 text-center text-gray-500">ยังไม่มีบทความ</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm md:text-base">
              <thead>
                <tr className="border-b border-gray-200 bg-offwhite/50 text-left text-gray-600">
                  <th className="py-3 px-4 font-semibold">หัวข้อ</th>
                  <th className="py-3 px-4 font-semibold">Slug</th>
                  <th className="py-3 px-4 font-semibold">สถานะ</th>
                  <th className="py-3 px-4 font-semibold text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {list.map((a) => (
                  <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-medium text-navy max-w-xs truncate">{a.title}</td>
                    <td className="py-3 px-4 text-gray-600 font-mono text-xs">{a.slug || "-"}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          a.isPublished ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {a.isPublished ? "เผยแพร่แล้ว" : "แบบร่าง"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/articles/${a.id}/edit`}
                        className="text-blue font-medium hover:underline mr-3"
                      >
                        แก้ไข
                      </Link>
                      {a.isPublished && (
                        <a
                          href={`/articles/${a.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:underline mr-3"
                        >
                          ดู
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(a.id)}
                        disabled={deleting === a.id}
                        className="text-red-600 font-medium hover:underline disabled:opacity-50"
                      >
                        {deleting === a.id ? "กำลังลบ..." : "ลบ"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

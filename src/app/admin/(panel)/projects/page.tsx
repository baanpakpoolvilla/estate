"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Project = {
  id: string;
  name: string;
  tagline: string | null;
  location: string | null;
  badge: string | null;
  targetUrl: string | null;
  sortOrder: number;
  isActive: boolean;
};

export default function AdminProjectsPage() {
  const [list, setList] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/projects")
      .then((r) => r.json())
      .then((data) => {
        setList(Array.isArray(data) ? data : []);
      })
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("ต้องการลบโครงการนี้?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (res.ok) setList((prev) => prev.filter((p) => p.id !== id));
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="w-full min-w-0">
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-bold text-xl md:text-2xl text-navy">จัดการโฆษณา / โครงการแนะนำ</h1>
          <p className="text-gray-600 mt-1 md:text-base">
            ตั้งค่าโครงการพูลวิลล่าหรู โครงการใหม่ ที่แสดงบนหน้าแรก
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="shrink-0 px-4 py-2.5 rounded-xl bg-blue text-white text-sm font-semibold hover:bg-blue/90"
        >
          เพิ่มโครงการ
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">กำลังโหลด...</div>
        ) : list.length === 0 ? (
          <div className="p-8 text-center text-gray-500">ยังไม่มีรายการโครงการ</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm md:text-base">
              <thead>
                <tr className="border-b border-gray-200 bg-offwhite/50 text-left text-gray-600">
                  <th className="py-3 px-4 font-semibold">ชื่อ</th>
                  <th className="py-3 px-4 font-semibold">แท็กไลน์</th>
                  <th className="py-3 px-4 font-semibold">สถานะ</th>
                  <th className="py-3 px-4 font-semibold text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-medium text-navy">{p.name}</td>
                    <td className="py-3 px-4 text-gray-600">{p.tagline ?? "-"}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          p.isActive ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {p.isActive ? "แสดง" : "ปิด"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/projects/${p.id}/edit`}
                        className="text-blue font-medium hover:underline mr-3"
                      >
                        แก้ไข
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        disabled={deleting === p.id}
                        className="text-red-600 font-medium hover:underline disabled:opacity-50"
                      >
                        {deleting === p.id ? "กำลังลบ..." : "ลบ"}
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

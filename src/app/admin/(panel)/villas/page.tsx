"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/format";

type Villa = {
  id: string;
  name: string;
  location: string;
  price: string;
  roi: string;
  isPublished: boolean;
  sortOrder: number;
};

export default function AdminVillasPage() {
  const [list, setList] = useState<Villa[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/villas")
      .then((r) => r.json())
      .then((data) => {
        setList(Array.isArray(data) ? data : []);
      })
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("ต้องการลบรายการนี้?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/villas/${id}`, { method: "DELETE" });
      if (res.ok) setList((prev) => prev.filter((v) => v.id !== id));
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="w-full min-w-0">
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-bold text-xl md:text-2xl text-navy">จัดการพูลวิลล่า</h1>
          <p className="text-gray-600 mt-1 md:text-base">
            เพิ่ม แก้ไข ซ่อน หรือจัดเรียงพูลวิลล่าที่แสดงบนหน้าเว็บไซต์
          </p>
        </div>
        <Link
          href="/admin/villas/new"
          className="shrink-0 px-4 py-2.5 rounded-xl bg-blue text-white text-sm font-semibold hover:bg-blue/90"
        >
          เพิ่มวิลล่า
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">กำลังโหลด...</div>
        ) : list.length === 0 ? (
          <div className="p-8 text-center text-gray-500">ยังไม่มีรายการวิลล่า</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm md:text-base">
              <thead>
                <tr className="border-b border-gray-200 bg-offwhite/50 text-left text-gray-600">
                  <th className="py-3 px-4 font-semibold">ชื่อ</th>
                  <th className="py-3 px-4 font-semibold">ทำเล</th>
                  <th className="py-3 px-4 font-semibold">ราคา</th>
                  <th className="py-3 px-4 font-semibold">สถานะ</th>
                  <th className="py-3 px-4 font-semibold text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {list.map((v) => (
                  <tr key={v.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-medium text-navy">{v.name}</td>
                    <td className="py-3 px-4 text-gray-600">{v.location}</td>
                    <td className="py-3 px-4">฿{formatPrice(v.price)}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          v.isPublished ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {v.isPublished ? "แสดง" : "ซ่อน"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/villas/${v.id}/edit`}
                        className="text-blue font-medium hover:underline mr-3"
                      >
                        แก้ไข
                      </Link>
                      <a
                        href={`/villas/${v.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:underline mr-3"
                      >
                        ดู
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDelete(v.id)}
                        disabled={deleting === v.id}
                        className="text-red-600 font-medium hover:underline disabled:opacity-50"
                      >
                        {deleting === v.id ? "กำลังลบ..." : "ลบ"}
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

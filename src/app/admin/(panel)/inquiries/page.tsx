"use client";

import { useEffect, useState } from "react";

type Inquiry = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  interest: string;
  message: string | null;
  isRead: boolean;
  createdAt: string;
};

function formatDate(d: string) {
  return new Date(d).toLocaleString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminInquiriesPage() {
  const [list, setList] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/inquiries")
      .then((r) => r.json())
      .then((data) => setList(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  async function toggleRead(id: string, isRead: boolean) {
    await fetch("/api/admin/inquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isRead }),
    });
    setList((prev) => prev.map((i) => (i.id === id ? { ...i, isRead } : i)));
  }

  async function handleDelete(id: string) {
    if (!confirm("ลบข้อมูลลูกค้ารายนี้?")) return;
    await fetch("/api/admin/inquiries", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setList((prev) => prev.filter((i) => i.id !== id));
  }

  const unreadCount = list.filter((i) => !i.isRead).length;

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-lg md:text-xl text-navy">ข้อมูลลูกค้าที่ติดต่อเข้ามา</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            ทั้งหมด {list.length} รายการ
            {unreadCount > 0 && (
              <span className="ml-2 text-amber-600 font-medium">({unreadCount} ยังไม่ได้อ่าน)</span>
            )}
          </p>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">ยังไม่มีข้อมูลลูกค้า</p>
          <p className="text-sm mt-1">เมื่อลูกค้าส่งฟอร์มติดต่อ ข้อมูลจะแสดงที่นี่</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl border p-4 md:p-5 transition ${
                item.isRead
                  ? "bg-white border-gray-100"
                  : "bg-amber-50/50 border-amber-200/60"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-navy text-sm md:text-base">{item.name}</h3>
                    {!item.isRead && (
                      <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded font-medium">ใหม่</span>
                    )}
                    <span className="text-xs text-gray-400">{formatDate(item.createdAt)}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-sm">
                    <a href={`tel:${item.phone.replace(/\D/g, "")}`} className="text-blue font-medium hover:underline">
                      {item.phone}
                    </a>
                    {item.email && (
                      <a href={`mailto:${item.email}`} className="text-gray-600 hover:underline">
                        {item.email}
                      </a>
                    )}
                  </div>
                  <p className="mt-1.5 text-xs md:text-sm">
                    <span className="text-gray-500">ความสนใจ:</span>{" "}
                    <span className="text-navy font-medium">{item.interest}</span>
                  </p>
                  {item.message && (
                    <p className="mt-1.5 text-gray-600 text-xs md:text-sm bg-gray-50 rounded-lg p-2.5">
                      {item.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleRead(item.id, !item.isRead)}
                    className={`text-xs font-medium px-2.5 py-1 rounded-lg transition ${
                      item.isRead
                        ? "text-gray-500 hover:bg-gray-100"
                        : "text-amber-700 bg-amber-100 hover:bg-amber-200"
                    }`}
                  >
                    {item.isRead ? "ทำเป็นยังไม่อ่าน" : "อ่านแล้ว"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="text-xs text-red-500 hover:text-red-700 hover:underline px-2.5 py-1"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

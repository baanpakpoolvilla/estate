"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { formatPrice } from "@/lib/format";

type OwnerInfo = {
  propertyCode?: string;
  ownerName?: string;
  ownerContact?: string;
  wholesalePrice?: string;
  commission?: string;
  titleDeedType?: string;
  transferFee?: string;
  viewingNotice?: string;
};

type Villa = {
  id: string;
  name: string;
  location: string;
  price: string;
  roi: string;
  isPublished: boolean;
  sortOrder: number;
  ownerInfo?: OwnerInfo | null;
};

export default function AdminVillasPage() {
  const [list, setList] = useState<Villa[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
                {list.map((v) => {
                  const isExpanded = expandedId === v.id;
                  const info = v.ownerInfo;
                  const hasInfo = info && Object.values(info).some((val) => val);

                  return (
                    <Fragment key={v.id}>
                      <tr className={`border-b border-gray-100 hover:bg-gray-50/50 ${isExpanded ? "bg-amber-50/40" : ""}`}>
                        <td className="py-3 px-4 font-medium text-navy">
                          <div className="flex items-center gap-2">
                            {v.name}
                            {info?.propertyCode && (
                              <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded font-medium">{info.propertyCode}</span>
                            )}
                          </div>
                        </td>
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
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setExpandedId(isExpanded ? null : v.id)}
                            className={`font-medium hover:underline mr-3 ${isExpanded ? "text-amber-700" : "text-amber-600"}`}
                            title="ดูข้อมูลเจ้าของ"
                          >
                            {isExpanded ? "ปิด" : "เจ้าของ"}
                          </button>
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
                      {isExpanded && (
                        <tr className="bg-amber-50/60">
                          <td colSpan={5} className="px-4 py-3">
                            {!hasInfo ? (
                              <p className="text-sm text-gray-400 italic">ยังไม่ได้กรอกข้อมูลเจ้าของบ้าน — <Link href={`/admin/villas/${v.id}/edit`} className="text-blue hover:underline">กรอกข้อมูล</Link></p>
                            ) : (
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2 text-sm">
                                <InfoItem label="รหัสทรัพย์" value={info?.propertyCode} />
                                <InfoItem label="ชื่อเจ้าของ" value={info?.ownerName} />
                                <InfoItem label="เบอร์/Line/FB" value={info?.ownerContact} span={2} />
                                <InfoItem label="ราคาส่ง" value={info?.wholesalePrice} />
                                <InfoItem label="ค่าคอม" value={info?.commission} />
                                <InfoItem label="โฉนด" value={info?.titleDeedType} />
                                <InfoItem label="ค่าโอน" value={info?.transferFee} />
                                <InfoItem label="ก่อนเข้าดู" value={info?.viewingNotice} span={2} />
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoItem({ label, value, span }: { label: string; value?: string; span?: number }) {
  if (!value) return null;
  return (
    <div className={span === 2 ? "sm:col-span-2" : ""}>
      <span className="text-gray-500 text-xs">{label}</span>
      <p className="text-navy font-medium">{value}</p>
    </div>
  );
}

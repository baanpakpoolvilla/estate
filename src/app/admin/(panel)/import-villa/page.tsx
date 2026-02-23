"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import type { ImportedVilla } from "@/lib/import-villa";

function formatNumber(n: number): string {
  return n.toLocaleString("th-TH");
}

export default function ImportVillaPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createProgress, setCreateProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ImportedVilla | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function handleFetch() {
    setError(null);
    setData(null);
    if (!url.trim()) {
      setError("กรุณาระบุ URL");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/import-villa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || "ดึงข้อมูลไม่สำเร็จ");
        return;
      }
      setData(json as ImportedVilla);
    } catch (e) {
      setError(e instanceof Error ? e.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  }

  // เคลียร์ interval ความคืบหน้าเมื่อ unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  async function handleCreate() {
    if (!data) return;
    setError(null);
    setCreating(true);
    setCreateProgress(0);

    // ความคืบหน้าแบบจำลอง: ค่อยๆ ขึ้นไปประมาณ 85% ระหว่างรอ (ใช้เวลา ~3 วินาทีถึง 85%)
    const totalImages = data.gallery.reduce((s, g) => s + (g.imageUrls?.length || 0), 0);
    const durationMs = Math.min(8000, 2000 + totalImages * 150);
    const stepMs = 200;
    let step = 0;
    const maxStep = Math.ceil(durationMs / stepMs);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    progressIntervalRef.current = setInterval(() => {
      step += 1;
      const p = Math.min(85, Math.round((step / maxStep) * 85));
      setCreateProgress(p);
      if (p >= 85 && progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }, stepMs);

    try {
      const firstImage =
        data.gallery.length > 0 && data.gallery[0].imageUrls?.length > 0
          ? data.gallery[0].imageUrls[0]
          : null;

      const payload = {
        name: data.name,
        location: data.location,
        beds: data.beds,
        baths: data.baths,
        price: "",
        roi: "",
        sqm: 0,
        land: null,
        description: data.description || null,
        mainVideoId: data.mainVideoId || null,
        imageUrl: firstImage,
        status: "sale",
        propertyType: "pool-villa",
        sortOrder: 0,
        isPublished: false,
        gallery: data.gallery.map((g) => ({
          label: g.label || "รูปภาพ",
          area: g.area || "",
          imageUrls: g.imageUrls || [],
        })),
        accountingSummary: data.accountingSummary.map((a) => ({
          period: a.period,
          revenue: a.revenue,
          profit: a.profit,
        })),
        investmentMonthly:
          data.estimatedAnnualRevenue != null
            ? {
                revenue: String(Math.round(data.estimatedAnnualRevenue / 12)),
                expenses: "",
                profit: String(Math.round(data.estimatedAnnualRevenue / 12)),
              }
            : null,
      };

      const res = await fetch("/api/admin/villas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const villa = await res.json().catch(() => null);

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }

      if (!res.ok || !villa?.id) {
        setCreateProgress(0);
        setError("สร้างรายการไม่สำเร็จ");
        return;
      }
      setCreateProgress(100);
      window.location.href = `/admin/villas/${villa.id}/edit`;
    } catch (e) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setCreateProgress(0);
      setError(e instanceof Error ? e.message : "เกิดข้อผิดพลาด");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="w-full min-w-0 space-y-6">
      <div>
        <h1 className="font-bold text-xl md:text-2xl text-navy">
          นำเข้าข้อมูลบ้านจากลิงก์
        </h1>
        <p className="text-gray-600 mt-1 text-sm md:text-base">
          วางลิงก์จาก pattayapartypoolvilla.com (เช่น /v/2564) แล้วระบบจะดึงข้อมูลบ้าน
          รูปภาพ และรายได้จากวันที่ถูกจองย้อนหลัง มาให้คุณสร้างรายการได้ทันที
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          URL หน้าบ้าน (pattayapartypoolvilla.com เท่านั้น)
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.pattayapartypoolvilla.com/v/2564"
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-navy text-sm focus:ring-2 focus:ring-blue/20 focus:border-blue outline-none"
          />
          <button
            type="button"
            onClick={handleFetch}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-blue text-white font-medium text-sm disabled:opacity-70 whitespace-nowrap"
          >
            {loading ? "กำลังดึงข้อมูล..." : "ดึงข้อมูล"}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1.5">
          ตัวอย่าง: https://www.pattayapartypoolvilla.com/v/2564
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      {data && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6 space-y-4">
          <h2 className="font-semibold text-navy text-lg">ข้อมูลที่ดึงได้</h2>
          <dl className="grid gap-2 text-sm">
            <div>
              <dt className="text-gray-500">ชื่อบ้าน</dt>
              <dd className="font-medium text-navy">{data.name}</dd>
            </div>
            <div>
              <dt className="text-gray-500">ทำเล</dt>
              <dd className="text-navy">{data.location}</dd>
            </div>
            <div className="flex gap-4">
              <div>
                <dt className="text-gray-500">ห้องนอน</dt>
                <dd className="font-medium">{data.beds}</dd>
              </div>
              <div>
                <dt className="text-gray-500">ห้องน้ำ</dt>
                <dd className="font-medium">{data.baths}</dd>
              </div>
            </div>
            <div>
              <dt className="text-gray-500">จำนวนรูปในแกลเลอรี่</dt>
              <dd className="text-navy">
                {data.gallery.reduce(
                  (s, g) => s + (g.imageUrls?.length || 0),
                  0,
                )}{" "}
                รูป (กดสร้างรายการแล้วจะบันทึก URL รูปทั้งหมด — หน้าเว็บจะดึงรูปจากต้นทางมาแสดง ไม่มีการอัปโหลด)
              </dd>
            </div>
            {data.gallery.length > 0 && (
              <div className="col-span-full space-y-4">
                {data.gallery.map((g, i) => (
                  <div key={i}>
                    <dt className="text-gray-500 font-medium mb-2 block">
                      {g.label || "รูปภาพ"} ({g.imageUrls?.length || 0} รูป)
                    </dt>
                    <dd className="flex flex-wrap gap-2">
                      {(g.imageUrls || []).map((src, j) => (
                        <a
                          key={j}
                          href={src}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shrink-0"
                        >
                          <img
                            src={src}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </a>
                      ))}
                    </dd>
                  </div>
                ))}
              </div>
            )}
            {data.mainVideoId && (
              <div>
                <dt className="text-gray-500">วิดีโอ YouTube</dt>
                <dd className="text-navy text-sm">ID: {data.mainVideoId}</dd>
              </div>
            )}
            {data.description && (
              <div className="col-span-full">
                <dt className="text-gray-500 mb-1">รายละเอียด (ย่อ)</dt>
                <dd className="text-navy text-sm whitespace-pre-line line-clamp-6 bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                  {data.description.slice(0, 500)}
                  {data.description.length > 500 ? "…" : ""}
                </dd>
              </div>
            )}
            {data.accountingSummary.length > 0 && (
              <div>
                <dt className="text-gray-500">รายได้ย้อนหลัง (แยกเดือน)</dt>
                <dd className="text-navy">
                  {data.accountingSummary.length} เดือน
                  {data.estimatedAnnualRevenue != null && (
                    <span className="ml-2 text-green-700 font-medium">
                      (~{formatNumber(data.estimatedAnnualRevenue)} บาท/ปี)
                    </span>
                  )}
                </dd>
              </div>
            )}
          </dl>

          {data.accountingSummary.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-3 py-2 font-semibold text-navy">ช่วง</th>
                    <th className="px-3 py-2 font-semibold text-navy text-right">
                      รายได้ (บาท)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.accountingSummary.slice(0, 12).map((row, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="px-3 py-2">{row.period}</td>
                      <td className="px-3 py-2 text-right font-medium text-green-700">
                        {formatNumber(parseInt(row.revenue, 10) || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="pt-4 flex flex-col gap-3">
            {creating && (
              <div className="w-full space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">กำลังสร้างรายการ...</span>
                  <span className="font-medium text-navy tabular-nums">{createProgress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full bg-blue rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${createProgress}%` }}
                  />
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleCreate}
                disabled={creating}
                className="px-5 py-2.5 rounded-xl bg-blue text-white font-medium text-sm disabled:opacity-70"
              >
                {creating ? "กำลังสร้างรายการ..." : "สร้างรายการบ้านจากข้อมูลนี้"}
              </button>
              <Link
                href="/admin/villas"
                className={`px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 ${creating ? "pointer-events-none opacity-60" : ""}`}
              >
                ยกเลิก
              </Link>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500">
        กดสร้างรายการแล้ว ระบบจะบันทึก URL รูปทั้งหมดลงฐานข้อมูล — หน้าเว็บจะดึงรูปจากต้นทางมาแสดง (รูปมาครบทุกรูป)
        หลังสร้างเสร็จจะนำไปหน้าแก้ไข — แอดมินสามารถเข้ามาแก้ไขราคา ROI และข้อมูลเพิ่มเติมได้ภายหลัง
        (ข้อมูลบริษัท/นายหน้าจากเว็บต้นทางจะไม่ถูกนำมา)
      </p>
    </div>
  );
}

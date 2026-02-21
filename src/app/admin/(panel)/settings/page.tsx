"use client";

import { useEffect, useState } from "react";
import ImageUploadField from "@/components/admin/ImageUploadField";

type SiteSettings = {
  logoUrl: string | null;
  faviconUrl: string | null;
  companyName: string | null;
  companyNameEn: string | null;
  registrationNumber: string | null;
  phone: string | null;
  email: string | null;
  lineUrl: string | null;
  address: string | null;
  mapUrl: string | null;
  facebookUrl: string | null;
};

const empty: SiteSettings = {
  logoUrl: "",
  faviconUrl: "",
  companyName: "",
  companyNameEn: "",
  registrationNumber: "",
  phone: "",
  email: "",
  lineUrl: "",
  address: "",
  mapUrl: "",
  facebookUrl: "",
};

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SiteSettings>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/contact-settings")
      .then((r) => r.json())
      .then((data) => {
        setForm({
          logoUrl: data.logoUrl ?? "",
          faviconUrl: data.faviconUrl ?? "",
          companyName: data.companyName ?? "",
          companyNameEn: data.companyNameEn ?? "",
          registrationNumber: data.registrationNumber ?? "",
          phone: data.phone ?? "",
          email: data.email ?? "",
          lineUrl: data.lineUrl ?? "",
          address: data.address ?? "",
          mapUrl: data.mapUrl ?? "",
          facebookUrl: data.facebookUrl ?? "",
        });
      })
      .catch(() => setForm(empty))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/contact-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logoUrl: form.logoUrl?.trim() || null,
          faviconUrl: form.faviconUrl?.trim() || null,
          companyName: form.companyName?.trim() || null,
          companyNameEn: form.companyNameEn?.trim() || null,
          registrationNumber: form.registrationNumber?.trim() || null,
          phone: form.phone?.trim() || null,
          email: form.email?.trim() || null,
          lineUrl: form.lineUrl?.trim() || null,
          address: form.address?.trim() || null,
          mapUrl: form.mapUrl?.trim() || null,
          facebookUrl: form.facebookUrl?.trim() || null,
        }),
      });
      if (!res.ok) throw new Error("บันทึกไม่สำเร็จ");
      setMessage({ type: "ok", text: "บันทึกเรียบร้อย" });
    } catch {
      setMessage({ type: "err", text: "เกิดข้อผิดพลาด กรุณาลองใหม่" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-8 text-gray-500">กำลังโหลด...</div>;

  return (
    <div className="w-full min-w-0">
      <div className="mb-6 md:mb-8">
        <h1 className="font-bold text-xl md:text-2xl text-navy">ตั้งค่าเว็บไซต์</h1>
        <p className="text-gray-600 mt-1 md:text-base">
          โลโก้ ข้อมูลพื้นฐาน และช่องทางติดต่อที่ใช้แสดงบน Header, Footer และหน้าติดต่อเรา (ข้อมูลจากฐานข้อมูลจริง)
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-8">
        {/* โลโก้และข้อมูลพื้นฐาน */}
        <section className="space-y-4">
          <h2 className="font-semibold text-navy text-lg border-b border-gray-200 pb-2">โลโก้และข้อมูลพื้นฐาน</h2>
          <ImageUploadField
            label="โลโก้เว็บไซต์"
            value={form.logoUrl ?? ""}
            onChange={(url) => setForm((p) => ({ ...p, logoUrl: url }))}
          />
          <p className="text-xs text-gray-500">แสดงใน Header และ Footer (ถ้าว่างจะใช้ชื่อบริษัทเป็นข้อความ)</p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ไอคอนแท็บ (Favicon) URL</label>
            <input
              type="url"
              value={form.faviconUrl ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, faviconUrl: e.target.value }))}
              placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy"
            />
            <p className="text-xs text-gray-500 mt-1">ถ้าเว้นว่าง จะใช้โลโก้เว็บไซต์ด้านบนเป็น Favicon อัตโนมัติ</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อบริษัท (ไทย)</label>
            <input
              type="text"
              value={form.companyName ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, companyName: e.target.value }))}
              placeholder="บริษัท xxx จำกัด"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อบริษัท (อังกฤษ)</label>
            <input
              type="text"
              value={form.companyNameEn ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, companyNameEn: e.target.value }))}
              placeholder="XXX CO., LTD."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">เลขทะเบียนนิติบุคคล</label>
            <input
              type="text"
              value={form.registrationNumber ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, registrationNumber: e.target.value }))}
              placeholder="0205567002163"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy"
            />
          </div>
        </section>

        {/* ช่องทางติดต่อ */}
        <section className="space-y-4">
          <h2 className="font-semibold text-navy text-lg border-b border-gray-200 pb-2">ช่องทางติดต่อ</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทร</label>
            <input
              type="text"
              value={form.phone ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              placeholder="081-234-5678"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
            <input
              type="email"
              value={form.email ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              placeholder="info@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ลิงก์ Line</label>
            <input
              type="url"
              value={form.lineUrl ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, lineUrl: e.target.value }))}
              placeholder="https://line.me/ti/p/xxxx"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ที่อยู่</label>
            <textarea
              value={form.address ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
              placeholder="ที่อยู่โครงการ หรือสำนักงาน"
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ลิงก์ Google Map</label>
            <input
              type="url"
              value={form.mapUrl ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, mapUrl: e.target.value }))}
              placeholder="https://maps.google.com/..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ลิงก์ Facebook / เพจ</label>
            <input
              type="url"
              value={form.facebookUrl ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, facebookUrl: e.target.value }))}
              placeholder="https://www.facebook.com/..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy"
            />
          </div>
        </section>

        {message && (
          <div
            className={`p-3 rounded-xl text-sm ${
              message.type === "ok" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-blue text-white font-semibold disabled:opacity-70"
        >
          {saving ? "กำลังบันทึก..." : "บันทึก"}
        </button>
      </form>
    </div>
  );
}

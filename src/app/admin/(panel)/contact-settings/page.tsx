"use client";

import { useEffect, useState } from "react";

type ContactSettings = {
  id?: string;
  phone: string | null;
  email: string | null;
  lineUrl: string | null;
  address: string | null;
  mapUrl: string | null;
};

const empty: ContactSettings = {
  phone: "",
  email: "",
  lineUrl: "",
  address: "",
  mapUrl: "",
};

export default function AdminContactSettingsPage() {
  const [form, setForm] = useState<ContactSettings>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/contact-settings")
      .then((r) => r.json())
      .then((data) => {
        setForm({
          phone: data.phone ?? "",
          email: data.email ?? "",
          lineUrl: data.lineUrl ?? "",
          address: data.address ?? "",
          mapUrl: data.mapUrl ?? "",
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
          phone: form.phone || null,
          email: form.email || null,
          lineUrl: form.lineUrl || null,
          address: form.address || null,
          mapUrl: form.mapUrl || null,
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
        <h1 className="font-bold text-xl md:text-2xl text-navy">ตั้งค่าช่องทางติดต่อ</h1>
        <p className="text-gray-600 mt-1 md:text-base">
          แก้ไขเบอร์โทร อีเมล Line และที่อยู่ที่ใช้แสดงบน Header, Footer และหน้าติดต่อเรา
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        {message && (
          <div
            className={`p-3 rounded-xl text-sm ${
              message.type === "ok" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}
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
            placeholder="info@poolvilla-estate.com"
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

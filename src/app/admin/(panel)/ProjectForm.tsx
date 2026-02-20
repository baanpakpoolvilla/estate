"use client";

import { useState } from "react";
import ImageUploadField from "@/components/admin/ImageUploadField";

type GalleryItem = { label: string; imageUrl: string };
type HighlightItem = { label: string; value: string };

type ProjectFormData = {
  name: string;
  tagline: string;
  location: string;
  badge: string;
  targetUrl: string;
  imageUrl: string;
  description: string;
  videoId: string;
  gallery: GalleryItem[];
  highlights: HighlightItem[];
  sortOrder: number;
  isActive: boolean;
};

const defaultValues: ProjectFormData = {
  name: "",
  tagline: "",
  location: "",
  badge: "",
  targetUrl: "/villas",
  imageUrl: "",
  description: "",
  videoId: "",
  gallery: [],
  highlights: [],
  sortOrder: 0,
  isActive: true,
};

type ProjectFormProps = {
  initial?: Record<string, unknown>;
  onSubmit: (body: Record<string, unknown>) => Promise<unknown>;
};

function parseJsonArray<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[];
  return [];
}

export default function ProjectForm({ initial, onSubmit }: ProjectFormProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectFormData>(() => {
    if (!initial) return defaultValues;
    return {
      name: String(initial.name ?? ""),
      tagline: String(initial.tagline ?? ""),
      location: String(initial.location ?? ""),
      badge: String(initial.badge ?? ""),
      targetUrl: String(initial.targetUrl ?? "/villas"),
      imageUrl: String(initial.imageUrl ?? ""),
      description: String(initial.description ?? ""),
      videoId: String(initial.videoId ?? ""),
      gallery: parseJsonArray<GalleryItem>(initial.gallery),
      highlights: parseJsonArray<HighlightItem>(initial.highlights),
      sortOrder: Number(initial.sortOrder) || 0,
      isActive: initial.isActive !== false,
    };
  });

  function update<K extends keyof ProjectFormData>(key: K, value: ProjectFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addGalleryItem() {
    update("gallery", [...form.gallery, { label: "", imageUrl: "" }]);
  }
  function removeGalleryItem(index: number) {
    update("gallery", form.gallery.filter((_, i) => i !== index));
  }
  function updateGalleryItem(index: number, field: keyof GalleryItem, value: string) {
    const next = [...form.gallery];
    next[index] = { ...next[index], [field]: value };
    update("gallery", next);
  }

  function addHighlight() {
    update("highlights", [...form.highlights, { label: "", value: "" }]);
  }
  function removeHighlight(index: number) {
    update("highlights", form.highlights.filter((_, i) => i !== index));
  }
  function updateHighlight(index: number, field: keyof HighlightItem, value: string) {
    const next = [...form.highlights];
    next[index] = { ...next[index], [field]: value };
    update("highlights", next);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await onSubmit({
        name: form.name,
        tagline: form.tagline || null,
        location: form.location || null,
        badge: form.badge || null,
        targetUrl: form.targetUrl || null,
        imageUrl: form.imageUrl || null,
        description: form.description || null,
        videoId: form.videoId || null,
        gallery: form.gallery.filter((g) => g.imageUrl),
        highlights: form.highlights.filter((h) => h.label && h.value),
        sortOrder: form.sortOrder,
        isActive: form.isActive,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  }

  const inputCls = "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      {error && (
        <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">{error}</div>
      )}

      {/* Basic Info */}
      <fieldset className="space-y-4 bg-white rounded-xl p-4 border border-gray-100">
        <legend className="text-sm font-semibold text-navy px-2">ข้อมูลพื้นฐาน</legend>
        <div>
          <label className={labelCls}>ชื่อโครงการ *</label>
          <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} className={inputCls} required />
        </div>
        <div>
          <label className={labelCls}>แท็กไลน์</label>
          <input type="text" value={form.tagline} onChange={(e) => update("tagline", e.target.value)} placeholder="พูลวิลล่าหรูวิวทะเล ระดับพรีเมียม" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>ทำเล</label>
          <input type="text" value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="หัวหิน" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>แบดจ์ (เช่น โครงการใหม่)</label>
          <input type="text" value={form.badge} onChange={(e) => update("badge", e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>ลิงก์เมื่อคลิก (จากหน้าแรก)</label>
          <input type="text" value={form.targetUrl} onChange={(e) => update("targetUrl", e.target.value)} placeholder="/villas" className={inputCls} />
        </div>
      </fieldset>

      {/* Media */}
      <fieldset className="space-y-4 bg-white rounded-xl p-4 border border-gray-100">
        <legend className="text-sm font-semibold text-navy px-2">สื่อ</legend>
        <div>
          <ImageUploadField label="รูปภาพหลัก (แสดงบนการ์ด / Hero)" value={form.imageUrl} onChange={(url) => update("imageUrl", url)} />
        </div>
        <div>
          <label className={labelCls}>YouTube Video ID</label>
          <input type="text" value={form.videoId} onChange={(e) => update("videoId", e.target.value)} placeholder="dQw4w9WgXcQ" className={inputCls} />
          <p className="text-xs text-gray-400 mt-1">ใส่เฉพาะ ID เช่น dQw4w9WgXcQ จาก https://youtu.be/dQw4w9WgXcQ</p>
        </div>
      </fieldset>

      {/* Description */}
      <fieldset className="space-y-4 bg-white rounded-xl p-4 border border-gray-100">
        <legend className="text-sm font-semibold text-navy px-2">รายละเอียด</legend>
        <div>
          <label className={labelCls}>รายละเอียดโครงการ</label>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={6}
            placeholder="เขียนรายละเอียดโครงการ..."
            className={`${inputCls} resize-y`}
          />
        </div>
      </fieldset>

      {/* Highlights */}
      <fieldset className="space-y-4 bg-white rounded-xl p-4 border border-gray-100">
        <legend className="text-sm font-semibold text-navy px-2">ไฮไลท์โครงการ</legend>
        <p className="text-xs text-gray-500">เช่น จำนวนหลัง, ขนาดที่ดิน, ราคาเริ่มต้น</p>
        {form.highlights.map((h, i) => (
          <div key={i} className="flex gap-2 items-start">
            <div className="flex-1">
              <input type="text" value={h.label} onChange={(e) => updateHighlight(i, "label", e.target.value)} placeholder="ชื่อ เช่น จำนวนหลัง" className={inputCls} />
            </div>
            <div className="flex-1">
              <input type="text" value={h.value} onChange={(e) => updateHighlight(i, "value", e.target.value)} placeholder="ค่า เช่น 12 หลัง" className={inputCls} />
            </div>
            <button type="button" onClick={() => removeHighlight(i)} className="mt-1 text-red-400 hover:text-red-600 text-sm px-2 py-2">
              ลบ
            </button>
          </div>
        ))}
        <button type="button" onClick={addHighlight} className="text-sm text-blue hover:underline">
          + เพิ่มไฮไลท์
        </button>
      </fieldset>

      {/* Gallery */}
      <fieldset className="space-y-4 bg-white rounded-xl p-4 border border-gray-100">
        <legend className="text-sm font-semibold text-navy px-2">แกลเลอรี่</legend>
        {form.gallery.map((g, i) => (
          <div key={i} className="space-y-2 p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">ภาพที่ {i + 1}</span>
              <button type="button" onClick={() => removeGalleryItem(i)} className="text-red-400 hover:text-red-600 text-xs">
                ลบ
              </button>
            </div>
            <input type="text" value={g.label} onChange={(e) => updateGalleryItem(i, "label", e.target.value)} placeholder="คำอธิบายภาพ" className={inputCls} />
            <ImageUploadField label="" value={g.imageUrl} onChange={(url) => updateGalleryItem(i, "imageUrl", url)} />
          </div>
        ))}
        <button type="button" onClick={addGalleryItem} className="text-sm text-blue hover:underline">
          + เพิ่มรูปภาพ
        </button>
      </fieldset>

      {/* Settings */}
      <fieldset className="space-y-4 bg-white rounded-xl p-4 border border-gray-100">
        <legend className="text-sm font-semibold text-navy px-2">ตั้งค่า</legend>
        <div>
          <label className={labelCls}>ลำดับแสดง</label>
          <input type="number" value={form.sortOrder} onChange={(e) => update("sortOrder", Number(e.target.value) || 0)} className={inputCls} />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => update("isActive", e.target.checked)} className="rounded border-gray-300" />
          <label htmlFor="isActive" className="text-sm text-gray-700">
            แสดงบนเว็บไซต์
          </label>
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={saving}
        className="px-6 py-2.5 rounded-xl bg-blue text-white font-semibold disabled:opacity-70"
      >
        {saving ? "กำลังบันทึก..." : "บันทึก"}
      </button>
    </form>
  );
}

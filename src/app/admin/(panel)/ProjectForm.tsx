"use client";

import { useState } from "react";
import ImageUploadField from "@/components/admin/ImageUploadField";

type ProjectFormData = {
  name: string;
  tagline: string;
  location: string;
  badge: string;
  targetUrl: string;
  imageUrl: string;
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
  sortOrder: 0,
  isActive: true,
};

type ProjectFormProps = {
  initial?: Record<string, unknown>;
  onSubmit: (body: Record<string, unknown>) => Promise<unknown>;
};

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
      sortOrder: Number(initial.sortOrder) || 0,
      isActive: initial.isActive !== false,
    };
  });

  function update<K extends keyof ProjectFormData>(key: K, value: ProjectFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
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
        sortOrder: form.sortOrder,
        isActive: form.isActive,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      {error && (
        <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">{error}</div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อโครงการ *</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">แท็กไลน์</label>
        <input
          type="text"
          value={form.tagline}
          onChange={(e) => update("tagline", e.target.value)}
          placeholder="พูลวิลล่าหรูวิวทะเล ระดับพรีเมียม"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ทำเล</label>
        <input
          type="text"
          value={form.location}
          onChange={(e) => update("location", e.target.value)}
          placeholder="หัวหิน"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">แบดจ์ (เช่น โครงการใหม่)</label>
        <input
          type="text"
          value={form.badge}
          onChange={(e) => update("badge", e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ลิงก์เมื่อคลิก</label>
        <input
          type="text"
          value={form.targetUrl}
          onChange={(e) => update("targetUrl", e.target.value)}
          placeholder="/villas"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy"
        />
      </div>
      <div>
        <ImageUploadField
          label="รูปภาพ (แสดงบนการ์ดหน้าแรก)"
          value={form.imageUrl}
          onChange={(url) => update("imageUrl", url)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ลำดับแสดง</label>
        <input
          type="number"
          value={form.sortOrder}
          onChange={(e) => update("sortOrder", Number(e.target.value) || 0)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={form.isActive}
          onChange={(e) => update("isActive", e.target.checked)}
          className="rounded border-gray-300"
        />
        <label htmlFor="isActive" className="text-sm text-gray-700">
          แสดงบนหน้าแรก
        </label>
      </div>
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
